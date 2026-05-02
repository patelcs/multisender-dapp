"use client";

import { useState, useEffect, useCallback } from "react";
import { getCustomRPCs, setCustomRPC, removeCustomRPC, type CustomRPC } from "@/lib/storage";

export function useRPCConfig() {
  const [rpcs, setRpcs] = useState<CustomRPC[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await getCustomRPCs();
    setRpcs(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      refresh();
    });
  }, [refresh]);

  const update = async (chainId: number, url: string) => {
    if (!url.trim()) {
      await removeCustomRPC(chainId);
    } else {
      await setCustomRPC(chainId, url);
    }
    await refresh();
    // Force a reload of the wagmi config if possible, 
    // but usually a page refresh is safer for core transport changes.
    // window.location.reload(); 
  };

  const getRpcForChain = (chainId: number) => {
    return rpcs.find((r) => r.chainId === chainId)?.url;
  };

  return { rpcs, isLoading, update, getRpcForChain, refresh };
}
