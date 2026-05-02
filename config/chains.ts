import { mainnet, sepolia } from "wagmi/chains";

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

export const SUPPORTED_CHAINS = [mainnet, sepolia] as const;

/** Sandwich contract address per chain ID */
export const MULTISENDER_ADDRESSES: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // TODO: replace with deployed address
  [sepolia.id]: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
};

/** Block explorer base URLs (wagmi chains have these, but override here if needed) */
export const EXPLORER_URLS: Record<number, string> = {
  [mainnet.id]: "https://etherscan.io",
  [sepolia.id]: "https://sepolia.etherscan.io",
};

/** Native currency symbols per chain ID */
export const NATIVE_CURRENCY: Record<number, { name: string; symbol: string; decimals: number }> = {
  [mainnet.id]: { name: "Ether", symbol: "ETH", decimals: 18 },
  [sepolia.id]: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
};
