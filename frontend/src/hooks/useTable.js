import { useCallback, useRef, useState } from 'react';
import {
  makeWalletClient,
  CONTRACT_ADDRESS,
  fetchHand,
  fetchStats,
  fetchStreak,
} from '../lib/contract.js';
import { pollUntilDecided, friendlyWriteError, isHardWriteError } from '../lib/tx.js';

// Phases of a single hand at the kiosk.
//   idle      - no hand yet, start screen
//   seating   - take_seat write in flight (fast, deterministic)
//   dealt     - claim is on the table, awaiting a defense
//   wallet    - defend signature requested
//   consensus - AI interrogation running (1-5 min), polling for SETTLED
//   settled   - verdict + reveal available
//   error     - hard failure
const INITIAL = {
  phase: 'idle',
  hand: null,
  liveStatus: '',
  error: null,
};

export function useTable() {
  const [state, setState] = useState(INITIAL);
  const busy = useRef(false);

  const reset = useCallback(() => {
    busy.current = false;
    setState(INITIAL);
  }, []);

  // take_seat: deterministic and fast. Returns {id, claim, status:"DEALT"}.
  const takeSeat = useCallback(async (account, alias) => {
    if (busy.current) return false;
    busy.current = true;
    setState({ ...INITIAL, phase: 'seating' });

    const client = makeWalletClient(account);
    let baseline = 0;
    try {
      baseline = (await fetchStats()).hands;
    } catch {
      baseline = 0;
    }

    let hash = null;
    try {
      hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: 'take_seat',
        args: [alias || 'Anonymous'],
        value: 0n,
      });
    } catch (e) {
      if (isHardWriteError(e)) {
        setState({ ...INITIAL, phase: 'error', error: friendlyWriteError(e) });
        busy.current = false;
        return false;
      }
      // Non-fatal: the seat may still have been dealt; fall through to polling.
    }

    if (hash) {
      await pollUntilDecided(client, hash, (liveStatus) =>
        setState((s) => ({ ...s, liveStatus })), 60);
    }

    // Confirm by watching the hand count rise, then load the newest hand.
    for (let i = 0; i < 40; i++) {
      try {
        const stats = await fetchStats();
        if (stats.hands > baseline) {
          const handId = `hand-${stats.hands}`;
          const hand = await fetchHand(handId).catch(() => null);
          if (hand && hand.id) {
            setState({ ...INITIAL, phase: 'dealt', hand });
            busy.current = false;
            return true;
          }
        }
      } catch {
        /* keep polling */
      }
      await new Promise((r) => setTimeout(r, 3000));
    }

    setState({
      ...INITIAL,
      phase: 'error',
      error: 'The seat did not deal in time. Please retry.',
    });
    busy.current = false;
    return false;
  }, []);

  // defend: an AI write that runs 1-5 min. The SDK can throw on the receipt
  // even though the tx is live, so success is confirmed by polling the hand
  // status until it becomes SETTLED, then reading the verdict from chain.
  const defend = useCallback(async (account, handId, defenseText) => {
    if (busy.current) return false;
    busy.current = true;
    setState((s) => ({ ...s, phase: 'wallet', error: null, liveStatus: '' }));

    const client = makeWalletClient(account);
    let hash = null;
    try {
      hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: 'defend',
        args: [handId, defenseText],
        value: 0n,
      });
    } catch (e) {
      if (isHardWriteError(e)) {
        setState((s) => ({ ...s, phase: 'error', error: friendlyWriteError(e) }));
        busy.current = false;
        return false;
      }
      // Non-fatal throw on receipt parse: tx is likely live, keep going.
    }

    setState((s) => ({ ...s, phase: 'consensus' }));

    if (hash) {
      // Best-effort tx watch; non-terminal timeouts/ACTIVATED keep it alive.
      pollUntilDecided(client, hash, (liveStatus) =>
        setState((s) => ({ ...s, liveStatus }))).catch(() => {});
    }

    // Authoritative confirmation: poll get_hand until SETTLED. Allow up to
    // ~9 minutes of slow polling for the consensus window.
    for (let i = 0; i < 90; i++) {
      try {
        const hand = await fetchHand(handId);
        if (hand && hand.status === 'SETTLED') {
          let streak = 0;
          try {
            streak = await fetchStreak(hand.player);
          } catch {
            streak = 0;
          }
          setState({ ...INITIAL, phase: 'settled', hand: { ...hand, streak } });
          busy.current = false;
          return true;
        }
      } catch {
        /* keep polling through transient read errors */
      }
      await new Promise((r) => setTimeout(r, 6000));
    }

    setState((s) => ({
      ...s,
      phase: 'error',
      error: 'The interrogation is still in consensus. It may settle shortly; check the ledger.',
    }));
    busy.current = false;
    return false;
  }, []);

  return { state, setState, takeSeat, defend, reset };
}
