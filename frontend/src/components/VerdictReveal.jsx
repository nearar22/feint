import { motion } from 'framer-motion';
import { Eye, RotateCcw, ExternalLink } from 'lucide-react';
import VerdictStamp from './VerdictStamp.jsx';
import SuspicionMeter from './SuspicionMeter.jsx';
import { READS, explorerAddress, CONTRACT_ADDRESS } from '../lib/contract.js';

// The stamped verdict-and-reveal moment: the read, the suspicion, the now
// revealed hidden role, and win/lose. The role was sealed on-chain until the
// round settled.
export default function VerdictReveal({ hand, onNext }) {
  const concealed = hand.outcome === 'CONCEALED';
  const deceiver = hand.revealedRole === 'DECEIVER';
  const read = READS[hand.read] || { label: hand.read, blurb: '' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="hairline bg-ink-800/80 px-6 py-8 shadow-spot sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono text-[10px] uppercase tracking-wider2 text-bone-500">The verdict</p>
            <p className="display mt-1 text-3xl leading-none text-bone-100">{read.label}</p>
            {read.blurb && <p className="mono mt-2 text-[11px] text-bone-500">{read.blurb}</p>}
          </div>
          <VerdictStamp outcome={hand.outcome} />
        </div>

        <div className="my-7">
          <SuspicionMeter value={hand.suspicion} />
        </div>

        {/* The reveal: hidden role unsealed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 20 }}
          className="hairline flex items-center justify-between gap-4 bg-ink-900 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <Eye size={16} strokeWidth={2.2} className="text-blood" />
            <div>
              <p className="mono text-[10px] uppercase tracking-wider2 text-bone-500">Your sealed role</p>
              <p className="display text-xl leading-none text-bone-100">
                {deceiver ? 'Deceiver' : 'Truth-teller'}
              </p>
            </div>
          </div>
          <p className="mono max-w-[42%] text-right text-[10px] leading-relaxed text-bone-500">
            {deceiver
              ? 'The claim you held was false. You argued it anyway.'
              : 'The claim you held was true. You stood by it.'}
          </p>
        </motion.div>

        {hand.tell && (
          <div className="mt-4">
            <p className="mono text-[10px] uppercase tracking-wider2 text-bone-500">Strongest tell</p>
            <p className="mt-1 font-body text-sm italic text-bone-300">{hand.tell}</p>
          </div>
        )}

        <div className="mt-6 hairline bg-ink-900 px-5 py-4">
          <p className="display text-lg leading-tight text-bone-100">
            {concealed ? 'You held your composure.' : 'Your composure cracked.'}
          </p>
          <p className="mono mt-1 text-[11px] text-bone-500">
            {concealed
              ? `Streak now ${hand.streak ?? 0}. The interrogator did not call your bluff.`
              : 'Streak reset to 0. The interrogator read you as a bluff.'}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <a
            href={explorerAddress(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noreferrer"
            className="mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-bone-500 hover:text-bone-200"
          >
            <ExternalLink size={12} /> Verify on explorer
          </a>
          <button type="button" onClick={onNext} className="btn-blood inline-flex items-center gap-2 px-6 py-2.5 text-sm">
            <RotateCcw size={14} strokeWidth={2.4} />
            Deal next hand
          </button>
        </div>
      </div>
    </motion.div>
  );
}
