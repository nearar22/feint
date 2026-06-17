import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

export const CONTRACT_ADDRESS = '0x3DFAE17DAC9cA83d6e070E240E3128572D721D4F';
export const DEPLOY_TX = '0x004a86b92f887be5e6a0ac43cde917a5a5f26b2723af1d1fcddcf1634010c9b9';
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const RPC_URL = 'https://rpc-bradbury.genlayer.com';
export const NETWORK_NAME = 'Bradbury';
export const CHAIN_ID = 4221;
export const CHAIN_ID_HEX = '0x107D';

export const explorerAddress = (addr) => `${EXPLORER}/address/${addr}`;
export const explorerTx = (hash) => `${EXPLORER}/tx/${hash}`;

// read is one of TRUTH | BLUFF | UNSURE
export const READS = {
  TRUTH: { label: 'Truth', blurb: 'The interrogator believed the claim.' },
  BLUFF: { label: 'Bluff', blurb: 'The interrogator called the bluff.' },
  UNSURE: { label: 'Unsure', blurb: 'The interrogator could not tell.' },
};

export const readClient = createClient({ chain: testnetBradbury });
export const makeWalletClient = (account) => createClient({ chain: testnetBradbury, account });

export async function withRpcRetry(fn, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|temporar|ECONN|503|502/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2200 * 2 ** i));
    }
  }
  throw last;
}

// ---- normalizers (genlayer-js can return Map or plain objects) ------------

function asNumber(v) {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function asString(v) {
  return v === undefined || v === null ? '' : String(v);
}
function pick(obj, key) {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return obj[key];
  return undefined;
}
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v instanceof Map) return Array.from(v.values());
  return [];
}

export function normHand(raw) {
  const status = asString(pick(raw, 'status')) || 'DEALT';
  const settled = status === 'SETTLED';
  return {
    id: asString(pick(raw, 'id')),
    alias: asString(pick(raw, 'alias')) || 'Anonymous',
    player: asString(pick(raw, 'player')),
    claim: asString(pick(raw, 'claim')),
    status,
    seq: asNumber(pick(raw, 'seq')),
    // settled-only fields, empty until the round resolves
    read: settled ? asString(pick(raw, 'read')) : '',
    suspicion: settled ? asNumber(pick(raw, 'suspicion')) : 0,
    outcome: settled ? asString(pick(raw, 'outcome')) : '',
    revealedRole: settled ? asString(pick(raw, 'revealedRole')) : '',
    tell: settled ? asString(pick(raw, 'tell')) : '',
    defense: settled ? asString(pick(raw, 'defense')) : '',
  };
}

async function readView(functionName, args = []) {
  return withRpcRetry(() =>
    readClient.readContract({ address: CONTRACT_ADDRESS, functionName, args })
  );
}

export async function fetchStats() {
  const raw = await readView('get_stats');
  return {
    hands: asNumber(pick(raw, 'hands')),
    settled: asNumber(pick(raw, 'settled')),
    playerWins: asNumber(pick(raw, 'playerWins')),
  };
}

export async function fetchHands(start = 0) {
  const raw = await readView('get_hands', [start]);
  return asArray(raw).map(normHand);
}

export async function fetchHand(handId) {
  const raw = await readView('get_hand', [handId]);
  return normHand(raw);
}

export async function fetchStreak(player) {
  const raw = await readView('get_streak', [player]);
  return asNumber(raw);
}
