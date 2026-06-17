import { motion } from 'framer-motion';
import { statusName } from '../lib/tx.js';
import InterrogatorEye from './InterrogatorEye.jsx';

// Shown while the AI interrogation runs (1-5 min). Communicates that the round
// is live and being judged, without faking a result.
export default function ConsensusWatch({ liveStatus }) {
  const label = liveStatus ? statusName(liveStatus) : 'SUBMITTING';
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 py-6">
      <InterrogatorEye mode="reading" />

      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-blood"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="display text-xl tracking-slab text-bone-200">The interrogator is deliberating</p>
        <p className="mono mt-2 text-[11px] uppercase tracking-wider text-bone-500">
          AI consensus // this can take one to five minutes
        </p>
        <p className="mono mt-3 text-[10px] uppercase tracking-wider2 text-blood">status {label}</p>
      </div>

      <p className="mono max-w-sm text-center text-[11px] leading-relaxed text-bone-500">
        Keep this open. The verdict is read from chain once the round settles; the
        signature receipt alone is not trusted.
      </p>
    </div>
  );
}
