import { worldchain, worldchainSepolia } from "wagmi/chains";

/**
 * ==============================
 *  MULTI-CHAIN CONFIGURATION
 * ==============================
 *
 * This is the SINGLE SOURCE OF TRUTH for all chain-related config.
 * To add a new chain:
 *   1. Import it from "wagmi/chains"
 *   2. Add it to SUPPORTED_CHAINS
 *   3. Add its contract address to MULTISENDER_ADDRESSES
 *   4. (Optional) add a block explorer override to EXPLORER_URLS
 *
 * That's it — everything else reads from here.
 */

export const SUPPORTED_CHAINS = [worldchain, worldchainSepolia] as const;

/** Sandwich contract address per chain ID */
export const MULTISENDER_ADDRESSES: Record<number, `0x${string}`> = {
  [worldchain.id]: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
  [worldchainSepolia.id]: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
};

/** Block explorer base URLs (wagmi chains have these, but override here if needed) */
export const EXPLORER_URLS: Record<number, string> = {
  [worldchain.id]: "https://worldscan.org/",
  [worldchainSepolia.id]: "https://sepolia.worldscan.org/",
};

/** Native currency symbols per chain ID */
export const NATIVE_CURRENCY: Record<number, { name: string; symbol: string; decimals: number }> = {
  [worldchain.id]: { name: "Ether", symbol: "ETH", decimals: 18 },
  [worldchainSepolia.id]: { name: "worldchainSepolia Ether", symbol: "ETH", decimals: 18 },
};
