import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  RefreshCw,
  CheckCircle,
  Code,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import InfoBanner from "@/components/ui/InfoBanner";
import { GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn how MultiSender keeps your funds safe — non-custodial design, exact approvals, automatic refunds, and open-source code.",
};

const SECURITY_POINTS = [
  {
    icon: Shield,
    title: "Non-Custodial Design",
    desc: "The MultiSender contract never holds your tokens. Every call forwards tokens directly from your wallet to recipients in the same transaction. There is no intermediary step where the contract controls your assets.",
  },
  {
    icon: Lock,
    title: "Exact Approval Amounts",
    desc: "When you approve the contract for an ERC20 token, we request only the exact amount needed for that specific send. We never ask for unlimited approvals. After the transaction, the remaining allowance is zero or near-zero.",
  },
  {
    icon: RefreshCw,
    title: "Automatic ETH Refund",
    desc: "If you send more native ETH than required (to account for gas estimation), the contract automatically refunds the excess back to your wallet at the end of the transaction.",
  },
  {
    icon: Code,
    title: "Open Source & Auditable",
    desc: "The entire contract source code is publicly available on GitHub. Anyone can inspect, audit, and verify the logic. We use OpenZeppelin's battle-tested SafeERC20 library for all token transfers.",
  },
  {
    icon: Eye,
    title: "Transparent On-Chain",
    desc: "Every transaction is fully visible on the blockchain. You can verify all transfers on Etherscan or any block explorer. No off-chain operations, no hidden logic.",
  },
  {
    icon: CheckCircle,
    title: "SafeERC20 for All Transfers",
    desc: "The contract uses OpenZeppelin's SafeERC20 (safeTransferFrom) which handles edge cases in non-standard ERC20 tokens that don't return boolean values, preventing potential transfer failures.",
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="gradient-text">Security</span> Overview
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Understanding how MultiSender keeps your funds safe.
      </p>

      {/* Key banner */}
      <div className="mt-8">
        <InfoBanner variant="security" title="Your funds are always in your control">
          The MultiSender contract is a simple, stateless forwarder. It has no owner, no
          admin functions, no upgradability, and no way to store or freeze your tokens.
          Every send is atomic — either all transfers succeed, or the entire transaction
          reverts.
        </InfoBanner>
      </div>

      {/* Security points */}
      <div className="mt-12 space-y-6">
        {SECURITY_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <point.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {point.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Approval safety section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Why is it safe to approve?</h2>
        <div className="mt-6 space-y-4">
          <InfoBanner variant="info" title="Approval ≠ Transfer">
            An ERC20 approval merely grants <strong>permission</strong> for the contract to
            transfer tokens on your behalf. It does <em>not</em> transfer anything. The
            actual transfer only happens when you confirm the send transaction.
          </InfoBanner>

          <InfoBanner variant="success" title="Exact amounts only">
            MultiSender calculates the precise total and requests approval for exactly that
            amount. After the transaction, the approval is consumed — nothing remains for
            future use.
          </InfoBanner>

          <InfoBanner variant="warning" title="General Web3 safety tips">
            <ul className="mt-1 list-disc pl-4 space-y-1">
              <li>Always verify the contract address on the block explorer before approving.</li>
              <li>Double-check recipient addresses — blockchain transactions are irreversible.</li>
              <li>Test with small amounts on Sepolia testnet first.</li>
              <li>Never share your private key or seed phrase.</li>
            </ul>
          </InfoBanner>
        </div>
      </section>

      {/* Audit */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Audit Status</h2>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="text-sm leading-relaxed text-[var(--foreground)]">
            <p className="font-semibold">Pending Formal Audit</p>
            <p className="mt-1 text-[var(--muted)]">
              The contract has not yet undergone a formal third-party audit. While the code
              is simple and uses well-audited OpenZeppelin libraries, please use at your own
              discretion. We recommend testing on Sepolia first.
            </p>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="mt-16 flex flex-col gap-4 sm:flex-row">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          View Contract Source <ArrowRight size={14} />
        </a>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          Contract Docs <ArrowRight size={14} />
        </Link>
        <Link
          href="/send"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
        >
          Start Sending <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
