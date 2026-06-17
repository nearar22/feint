import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID, CHAIN_ID_HEX, RPC_URL, EXPLORER } from '../lib/contract.js';

const BRADBURY_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: 'GenLayer Bradbury Testnet',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: [`${EXPLORER}/`],
};

function getEth() {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function useWallet() {
  const [state, setState] = useState({
    address: null,
    chainId: null,
    connecting: false,
    hasProvider: false,
    error: null,
  });

  useEffect(() => {
    setState((s) => ({ ...s, hasProvider: !!getEth() }));
  }, []);

  const refreshChain = useCallback(async () => {
    const eth = getEth();
    if (!eth) return;
    try {
      const cid = await eth.request({ method: 'eth_chainId' });
      setState((s) => ({ ...s, chainId: parseInt(cid, 16) }));
    } catch {
      /* ignore */
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = getEth();
    if (!eth) {
      setState((s) => ({ ...s, error: 'No wallet detected. Install MetaMask to sit at the table.' }));
      return;
    }
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      try {
        await eth.request({ method: 'wallet_addEthereumChain', params: [BRADBURY_PARAMS] });
      } catch {
        /* chain may already exist */
      }
      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      } catch {
        /* user may decline the switch */
      }
      const cid = await eth.request({ method: 'eth_chainId' });
      setState((s) => ({
        ...s,
        address: accounts[0] ?? null,
        chainId: parseInt(cid, 16),
        connecting: false,
      }));
    } catch (e) {
      const msg = /user rejected|denied/i.test(String(e))
        ? 'Connection declined.'
        : 'Could not connect the wallet.';
      setState((s) => ({ ...s, connecting: false, error: msg }));
    }
  }, []);

  const switchChain = useCallback(async () => {
    const eth = getEth();
    if (!eth) return;
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID_HEX }] });
    } catch {
      try {
        await eth.request({ method: 'wallet_addEthereumChain', params: [BRADBURY_PARAMS] });
      } catch {
        /* ignore */
      }
    }
    await refreshChain();
  }, [refreshChain]);

  const disconnect = useCallback(() => setState((s) => ({ ...s, address: null })), []);

  useEffect(() => {
    const eth = getEth();
    if (!eth?.on) return;
    const onAccounts = (accts) =>
      setState((s) => ({ ...s, address: accts && accts.length ? accts[0] : null }));
    const onChain = () => refreshChain();
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => {
      eth.removeListener?.('accountsChanged', onAccounts);
      eth.removeListener?.('chainChanged', onChain);
    };
  }, [refreshChain]);

  const onRightChain = state.chainId === CHAIN_ID;
  return { ...state, onRightChain, connect, disconnect, switchChain };
}
