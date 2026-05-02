"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnection, useChainId } from "wagmi";
import {
  getAddressBook,
  addAddressBookEntry,
  updateAddressBookEntry,
  removeAddressBookEntry,
  type AddressBookEntry,
} from "@/lib/storage";
import { getPopularAddresses } from "@/config/addresses";

import { DEFAULT_ADDRESS_TAGS } from "@/config/address-tags";

/** 
 * Extended entry type for the hook, including build-time defaults.
 */
export type AddressBookEntryWithDefault = (AddressBookEntry | {
  id: string;
  label: string;
  address: string;
  scope: "default";
  chainId?: number;
  tags: string[];
  createdAt: number;
});

/**
 * React hook for the address book.
 * Automatically scopes entries to global + current connected wallet.
 * Also includes popular contract addresses for the current chain.
 */
export function useAddressBook(chainIdOverride?: number) {
  const { address: userAddress } = useConnection();
  const currentChainId = useChainId();
  const chainId = chainIdOverride || currentChainId;
  const [savedEntries, setSavedEntries] = useState<AddressBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rev, setRev] = useState(0); // bump to trigger re-read

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      setIsLoading(true);
    });
    getAddressBook(userAddress, chainId)
      .then((data) => {
        if (mounted) {
          setSavedEntries(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [userAddress, chainId, rev]);

  // Merge build-time popular addresses
  const entries = useMemo(() => {
    const popular = getPopularAddresses(chainId).map(addr => ({
      id: `popular-${addr.address}`,
      label: addr.label,
      address: addr.address,
      scope: "default" as const,
      chainId: chainId,
      tags: ["Contract"],
      createdAt: 0
    }));

    return [...popular, ...savedEntries];
  }, [savedEntries, chainId]);

  /** Unique tags across all entries (popular + saved) */
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>(DEFAULT_ADDRESS_TAGS);
    entries.forEach((e) => e.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [entries]);

  const add = useCallback(
    async (
      label: string, 
      address: string, 
      scope: "global" | "user" = "global", 
      tags: string[] = [], 
      entryChainId?: number
    ) => {
      // Duplicate check (including popular ones)
      const isDuplicate = entries.some(
        (e) => e.address.toLowerCase() === address.toLowerCase() && (e.chainId === entryChainId || e.chainId === undefined)
      );

      if (isDuplicate) {
        throw new Error("Address already exists in address book for this scope");
      }

      await addAddressBookEntry({
        label,
        address,
        scope,
        ownerAddress: scope === "user" ? userAddress : undefined,
        tags,
        chainId: entryChainId,
      });
      setRev((r) => r + 1);
    },
    [userAddress, entries]
  );

  const remove = useCallback(async (id: string) => {
    await removeAddressBookEntry(id);
    setRev((r) => r + 1);
  }, []);

  const update = useCallback(
    async (id: string, updates: Partial<Pick<AddressBookEntry, "label" | "address" | "scope" | "tags" | "chainId">>) => {
      await updateAddressBookEntry(id, updates);
      setRev((r) => r + 1);
    },
    []
  );

  /** Search entries by label, address, or tag */
  const search = useCallback(
    (query: string, tagFilter?: string): AddressBookEntryWithDefault[] => {
      let filtered = entries;
      
      if (tagFilter) {
        filtered = filtered.filter((e) => e.tags?.includes(tagFilter));
      }

      if (!query.trim()) return filtered;
      
      const q = query.toLowerCase();
      return filtered.filter((e) => {
        const matchesLabel = e.label.toLowerCase().includes(q);
        const matchesAddress =
          (q.startsWith("0x") || q.length >= 4) && e.address.toLowerCase().includes(q);
        const matchesTags = e.tags?.some((t) => t.toLowerCase().includes(q));
        return matchesLabel || matchesAddress || matchesTags;
      });
    },
    [entries]
  );

  /** Check if an address is already in the address book */
  const isAddressSaved = useCallback(
    (address: string): boolean => {
      return entries.some((e) => e.address.toLowerCase() === address.toLowerCase());
    },
    [entries]
  );

  /** Get the label for a saved address, or undefined */
  const getLabel = useCallback(
    (address: string): string | undefined => {
      return entries.find((e) => e.address.toLowerCase() === address.toLowerCase())?.label;
    },
    [entries]
  );

  /** Force refresh from IndexedDB */
  const refresh = useCallback(() => setRev((r) => r + 1), []);

  return { entries, isLoading, add, remove, update, search, isAddressSaved, getLabel, refresh, uniqueTags };
}
