import { ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import WalletButton from './WalletButton.jsx';

export default function TableHeader({ wallet, onOpenLedger }) {
  return (
    <header className="relative z-30 flex items-center justify-between px-5 py-4 sm:px-8">
      <Link to="/" className="group flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center bg-blood">
          <span className="display text-base leading-none text-bone-100">F</span>
        </span>
        <div className="leading-none">
          <p className="display text-xl tracking-slab text-bone-100 group-hover:text-bone-300">Feint</p>
          <p className="mono text-[9px] uppercase tracking-wider2 text-bone-500">bluff duel</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenLedger}
          className="btn-ghost inline-flex items-center gap-2 px-3 py-2 text-xs"
        >
          <ScrollText size={14} strokeWidth={2.4} />
          <span className="hidden sm:inline">Past hands</span>
        </button>
        <WalletButton wallet={wallet} />
      </div>
    </header>
  );
}
