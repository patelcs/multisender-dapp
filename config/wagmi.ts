"use client";

import { http, createConfig, fallback, type Transport } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { mainnet, sepolia } from "wagmi/chains";
import { SUPPORTED_CHAINS } from "./chains";
import { getCustomRPCs, type CustomRPC } from "@/lib/storage";

/**
 * WalletConnect project ID — get one free at https://cloud.walletconnect.com
 * Using a placeholder; replace with your own for production.
 */
const WALLETCONNECT_PROJECT_ID = "667f139192de6e24b5087e13bf1e71e0";

// Default public RPCs as fallback
const DEFAULT_RPCS: Record<number, string[]> = {
  [mainnet.id]: ["https://eth.drpc.org", "https://cloudflare-eth.com"],
  [sepolia.id]: ["https://sepolia.drpc.org", "https://eth-sepolia.public.blastapi.io"],
};

/**
 * This function creates the wagmi config dynamically.
 * It's called within a Client Component (Web3Provider) to ensure 
 * it can access IndexedDB/localStorage for custom RPCs.
 */
export async function createWagmiConfig() {
  let customRpcs: CustomRPC[] = [];
  try {
    customRpcs = await getCustomRPCs();
  } catch (e) {
    console.error("Failed to load custom RPCs", e);
  }

  const transports: Record<number, Transport> = {};
  
  SUPPORTED_CHAINS.forEach((chain) => {
    const custom = customRpcs.find((r) => r.chainId === chain.id);
    const defaults = DEFAULT_RPCS[chain.id] || [];
    
    // Combine custom RPC, curated defaults, and the chain's own default RPCs.
    // We filter to unique URLs to avoid redundant calls.
    const uniqueUrls = Array.from(new Set([
      ...(custom?.url ? [custom.url] : []),
      ...defaults,
      ...chain.rpcUrls.default.http
    ]));
    
    // We do NOT use http() without a URL here because it can fall back to 
    // the injected provider (window.ethereum), which might be on the WRONG chain
    // if the user is connected to a different network.
    transports[chain.id] = fallback(uniqueUrls.map((url) => http(url)));
  });

  return createConfig({
    chains: SUPPORTED_CHAINS,
    connectors: [
      injected(),
      coinbaseWallet({ appName: "Sandwich" }),
      walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
    ],
    transports,
  });
}
