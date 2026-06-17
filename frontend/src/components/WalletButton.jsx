import { Wallet, AlertTriangle, Check } from 'lucide-react';

function short(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// A real MetaMask connection (window.ethereum). Named loosely as a wallet
// button but performs eth_requestAccounts and chain add/switch.
export default function WalletButton({ wallet }) {
  const { address, connecting, onRightChain, connect, switchChain } = wallet;

  if (!address) {
    return (
      <button
        type="button"
        onClick={connect}
        disabled={connecting}
        className="btn-blood inline-flex items-center gap-2 px-4 py-2 text-xs"
      >
        <Wallet size={14} strokeWidth={2.4} />
        {connecting ? 'Connecting' : 'Connect wallet'}
      </button>
    );
  }

  if (!onRightChain) {
    return (
      <button
        type="button"
        onClick={switchChain}
        className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-xs text-blood"
      >
        <AlertTriangle size={14} strokeWidth={2.4} />
        Switch to Bradbury
      </button>
    );
  }

  return (
    <div className="hairline inline-flex items-center gap-2 bg-ink-800/80 px-4 py-2 mono text-xs text-bone-300">
      <Check size={14} strokeWidth={2.6} className="text-blood" />
      {short(address)}
    </div>
  );
}
