import { motion } from 'framer-motion';

// The stamped verdict moment. CONCEALED (player won) or EXPOSED (player lost),
// slammed onto the card. Red ink only.
export default function VerdictStamp({ outcome }) {
  const concealed = outcome === 'CONCEALED';
  const label = concealed ? 'Concealed' : 'Exposed';
  return (
    <motion.div
      initial={{ scale: 2.4, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: -8, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 16 }}
      className="pointer-events-none inline-flex items-center justify-center"
    >
      <span
        className={`display border-2 px-5 py-2 text-3xl tracking-slab ${
          concealed ? 'border-blood text-blood' : 'border-bone-200 text-bone-200'
        }`}
        style={concealed ? { boxShadow: '0 0 0 1px rgba(225,29,46,0.4)' } : undefined}
      >
        {label}
      </span>
    </motion.div>
  );
}
