import { mainnet, sepolia } from "wagmi/chains";

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
  // ─── Ethereum Mainnet ───────────────────────────────────────
  [mainnet.id]: [
    {
      address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
      label: "Uniswap V3: Router",
    },
    {
      address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      label: "Uniswap V3: Router 1",
    },
    {
      address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      label: "Uniswap V2: Router",
    },
    {
      address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      label: "Permit2",
    },
    {
      address: "0x1111111254EEB25477B68fb85Ed929f73A960582",
      label: "1inch: Router V5",
    },
    {
      address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
      label: "0x: Exchange Proxy",
    },
  ],

  // ─── Sepolia Testnet ────────────────────────────────────────
  [sepolia.id]: [
    {
      address: "0xC532a74256D3Db42D0FE72a790191Cc2028F971e",
      label: "Uniswap V2: Router",
    },
    {
      address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      label: "Permit2",
    },
    {
      address: "0x9025d62b6fBc72f7027Df204Cc32a702B19Be642",
      label: "MultiSender",
    },
  ],
};

/**
 * Get popular addresses for a given chain.
 */
export function getPopularAddresses(chainId: number): DefaultAddress[] {
  return POPULAR_ADDRESSES[chainId] ?? [];
}
