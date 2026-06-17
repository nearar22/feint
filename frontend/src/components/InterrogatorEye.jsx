import { motion } from 'framer-motion';

// A minimal watching presence: a thin line with a scanning iris that reacts to
// the table phase. No face, just a single horizontal sightline under the
// spotlight. Reads as the interrogator across the table.
export default function InterrogatorEye({ mode = 'idle' }) {
  // mode: idle | watching | reading | verdict
  const reading = mode === 'reading';
  const verdict = mode === 'verdict';

  return (
    <div className="flex w-full flex-col items-center gap-3 select-none">
      <div className="relative h-px w-full max-w-md bg-bone-200/20">
        <motion.span
          className={`absolute -top-1 h-2 w-2 ${verdict ? 'bg-blood' : 'bg-bone-200'}`}
          style={{ left: '50%', borderRadius: '9999px' }}
          animate={
            reading
              ? { x: ['-46%', '46%', '-46%'], opacity: [0.5, 1, 0.5] }
              : verdict
                ? { x: '-50%', scale: [1, 1.6, 1], opacity: 1 }
                : { x: '-50%', opacity: [0.3, 0.8, 0.3] }
          }
          transition={{
            duration: reading ? 2.6 : verdict ? 0.6 : 3.4,
            repeat: verdict ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <p className="mono text-[10px] uppercase tracking-wider2 text-bone-500">
        {mode === 'idle' && 'Interrogator // dormant'}
        {mode === 'watching' && 'Interrogator // watching'}
        {reading && 'Interrogator // reading your defense'}
        {verdict && 'Interrogator // ruling delivered'}
      </p>
    </div>
  );
}
