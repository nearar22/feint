import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import StartSeat from './StartSeat.jsx';
import ClaimCard from '../components/ClaimCard.jsx';
import { ClaimSkeleton } from '../components/Skeletons.jsx';
import DefenseInput from '../components/DefenseInput.jsx';
import ConsensusWatch from '../components/ConsensusWatch.jsx';
import VerdictReveal from '../components/VerdictReveal.jsx';
import InterrogatorEye from '../components/InterrogatorEye.jsx';
import StreakRail from '../components/StreakRail.jsx';

// The primary surface: a single focused hand at a time, no scrolling feed.
export default function Table({ wallet, table, streak }) {
  const { state, takeSeat, defend, reset } = table;
  const { phase, hand, liveStatus, error } = state;
  const account = wallet.address;

  const onTakeSeat = (alias) => takeSeat(account, alias);
  const onDefend = (text) => defend(account, hand.id, text);

  // Start screen
  if (phase === 'idle' || (phase === 'error' && !hand)) {
    return (
      <StartSeat
        wallet={wallet}
        onTakeSeat={onTakeSeat}
        seating={false}
        error={phase === 'error' ? error : wallet.error}
      />
    );
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl px-5 py-8">
      {/* composure streak rail */}
      <div className="mb-8 flex justify-center">
        <StreakRail streak={phase === 'settled' && hand?.streak != null ? hand.streak : streak} />
      </div>

      <AnimatePresence mode="wait">
        {/* seating: dealing skeleton */}
        {phase === 'seating' && (
          <motion.div key="seating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClaimSkeleton />
            <p className="mono mt-6 text-center text-[11px] uppercase tracking-wider text-bone-500">
              Dealing your hand
            </p>
          </motion.div>
        )}

        {/* dealt: claim on the table, defense input */}
        {phase === 'dealt' && hand && (
          <motion.div
            key="dealt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <ClaimCard claim={hand.claim} alias={hand.alias} handId={hand.id} />
            <InterrogatorEye mode="watching" />
            <DefenseInput onSubmit={onDefend} disabled={false} />
          </motion.div>
        )}

        {/* wallet + consensus: AI interrogation running */}
        {(phase === 'wallet' || phase === 'consensus') && hand && (
          <motion.div
            key="consensus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <ClaimCard claim={hand.claim} alias={hand.alias} handId={hand.id} dimmed />
            <ConsensusWatch liveStatus={phase === 'consensus' ? liveStatus : ''} />
          </motion.div>
        )}

        {/* settled: verdict + reveal */}
        {phase === 'settled' && hand && (
          <motion.div key="settled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VerdictReveal hand={hand} onNext={reset} />
          </motion.div>
        )}

        {/* error with an active hand: allow retry of the defense */}
        {phase === 'error' && hand && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ClaimCard claim={hand.claim} alias={hand.alias} handId={hand.id} dimmed />
            <div className="hairline mx-auto max-w-xl bg-ink-800/80 px-6 py-6 text-center">
              <AlertTriangle size={20} strokeWidth={2} className="mx-auto text-blood" />
              <p className="mono mt-3 text-xs leading-relaxed text-bone-300">{error}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button type="button" onClick={reset} className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-xs">
                  <RotateCcw size={13} strokeWidth={2.4} /> New seat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
