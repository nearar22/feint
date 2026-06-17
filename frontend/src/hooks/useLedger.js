import { useCallback, useEffect, useState } from 'react';
import { fetchHands, fetchStats } from '../lib/contract.js';

// Loads settled hands for the past-hands ledger and the table stats.
export function useLedger(active) {
  const [hands, setHands] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [page, s] = await Promise.all([fetchHands(0), fetchStats()]);
      setHands(page.filter((h) => h.status === 'SETTLED'));
      setStats(s);
    } catch {
      setError('Could not reach the table records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (active) load();
  }, [active, load]);

  return { hands, stats, loading, error, reload: load };
}
