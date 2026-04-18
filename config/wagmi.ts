import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "./chains";

/**
 * WalletConnect project ID — get one free at https://cloud.walletconnect.com
 * Using a placeholder; replace with your own for production.
 */
const WALLETCONNECT_PROJECT_ID = "667f139192de6e24b5087e13bf1e71e0";

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected(), // MetaMask, Rabby, Trust Wallet, etc.
    coinbaseWallet({ appName: "MultiSender" }),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  transports: Object.fromEntries(
    SUPPORTED_CHAINS.map((chain) => [chain.id, http()])
  ) as Record<(typeof SUPPORTED_CHAINS)[number]["id"], ReturnType<typeof http>>,
});
