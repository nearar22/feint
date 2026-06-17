import { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Atmosphere from './components/Atmosphere.jsx';
import TableHeader from './components/TableHeader.jsx';
import LedgerDrawer from './components/LedgerDrawer.jsx';
import Table from './scenes/Table.jsx';
import NotFound from './scenes/NotFound.jsx';
import { useWallet } from './hooks/useWallet.js';
import { useTable } from './hooks/useTable.js';
import { fetchStreak, CONTRACT_ADDRESS, explorerAddress } from './lib/contract.js';

function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-bone-200/10 px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="mono text-[10px] uppercase tracking-wider text-bone-500">
          Feint // AI bluff duel on GenLayer Bradbury
        </p>
        <a
          href={explorerAddress(CONTRACT_ADDRESS)}
          target="_blank"
          rel="noreferrer"
          className="mono text-[10px] uppercase tracking-wider text-bone-500 hover:text-bone-200"
        >
          {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)}
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const wallet = useWallet();
  const table = useTable();
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  const loadStreak = useCallback(async () => {
    if (!wallet.address) {
      setStreak(0);
      return;
    }
    try {
      setStreak(await fetchStreak(wallet.address));
    } catch {
      /* leave prior value */
    }
  }, [wallet.address]);

  // Refresh the player's composure streak when wallet changes or a hand settles.
  useEffect(() => {
    loadStreak();
  }, [loadStreak, table.state.phase]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Atmosphere />
      <TableHeader wallet={wallet} onOpenLedger={() => setLedgerOpen(true)} />

      <main className="relative z-10 flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Table wallet={wallet} table={table} streak={streak} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <LedgerDrawer open={ledgerOpen} onClose={() => setLedgerOpen(false)} />
    </div>
  );
}
