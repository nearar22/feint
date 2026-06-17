import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertTriangle } from 'lucide-react';
import InterrogatorEye from '../components/InterrogatorEye.jsx';
import { FAUCET } from '../lib/contract.js';

// A short start screen: take your seat. Not a marketing landing page. One
// alias field and one action, under the spotlight.
export default function StartSeat({ wallet, onTakeSeat, seating, error }) {
  const [alias, setAlias] = useState('');
  const connected = !!wallet.address && wallet.onRightChain;

  return (
    <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-10 px-5 py-12">
      <InterrogatorEye mode="watching" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="display text-5xl leading-none tracking-slab text-bone-100 sm:text-6xl">
          Take your seat
        </h1>
        <p className="mono mx-auto mt-4 max-w-md text-[12px] leading-relaxed text-bone-400">
          You will be secretly dealt a hidden role and a claim. Either way you must
          argue the claim is true. The interrogator reads only your words, never
          your role. Win by concealing it.
        </p>
      </motion.div>

      <div className="w-full">
        <label className="mono mb-2 block text-[10px] uppercase tracking-wider2 text-bone-500">
          Sit under the alias
        </label>
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          maxLength={40}
          placeholder="Anonymous"
          className="hairline w-full bg-ink-800/80 px-4 py-3 font-body text-sm text-bone-200 outline-none placeholder:text-bone-500/70 focus:border-blood"
        />

        {!wallet.address && (
          <button
            type="button"
            onClick={wallet.connect}
            disabled={wallet.connecting}
            className="btn-blood mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Wallet size={15} strokeWidth={2.4} />
            {wallet.connecting ? 'Connecting' : 'Connect wallet to sit'}
          </button>
        )}

        {wallet.address && !wallet.onRightChain && (
          <button
            type="button"
            onClick={wallet.switchChain}
            className="btn-ghost mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm text-blood"
          >
            <AlertTriangle size={15} strokeWidth={2.4} />
            Switch to Bradbury testnet
          </button>
        )}

        {connected && (
          <button
            type="button"
            onClick={() => onTakeSeat(alias.trim())}
            disabled={seating}
            className="btn-blood mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            {seating ? 'Dealing your hand' : 'Deal me in'}
          </button>
        )}

        {error && (
          <p className="mono mt-4 text-center text-[11px] uppercase tracking-wider text-blood">{error}</p>
        )}

        <p className="mono mt-6 text-center text-[10px] uppercase tracking-wider text-bone-500">
          Need test GEN?{' '}
          <a href={FAUCET} target="_blank" rel="noreferrer" className="text-bone-300 underline hover:text-blood">
            Claim from the faucet
          </a>
        </p>
      </div>
    </div>
  );
}
