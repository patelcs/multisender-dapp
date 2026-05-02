"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnection, useChainId } from "wagmi";
import {
  getTokenList,
  getAllTokenList,
  addSavedToken,
  updateSavedToken,
  removeSavedToken,
  type SavedToken,
} from "@/lib/storage";
import { getDefaultTokens } from "@/config/tokens";
import { SUPPORTED_CHAINS } from "@/config/chains";

/** A token entry shown in the UI — can be a default (read-only) or user-saved */
export interface TokenEntry {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  scope: "default" | "global" | "user";
  /** true for build-time defaults — cannot be deleted */
  isDefault: boolean;
}

/**
 * React hook for tokens on the current chain.
 * Merges build-time defaults from config/tokens.ts with user-saved tokens.
 */
export function useTokenList(filteredByChain: boolean = true) {
  const { address: userAddress } = useConnection();
  const chainId = useChainId();
  const [savedTokens, setSavedTokens] = useState<SavedToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      setIsLoading(true);
    });
    
    const fetchTokens = async () => {
      if (filteredByChain) {
        return getTokenList(chainId, userAddress);
      } else {
        const all = await getAllTokenList();
        // Still filter by scope but keep all chains
        return all.filter(
          (e) =>
            e.scope === "global" ||
            (e.scope === "user" && userAddress && e.ownerAddress?.toLowerCase() === userAddress.toLowerCase())
        );
      }
    };

    fetchTokens()
      .then((data) => {
        if (mounted) {
          setSavedTokens(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [chainId, userAddress, rev, filteredByChain]);

  /** Merged list: defaults first, then user-saved (deduped) */
  const tokens: TokenEntry[] = useMemo(() => {
    let defaultEntries: TokenEntry[] = [];

    if (filteredByChain) {
      const defaults = getDefaultTokens(chainId);
      defaultEntries = defaults.map((d, i) => ({
        id: `default-${chainId}-${i}`,
        address: d.address,
        name: d.name,
        symbol: d.symbol,
        decimals: d.decimals,
        chainId,
        scope: "default",
        isDefault: true,
      }));
    } else {
      SUPPORTED_CHAINS.forEach((chain) => {
        const defaults = getDefaultTokens(chain.id);
        defaults.forEach((d, i) => {
          defaultEntries.push({
            id: `default-${chain.id}-${i}`,
            address: d.address,
            name: d.name,
            symbol: d.symbol,
            decimals: d.decimals,
            chainId: chain.id,
            scope: "default",
            isDefault: true,
          });
        });
      });
    }

    // Set of default keys (address + chainId) for dedup
    const defaultKeySet = new Set(defaultEntries.map((d) => `${d.address.toLowerCase()}-${d.chainId}`));

    // User-saved tokens that aren't duplicates of defaults
    const userEntries: TokenEntry[] = savedTokens
      .filter((t) => !defaultKeySet.has(`${t.address.toLowerCase()}-${t.chainId}`))
      .map((t) => ({
        id: t.id,
        address: t.address,
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
        chainId: t.chainId,
        scope: t.scope,
        isDefault: false,
      }));

    return [...defaultEntries, ...userEntries];
  }, [chainId, savedTokens, filteredByChain]);

  const add = useCallback(
    async (
      token: { address: string; name: string; symbol: string; decimals: number; chainId?: number },
      scope: "global" | "user" = "global"
    ) => {
      const targetChainId = token.chainId ?? chainId;
      
      // Duplicate check: address + chainId
      const isDuplicate = tokens.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === targetChainId
      );

      if (isDuplicate) {
        throw new Error(`Token already exists on this network`);
      }

      await addSavedToken({
        ...token,
        chainId: targetChainId,
        scope,
        ownerAddress: scope === "user" ? userAddress : undefined,
      });
      setRev((r) => r + 1);
    },
    [chainId, userAddress, tokens]
  );

  const remove = useCallback(async (id: string) => {
    await removeSavedToken(id);
    setRev((r) => r + 1);
  }, []);

  const update = useCallback(
    async (id: string, updates: Partial<Pick<SavedToken, "name" | "symbol" | "decimals" | "scope">>) => {
      await updateSavedToken(id, updates);
      setRev((r) => r + 1);
    },
    []
  );

  /** Check if a token address is already in the list (default or saved) */
  const isTokenSaved = useCallback(
    (address: string): boolean => {
      return tokens.some((t) => t.address.toLowerCase() === address.toLowerCase());
    },
    [tokens]
  );

  /** Force refresh from IndexedDB */
  const refresh = useCallback(() => setRev((r) => r + 1), []);

  return { tokens, isLoading, add, remove, update, isTokenSaved, refresh };
}
