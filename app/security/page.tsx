import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  RefreshCw,
  CheckCircle,
  Code,
  ArrowRight,
  AlertTriangle,
  Database,
  Globe,
  Zap,
} from "lucide-react";
import InfoBanner from "@/components/ui/InfoBanner";
import { GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn how Sandwich keeps your funds and data safe — non-custodial design, exact approvals, local storage, and open-source code.",
};

const SECURITY_POINTS = [
  {
    icon: Shield,
    title: "Non-Custodial Design",
    desc: "The Sandwich contract never holds your tokens. Every call forwards tokens directly from your wallet to recipients in the same transaction. There is no intermediary step where the contract controls your assets.",
  },
  {
    icon: Lock,
    title: "Exact Approval Amounts",
    desc: "When you use Multi Send, we request approval for only the exact amount needed for that specific batch. We never ask for unlimited approvals by default, minimizing your risk exposure.",
  },
  {
    icon: Database,
    title: "Local-Only Data",
    desc: "Your address book, token list, and settings are stored exclusively in your browser's IndexedDB. We have no backend servers and never see, collect, or share your data.",
  },
  {
    icon: Globe,
    title: "Privacy via Custom RPCs",
    desc: "Avoid tracking by public RPC providers. Sandwich allows you to use your own private RPC endpoints for all blockchain interactions, ensuring your IP and transaction metadata stay private.",
  },
  {
    icon: Zap,
    title: "Atomic Transactions",
    desc: "All multi-send operations are atomic. Either every recipient receives their tokens, or the entire transaction reverts and your funds stay in your wallet. No partial failures.",
  },
  {
    icon: RefreshCw,
    title: "Automatic ETH Refund",
    desc: "If you send more native ETH than required (to account for gas estimation), the contract automatically refunds the excess back to your wallet at the end of the transaction.",
  },
  {
    icon: Code,
    title: "Open Source & Auditable",
    desc: "The entire contract source code is publicly available on GitHub. Anyone can inspect, audit, and verify the logic. We use OpenZeppelin's battle-tested libraries for all core functions.",
  },
  {
    icon: CheckCircle,
    title: "Verified Contract Logic",
    desc: "The contract handles edge cases in non-standard ERC20 tokens (those that don't return boolean values) using SafeERC20 logic, preventing stuck tokens or failed confirmations.",
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Security</span> Overview
        </h1>
        <p className="mt-4 text-lg text-(--muted)">
          Security is the foundation of Sandwich. Here is how we protect your funds and privacy.
        </p>
      </div>

      {/* Key banner */}
      <div className="mt-8">
        <InfoBanner variant="security" title="Stateless & Transparent">
          The Sandwich contract is a simple, stateless forwarder. It has no owner, no
          admin functions, no upgradability, and no way to store or freeze your tokens.
          Everything happens on-chain in a single, verifiable step.
        </InfoBanner>
      </div>

      {/* Security points */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SECURITY_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--card) p-6 transition-all hover:border-blue-500/20"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <point.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">
                {point.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Approval safety section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Safe Permissions</h2>
        <div className="mt-6 space-y-4">
          <InfoBanner variant="info" title="Approval ≠ Transfer">
            An ERC20 approval merely grants <strong>permission</strong> for the contract to
            transfer tokens on your behalf. It does <em>not</em> transfer anything. The
            actual transfer only happens when you confirm the Multi-Send transaction.
          </InfoBanner>

          <InfoBanner variant="success" title="Manage your allowances">
            Use our built-in <strong>Approvals</strong> page to view all current permissions 
            you&apos;ve granted to Sandwich. You can revoke any allowance at any time with a single click.
          </InfoBanner>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="flex items-center gap-2 font-bold text-amber-500">
              <AlertTriangle size={18} /> Safety Checklist
            </h3>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-(--muted)">
              <li>Always verify the contract address on the block explorer before approving.</li>
              <li>Double-check recipient addresses — blockchain transactions are irreversible.</li>
              <li>When importing data, only use files you exported yourself from this site.</li>
              <li>Sandwich will never ask for your private key or seed phrase.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Audit */}
      <section className="mt-16 border-t border-(--border) pt-16">
        <h2 className="text-2xl font-bold text-center">Audit & Transparency</h2>
        <div className="mt-8 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold">Pending Formal Audit</h3>
          <p className="mt-4 text-(--muted) leading-relaxed">
            The Sandwich contracts use battle-tested OpenZeppelin libraries and follow 
            security best practices, but they have not yet undergone a formal third-party audit. 
            The code is fully open-source for public verification.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-(--border) px-6 py-3 text-sm font-bold transition-all hover:bg-(--accent)"
            >
              <Code size={18} /> Inspect Source Code
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700"
            >
              Technical Docs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
