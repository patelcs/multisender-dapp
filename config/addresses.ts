import { worldchain, worldchainSepolia } from "wagmi/chains";

/**
 * ========================================================
 *  POPULAR ADDRESSES LIST (build-time, read-only)
 * ========================================================
 *
 * These addresses ship with the app and appear in the 
 * autocomplete list for ALL users on respective chains.
 */

export interface DefaultAddress {
  address: string;
  label: string;
}

export const POPULAR_ADDRESSES: Record<number, DefaultAddress[]> = {
  // ─── Worldchain ───────────────────────────────────────
  [worldchain.id]: [
    {
      address: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
      label: "MultiSender",
    },
    {
      address: "0x541aB7c31A119441eF3575F6973277DE0eF460bd",
      label: "Uniswap V2: Router",
    },
    {
      address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      label: "Permit2",
    },
  ],

  // ─── Worldchain Sepolia Testnet ────────────────────────────────────────
  [worldchainSepolia.id]: [
    {
      address: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
      label: "MultiSender",
    },
    {
      address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      label: "Permit2",
    },
  ],
};

/**
 * Get popular addresses for a given chain.
 */
export function getPopularAddresses(chainId: number): DefaultAddress[] {
  return POPULAR_ADDRESSES[chainId] ?? [];
}
