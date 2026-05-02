import Link from "next/link";
import {
  Zap,
  Users,
  Layers,
  Shield,
  ArrowRight,
  Coins,
  Globe,
  BookOpen,
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Multi-Token Batching",
    desc: "Send multiple ERC20 tokens and native ETH together — all in one single transaction.",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    desc: "Works on Ethereum Mainnet, Sepolia, and more chains coming soon.",
  },
  {
    icon: Users,
    title: "Unlimited Recipients",
    desc: "Add as many recipient addresses as you need. No artificial limits.",
  },
  {
    icon: Shield,
    title: "Non-Custodial & Secure",
    desc: "Tokens are transferred directly to recipients. The contract never holds your funds.",
  },
  {
    icon: Coins,
    title: "Gas Efficient",
    desc: "Pay gas once instead of N times. Save significantly on transaction fees.",
  },
  {
    icon: BookOpen,
    title: "Open Source",
    desc: "Fully transparent, auditable smart contracts. View the code on GitHub.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Connect Wallet",
    desc: "Connect your MetaMask, Coinbase, or WalletConnect wallet to get started.",
  },
  {
    step: "02",
    title: "Add Tokens & Recipients",
    desc: "Select tokens, add recipient addresses, and set amounts using smart fill tools.",
  },
  {
    step: "03",
    title: "Review & Send",
    desc: "Approve tokens if needed, then confirm the single transaction to send everything.",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-500">
              <Zap size={14} />
              Gas-efficient multi-send
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Send tokens to{" "}
              <span className="gradient-text">multiple wallets</span> in one
              click
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-(--muted) sm:text-xl">
              Send ERC20 tokens and native ETH to hundreds of addresses
              with a single, gas-efficient transaction. Non-custodial, open-source, and
              multi-chain.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/multisend"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch App
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-xl border border-(--border) px-8 py-3.5 text-base font-semibold text-(--foreground) transition-all hover:bg-(--accent)"
              >
                View Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-(--border) bg-(--card)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why use <span className="gradient-text">Sandwich</span>?
            </h2>
            <p className="mt-4 text-(--muted)">
              Everything you need to send tokens efficiently and securely.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-(--border) bg-(--background) p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-500 transition-colors group-hover:bg-blue-500/20">
                  <f.icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-(--muted)">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-(--border)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-(--muted)">
              Three simple steps to send tokens.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white shadow-lg shadow-blue-500/25">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-(--muted)">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-(--border) bg-(--card)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to send?
            </h2>
            <p className="mt-4 text-(--muted)">
              Connect your wallet and start sending tokens in seconds.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/multisend"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                Launch App
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center gap-2 rounded-xl border border-(--border) px-8 py-3.5 text-base font-semibold text-(--foreground) transition-all hover:bg-(--accent)"
              >
                <Shield size={18} />
                Learn About Security
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
