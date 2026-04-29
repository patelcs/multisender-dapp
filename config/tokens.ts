import { mainnet, sepolia } from "wagmi/chains";

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
  // ─── Ethereum Mainnet ───────────────────────────────────────
  [mainnet.id]: [
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
    },
    {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
    },
  ],

  // ─── Sepolia Testnet ────────────────────────────────────────
  [sepolia.id]: [
    {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      name: "Circle USDC",
      symbol: "USDC",
      decimals: 6,
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
