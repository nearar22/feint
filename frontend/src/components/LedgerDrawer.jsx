import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, ScrollText } from 'lucide-react';
import { useLedger } from '../hooks/useLedger.js';
import { explorerAddress, CONTRACT_ADDRESS } from '../lib/contract.js';
import { LedgerRowSkeleton } from './Skeletons.jsx';

function short(addr) {
  if (!addr) return '0x0';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function HandRow({ hand }) {
  const concealed = hand.outcome === 'CONCEALED';
  return (
    <div className="hairline bg-ink-800/70 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="display text-sm leading-snug text-bone-200 line-clamp-2">{hand.claim}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 mono text-[10px] uppercase tracking-wider text-bone-500">
            <span>{hand.alias}</span>
            <span>role {hand.revealedRole || 'sealed'}</span>
            <span>read {hand.read}</span>
            <span>susp {hand.suspicion}</span>
          </div>
        </div>
        <span
          className={`display shrink-0 border px-2 py-1 text-[11px] tracking-slab ${
            concealed ? 'border-blood text-blood' : 'border-bone-400 text-bone-400'
          }`}
        >
          {concealed ? 'Won' : 'Lost'}
        </span>
      </div>
    </div>
  );
}

export default function LedgerDrawer({ open, onClose }) {
  const { hands, stats, loading, error, reload } = useLedger(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-900/80"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-bone-200/15 bg-ink-900"
          >
            <header className="flex items-center justify-between border-b border-bone-200/15 px-5 py-4">
              <div className="flex items-center gap-2">
                <ScrollText size={16} strokeWidth={2.4} className="text-blood" />
                <h2 className="display text-lg tracking-slab text-bone-200">Past hands</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-bone-400 hover:text-bone-100"
                aria-label="Close ledger"
              >
                <X size={18} />
              </button>
            </header>

            {stats && (
              <div className="grid grid-cols-3 border-b border-bone-200/15">
                {[
                  ['Hands', stats.hands],
                  ['Settled', stats.settled],
                  ['Player wins', stats.playerWins],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-bone-200/10 px-4 py-3 last:border-r-0">
                    <p className="display text-2xl leading-none text-bone-200">{value}</p>
                    <p className="mono text-[9px] uppercase tracking-wider text-bone-500">{label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
              {loading && (
                <>
                  <LedgerRowSkeleton />
                  <LedgerRowSkeleton />
                  <LedgerRowSkeleton />
                </>
              )}

              {!loading && error && (
                <div className="hairline bg-ink-800 px-4 py-6 text-center">
                  <p className="mono text-xs text-bone-400">{error}</p>
                  <button type="button" onClick={reload} className="btn-ghost mt-3 px-3 py-1.5 text-[11px]">
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && hands.length === 0 && (
                <div className="hairline flex flex-col items-center gap-2 bg-ink-800 px-4 py-10 text-center">
                  <ScrollText size={22} strokeWidth={1.6} className="text-bone-500" />
                  <p className="display text-sm tracking-slab text-bone-300">No settled hands yet</p>
                  <p className="mono text-[11px] text-bone-500">
                    Survive an interrogation and it will be recorded here.
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                hands.map((h) => <HandRow key={h.id} hand={h} />)}
            </div>

            <footer className="border-t border-bone-200/15 px-5 py-3">
              <a
                href={explorerAddress(CONTRACT_ADDRESS)}
                target="_blank"
                rel="noreferrer"
                className="mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-bone-500 hover:text-bone-200"
              >
                <ExternalLink size={12} /> View contract on explorer
              </a>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
