import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Code2, Code, ArrowRight } from "lucide-react";
import { GITHUB_URL } from "@/lib/constants";
import { SUPPORTED_CHAINS, MULTISENDER_ADDRESSES, EXPLORER_URLS } from "@/config/chains";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Technical documentation for the MultiSender smart contract — function reference, data structures, and deployment info.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="gradient-text">Contract</span> Documentation
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Technical reference for the MultiSender smart contract. The contract is
        open-source and non-custodial.
      </p>

      {/* GitHub link */}
      <div className="mt-8">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50"
        >
          <Code2 size={18} />
          View Source on GitHub
          <ExternalLink size={14} className="text-[var(--muted)]" />
        </a>
      </div>

      {/* Deployed Addresses */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Deployed Addresses</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 text-left font-semibold text-[var(--muted)]">Chain</th>
                <th className="py-3 text-left font-semibold text-[var(--muted)]">Address</th>
                <th className="py-3 text-left font-semibold text-[var(--muted)]">Explorer</th>
              </tr>
            </thead>
            <tbody>
              {SUPPORTED_CHAINS.map((chain) => {
                const addr = MULTISENDER_ADDRESSES[chain.id];
                const explorer = EXPLORER_URLS[chain.id];
                return (
                  <tr key={chain.id} className="border-b border-[var(--border)]">
                    <td className="py-3 font-medium">{chain.name}</td>
                    <td className="py-3 font-mono text-xs text-[var(--muted)]">
                      {addr}
                    </td>
                    <td className="py-3">
                      <a
                        href={`${explorer}/address/${addr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                      >
                        View <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Data Structures */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Data Structures</h2>

        <div className="mt-6 space-y-6">
          <div className="glass-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Code size={16} className="text-blue-500" />
              TokenReceiver
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Represents a single token recipient with their address and the
              amount to receive.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--input-bg)] p-4 text-sm">
{`struct TokenReceiver {
    address receiver;  // Recipient wallet address
    uint256 amount;    // Amount in token's smallest unit (wei)
}`}
            </pre>
          </div>

          <div className="glass-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Code size={16} className="text-blue-500" />
              TokenType (Enum)
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Differentiates between native currency (ETH) and ERC20 tokens.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--input-bg)] p-4 text-sm">
{`enum TokenType {
    NATIVE,  // ETH / native currency
    ERC20    // Any ERC20 token
}`}
            </pre>
          </div>

          <div className="glass-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Code size={16} className="text-blue-500" />
              MultiSend
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Groups a token type, token address, and an array of receivers — used by the{" "}
              <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs">send()</code>{" "}
              function to batch multiple tokens.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--input-bg)] p-4 text-sm">
{`struct MultiSend {
    TokenType tokenType;       // NATIVE or ERC20
    address token;             // Token address (0x0 for native)
    TokenReceiver[] receivers; // List of recipients
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Functions */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Functions</h2>

        <div className="mt-6 space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-500">
              sendNativeTokens(receivers) → payable
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Send native currency (ETH) to multiple receivers. Attach the total ETH
              amount as <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs">msg.value</code>.
              Any excess ETH is automatically refunded to the sender.
            </p>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-500">
              sendERC20Tokens(token, receivers)
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Send an ERC20 token to multiple receivers. Requires prior{" "}
              <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs">approve()</code>{" "}
              of the MultiSender contract for the total amount.
              Uses <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs">SafeERC20.safeTransferFrom</code>{" "}
              for maximum safety.
            </p>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-500">
              send(multiSends[]) → payable
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The master function — send <strong>multiple different tokens</strong>{" "}
              (both native and ERC20) to multiple receivers in a single transaction.
              Requires prior ERC20 approvals and the total native value attached.
            </p>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-16 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/security"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          Security Details <ArrowRight size={14} />
        </Link>
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-[var(--accent)]"
        >
          Usage Guide <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
