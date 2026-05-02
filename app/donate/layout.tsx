import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the Sandwich project — donate ETH or ERC20 tokens to the developer.",
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
