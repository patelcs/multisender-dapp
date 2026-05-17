import { worldchain, worldchainSepolia } from "wagmi/chains";

/**
 * ============================================
 *  DEFAULT TOKEN LIST (build-time, read-only)
 * ============================================
 *
 * These tokens ship with the app and are visible to ALL users
 * on the respective chains — no configuration needed.
 *
 * To add a token:
 *   1. Find the chain's array below (or add a new chain key)
 *   2. Add an entry with { address, name, symbol, decimals }
 *
 * These are READ-ONLY in the UI — users cannot delete them.
 * Users can add their own tokens via Settings, which are stored
 * separately in localStorage.
 */

export interface DefaultToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const DEFAULT_TOKENS: Record<number, DefaultToken[]> = {
  // ─── worldchain mainnet ───────────────────────────────────────
  [worldchain.id]: [
    {
      address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
      name: "Worldcoin",
      symbol: "WLD",
      decimals: 18,
    },
    {
      address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
    },
    {
      address: "0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
    },
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether ",
      symbol: "WETH",
      decimals: 18,
    },
    {
      address: "0x859DBE24b90C9f2f7742083d3cf59cA41f55Be5d",
      name: "Savings Dai",
      symbol: "sDAI ",
      decimals: 18,
    },
  ],

  // ─── worldchainSepolia Testnet ────────────────────────────────────────
  [worldchainSepolia.id]: [
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether ",
      symbol: "WETH",
      decimals: 18,
    },
  ],
};

/**
 * Get default tokens for a given chain.
 * Returns an empty array if no defaults are configured.
 */
export function getDefaultTokens(chainId: number): DefaultToken[] {
  return DEFAULT_TOKENS[chainId] ?? [];
}
