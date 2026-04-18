import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Tokens",
  description:
    "Send ERC20 tokens and native ETH to multiple addresses in a single, gas-efficient transaction.",
};

export default function SendLayout({ children }: { children: React.ReactNode }) {
  return children;
}
