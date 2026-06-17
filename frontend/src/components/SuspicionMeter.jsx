// The single red instrument. A thin horizontal meter that fills to the
// suspicion score. Band thresholds mirror the contract: TRUTH 0-39,
// UNSURE 40-66, BLUFF 67-100.
export default function SuspicionMeter({ value = 0, animate = true }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="mono text-[10px] uppercase tracking-wider2 text-bone-500">Suspicion</span>
        <span className="display text-2xl leading-none text-blood">{pct}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden bg-ink-700 hairline">
        <div
          className={`h-full bg-blood ${animate ? 'animate-suspicion' : ''}`}
          style={animate ? { '--fill': `${pct}%` } : { width: `${pct}%` }}
        />
        {/* band ticks at 40 and 67 */}
        <span className="absolute top-0 h-full w-px bg-bone-200/30" style={{ left: '40%' }} />
        <span className="absolute top-0 h-full w-px bg-bone-200/30" style={{ left: '67%' }} />
      </div>
      <div className="mt-1 flex justify-between mono text-[9px] uppercase tracking-wider text-bone-500">
        <span>Truth</span>
        <span>Unsure</span>
        <span>Bluff</span>
      </div>
    </div>
  );
}
