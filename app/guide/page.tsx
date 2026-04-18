import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  ListPlus,
  CheckCircle,
  Send,
  ArrowRight,
  HelpCircle,
  Coins,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "Step-by-step guide on how to use MultiSender to send tokens to multiple addresses in one transaction.",
};

const STEPS = [
  {
    icon: Wallet,
    title: "1. Connect Your Wallet",
    desc: 'Click the "Connect Wallet" button in the top-right corner. Select your preferred wallet (MetaMask, Coinbase, WalletConnect, etc.). Make sure you\'re on the correct network (Ethereum Mainnet or Sepolia).',
  },
  {
    icon: Coins,
    title: "2. Select Token Type",
    desc: 'On the Send page, click "Add Token" to create a new token group. Choose "Native (ETH)" for sending ETH, or paste an ERC20 token contract address to send that token.',
  },
  {
    icon: ListPlus,
    title: "3. Add Recipients",
    desc: "Add recipient addresses one by one with the amount each should receive. Use the Amount Tools to quickly fill amounts: Same (identical amount for all), Increment (increasing amounts), Formula (custom pattern), or Percentage (proportional split).",
  },
  {
    icon: Layers,
    title: "4. Add More Tokens (Optional)",
    desc: 'To send multiple tokens in one transaction, click "Add Token" again. You can import the same recipient list from a previous token group, with or without amounts.',
  },
  {
    icon: CheckCircle,
    title: "5. Approve Tokens",
    desc: 'Click "Review & Send" to open the stepper. For each ERC20 token, you\'ll be prompted to approve the MultiSender contract for the exact amount needed — only if current allowance is insufficient. Already-approved tokens are automatically marked as done.',
  },
  {
    icon: Send,
    title: "6. Confirm & Send",
    desc: "After all approvals are in place, confirm the final transaction. All tokens will be distributed to all recipients in a single transaction. You'll receive a transaction hash and a link to the block explorer.",
  },
];

const FAQ = [
  {
    q: "Is there a limit on the number of recipients?",
    a: "There's no hard limit in the contract. However, very large lists may hit the block gas limit. We recommend batches of up to 200 recipients per token for safety.",
  },
  {
    q: "What happens if I send too much ETH?",
    a: "The contract automatically refunds any excess ETH back to your wallet after distributing to all recipients.",
  },
  {
    q: "Do I need to approve tokens every time?",
    a: "No. The stepper checks your current allowance. If you've already approved enough, that step is automatically skipped.",
  },
  {
    q: "Can I use this on testnets?",
    a: "Yes! The app supports Ethereum Sepolia for testing. Switch your network in the chain selector.",
  },
  {
    q: "What wallets are supported?",
    a: "MetaMask, Coinbase Wallet, WalletConnect (which supports Trust Wallet, Rainbow, and many more), and any browser extension wallet that injects a standard provider.",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="gradient-text">Usage</span> Guide
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Follow these steps to send tokens to multiple addresses in one
        transaction.
      </p>

      {/* Steps */}
      <div className="mt-12 space-y-8">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-blue-500/20"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <step.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-medium">
                <HelpCircle
                  size={16}
                  className="shrink-0 text-blue-500 transition-transform group-open:rotate-90"
                />
                {item.q}
              </summary>
              <div className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="mt-16 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/send"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
        >
          Start Sending <ArrowRight size={14} />
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          Read Docs <ArrowRight size={14} />
        </Link>
        <Link
          href="/security"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          Security Info <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
