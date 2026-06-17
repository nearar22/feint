import { useState } from 'react';
import { Send } from 'lucide-react';

const MAX = 600;

// The defense writer. The player argues the claim is true regardless of their
// secret role. Plain ink panel, mono input, blood submit.
export default function DefenseInput({ onSubmit, disabled }) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const tooLong = trimmed.length > MAX;
  const ready = trimmed.length >= 1 && !tooLong && !disabled;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit(trimmed.slice(0, MAX));
      }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="hairline bg-ink-800/80 p-4">
        <label className="mono mb-2 block text-[10px] uppercase tracking-wider2 text-bone-500">
          Your defense // argue the claim is true
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          rows={4}
          maxLength={MAX + 40}
          placeholder="Make it concrete. Lived detail reads as truth; vagueness reads as a bluff."
          className="w-full resize-none bg-transparent font-body text-sm leading-relaxed text-bone-200 outline-none placeholder:text-bone-500/70 disabled:opacity-50"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className={`mono text-[10px] uppercase tracking-wider ${tooLong ? 'text-blood' : 'text-bone-500'}`}>
            {trimmed.length}/{MAX}
          </span>
          <button type="submit" disabled={!ready} className="btn-blood inline-flex items-center gap-2 px-5 py-2 text-xs">
            <Send size={13} strokeWidth={2.4} />
            Hold the line
          </button>
        </div>
      </div>
    </form>
  );
}
