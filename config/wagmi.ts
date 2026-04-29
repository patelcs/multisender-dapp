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
  [mainnet.id]: ["https://eth.llamarpc.com", "https://cloudflare-eth.com"],
  [sepolia.id]: ["https://rpc.ankr.com/eth_sepolia", "https://eth-sepolia.public.blastapi.io"],
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
    
    // If user has a custom RPC, it's tried first.
    // Otherwise it falls back to our curated defaults.
    const urls = custom?.url ? [custom.url, ...defaults] : defaults;
    
    transports[chain.id] = fallback(urls.map((url) => http(url)).concat([http()]));
  });

  return createConfig({
    chains: SUPPORTED_CHAINS,
    connectors: [
      injected(),
      coinbaseWallet({ appName: "SandWitch" }),
      walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
    ],
    transports,
  });
}
