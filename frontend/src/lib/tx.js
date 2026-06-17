// GenLayer transaction status helpers.
//
// Numeric status codes seen from the SDK / RPC. Terminal codes are 5/6/7/8.
// 12/13 are timeouts and 14 (ACTIVATED) are NON-terminal: the round may still
// settle, so they are not treated as final.
const STATUS_NAME = {
  '1': 'PENDING',
  '2': 'PROPOSING',
  '3': 'COMMITTING',
  '4': 'REVEALING',
  '5': 'ACCEPTED',
  '6': 'UNDETERMINED',
  '7': 'FINALIZED',
  '8': 'CANCELED',
  '12': 'VALIDATORS_TIMEOUT',
  '13': 'LEADER_TIMEOUT',
  '14': 'ACTIVATED',
};

export const statusName = (s) => STATUS_NAME[String(s)] ?? String(s).toUpperCase();

// Terminal statuses: 5 ACCEPTED, 6 UNDETERMINED, 7 FINALIZED, 8 CANCELED.
const TERMINAL = new Set(['ACCEPTED', 'UNDETERMINED', 'FINALIZED', 'CANCELED']);

export const isTerminal = (status) => TERMINAL.has(status);

// Poll a tx hash until it reaches a terminal status. This is a best-effort
// signal only; the authoritative success check is reading the hand status from
// chain (get_hand becomes SETTLED). Timeouts (12/13) and ACTIVATED (14) keep
// the loop alive.
export async function pollUntilDecided(client, hash, onUpdate, maxTries = 180) {
  for (let i = 0; i < maxTries; i++) {
    const tx = await client.getTransaction({ hash }).catch(() => null);
    const status = statusName(tx ? tx.status : 'PENDING');
    onUpdate?.(status);
    if (TERMINAL.has(status)) return { status };
    await new Promise((r) => setTimeout(r, 8000));
  }
  return { status: 'TIMEOUT' };
}

export function friendlyWriteError(e) {
  const s = String(e);
  if (/user rejected|denied|rejected the request/i.test(s)) return 'You declined the signature request.';
  if (/LackOfFundForMaxFee|insufficient/i.test(s))
    return 'Wallet balance is below the AI-write fee reserve. Claim test GEN from the faucet and retry.';
  if (/rate limit|429/i.test(s)) return 'The table is busy. Wait a moment and retry.';
  return 'The interrogation could not be sealed. Please retry.';
}

// Only user-rejection and insufficient-funds are hard, immediate failures.
export function isHardWriteError(e) {
  return /user rejected|denied|rejected the request|LackOfFundForMaxFee|insufficient/i.test(String(e));
}
