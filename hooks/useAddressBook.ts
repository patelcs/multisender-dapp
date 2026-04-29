"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import {
  getAddressBook,
  addAddressBookEntry,
  updateAddressBookEntry,
  removeAddressBookEntry,
  type AddressBookEntry,
} from "@/lib/storage";

/**
 * React hook for the address book.
 * Automatically scopes entries to global + current connected wallet.
 */
export function useAddressBook() {
  const { address: userAddress } = useAccount();
  const [entries, setEntries] = useState<AddressBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rev, setRev] = useState(0); // bump to trigger re-read

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getAddressBook(userAddress)
      .then((data) => {
        if (mounted) {
          setEntries(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [userAddress, rev]);

  const add = useCallback(
    async (label: string, address: string, scope: "global" | "user" = "global") => {
      // Duplicate check
      const isDuplicate = entries.some(
        (e) => e.address.toLowerCase() === address.toLowerCase()
      );

      if (isDuplicate) {
        throw new Error("Address already exists in address book");
      }

      await addAddressBookEntry({
        label,
        address,
        scope,
        ownerAddress: scope === "user" ? userAddress : undefined,
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
    async (id: string, updates: Partial<Pick<AddressBookEntry, "label" | "address" | "scope">>) => {
      await updateAddressBookEntry(id, updates);
      setRev((r) => r + 1);
    },
    []
  );

  /** Search entries by label or address substring */
  const search = useCallback(
    (query: string): AddressBookEntry[] => {
      if (!query.trim()) return entries;
      const q = query.toLowerCase();
      return entries.filter((e) => {
        const matchesLabel = e.label.toLowerCase().includes(q);
        // Only match address if query is significant (prevents matching every address when typing "1")
        const matchesAddress =
          (q.startsWith("0x") || q.length >= 4) && e.address.toLowerCase().includes(q);
        return matchesLabel || matchesAddress;
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

  return { entries, isLoading, add, remove, update, search, isAddressSaved, getLabel, refresh };
}
