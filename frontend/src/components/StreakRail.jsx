import { Flame } from 'lucide-react';

// A thin composure-streak rail. Consecutive wins shown as red ticks along a
// vertical (or horizontal) hairline. The single red accent again.
export default function StreakRail({ streak = 0, max = 12 }) {
  const count = Math.max(0, streak);
  const ticks = Array.from({ length: Math.max(max, count) });
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Flame size={13} strokeWidth={2.4} className={count > 0 ? 'text-blood' : 'text-bone-500'} />
        <span className="mono text-[10px] uppercase tracking-wider2 text-bone-500">Composure</span>
      </div>
      <div className="flex items-center gap-[3px]">
        {ticks.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-[3px] ${i < count ? 'bg-blood' : 'bg-ink-600'}`}
          />
        ))}
      </div>
      <span className="display text-lg leading-none text-bone-200">{count}</span>
    </div>
  );
}
