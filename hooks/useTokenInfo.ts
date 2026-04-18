"use client";

import { useReadContract } from "wagmi";
import { ERC20_ABI } from "@/config/abi";

/**
 * Fetch ERC20 token metadata (name, symbol, decimals) from an on-chain address.
 */
export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  const enabled = !!tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000";

  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "name",
    query: { enabled },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: { enabled },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled },
  });

  return {
    name: name as string | undefined,
    symbol: symbol as string | undefined,
    decimals: decimals as number | undefined,
    isLoading: enabled && (name === undefined || symbol === undefined || decimals === undefined),
  };
}
