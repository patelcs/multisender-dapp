"use client";

import { useReadContract, useConnection, useBalance } from "wagmi";
import { ERC20_ABI } from "@/config/abi";
import { useTokenList } from "./useTokenList";
import { useMemo } from "react";

/**
 * Fetch ERC20 token metadata (name, symbol, decimals) and balance from an on-chain address.
 * Prioritizes user-saved custom names from IndexedDB.
 */
export function useTokenInfo(
  tokenAddress: `0x${string}` | undefined, 
  chainId?: number,
  overrideAddress?: `0x${string}`
) {
  const { address: connectedAddress } = useConnection();
  const userAddress = overrideAddress || connectedAddress;
  const { tokens: savedTokens } = useTokenList(false);
  
  const isNative = !tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000";
  const enabled = !!tokenAddress && !isNative;

  // Find if we have a saved version of this token to get the custom name
  const savedToken = useMemo(() => {
    if (!tokenAddress) return undefined;
    return savedTokens.find(
      (t) => t.address.toLowerCase() === tokenAddress.toLowerCase() && 
             (chainId === undefined || t.chainId === chainId)
    );
  }, [savedTokens, tokenAddress, chainId]);

  // Native balance
  const { data: nativeBalanceData, status: nativeStatus } = useBalance({
    address: userAddress,
    chainId,
    query: { enabled: isNative && !!userAddress },
  });

  // ERC20 metadata
  const { data: onChainName, status: nameStatus, error: nameError } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "name",
    chainId,
    query: { 
      enabled: enabled && !savedToken?.name, // Only fetch if we don't have a saved name
      retry: 2
    },
  });

  const name = savedToken?.name || onChainName;

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
  const { data: erc20Balance, refetch: refetchBalance } = useReadContract({
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
    ? ((!savedToken?.name && nameStatus === "pending") || symbolStatus === "pending" || decimalsStatus === "pending")
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
