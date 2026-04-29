"use client";

import { useReadContract, useAccount, useBalance } from "wagmi";
import { ERC20_ABI } from "@/config/abi";

/**
 * Fetch ERC20 token metadata (name, symbol, decimals) and balance from an on-chain address.
 */
export function useTokenInfo(tokenAddress: `0x${string}` | undefined, chainId?: number) {
  const { address: userAddress } = useAccount();
  const isNative = !tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000";
  const enabled = !!tokenAddress && !isNative;

  // Native balance
  const { data: nativeBalanceData, status: nativeStatus } = useBalance({
    address: userAddress,
    chainId,
    query: { enabled: isNative && !!userAddress },
  });

  // ERC20 metadata
  const { data: name, status: nameStatus, error: nameError } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "name",
    chainId,
    query: { 
      enabled, 
      retry: 2
    },
  });

  const { data: symbol, status: symbolStatus } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
    chainId,
    query: { 
      enabled, 
      retry: 2
    },
  });

  const { data: decimals, status: decimalsStatus } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId,
    query: { 
      enabled, 
      retry: 2
    },
  });

  // ERC20 balance
  const { data: erc20Balance, refetch: refetchBalance, status: balanceStatus } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    chainId,
    query: { 
      enabled: enabled && !!userAddress, 
      retry: 2
    },
  });

  const balance = isNative ? nativeBalanceData?.value : (erc20Balance as bigint | undefined);

  // Loading if any enabled query is pending
  const isLoading = enabled 
    ? (nameStatus === "pending" || symbolStatus === "pending" || decimalsStatus === "pending")
    : (isNative && userAddress ? nativeStatus === "pending" : false);

  // Error if critical metadata failed (symbol or decimals)
  const isError = enabled && (symbolStatus === "error" || decimalsStatus === "error");

  if (isError && (nameError || symbolStatus === "error" || decimalsStatus === "error")) {
    console.error("useTokenInfo Error:", nameError || "Symbol/Decimals fetch failed");
  }

  return {
    name: name as string | undefined,
    symbol: symbol as string | undefined,
    decimals: decimals as number | undefined,
    balance,
    refetchBalance,
    isLoading,
    isError,
    error: nameError,
  };
}
