import { motion } from 'framer-motion';

// The dealt claim, centered under the spotlight. Heavy bone card on ink with a
// thin frame. Deals in with a framer-motion entrance.
export default function ClaimCard({ claim, alias, handId, dimmed = false }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0, rotateX: -18 }}
      animate={{ y: 0, opacity: dimmed ? 0.55 : 1, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="relative mx-auto w-full max-w-xl"
      style={{ perspective: 800 }}
    >
      <div className="hairline bg-bone-100 px-8 py-10 text-ink-900 shadow-spot">
        <div className="mb-5 flex items-center justify-between">
          <span className="mono text-[10px] uppercase tracking-wider2 text-ink-400">
            {handId || 'the claim'}
          </span>
          <span className="mono text-[10px] uppercase tracking-wider2 text-blood">defend as true</span>
        </div>
        <p className="display text-2xl leading-tight text-ink-900 sm:text-3xl">
          {claim || '...'}
        </p>
        {alias && (
          <div className="mt-6 border-t border-ink-900/15 pt-4">
            <span className="mono text-[11px] uppercase tracking-wider text-ink-400">
              seated as {alias}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
