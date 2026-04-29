"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  Code2, 
  Code, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Globe, 
  Zap,
  Terminal,
  ChevronRight
} from "lucide-react";
import { GITHUB_URL } from "@/lib/constants";
import { SUPPORTED_CHAINS, MULTISENDER_ADDRESSES, EXPLORER_URLS } from "@/config/chains";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"contract" | "app">("contract");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
          Technical <span className="gradient-text">Documentation</span>
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)] text-center max-w-2xl mx-auto">
          Deep dive into the SandWitch architecture, smart contracts, and technical specifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-12 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("contract")}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "contract"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)]"
          }`}
        >
          <Cpu size={18} /> Smart Contract
        </button>
        <button
          onClick={() => setActiveTab("app")}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "app"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
              : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)]"
          }`}
        >
          <Terminal size={18} /> App Architecture
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "contract" ? <ContractDocs /> : <AppDocs />}
      </div>

      {/* Footer Links */}
      <section className="mt-20 flex flex-wrap justify-center gap-4 border-t border-[var(--border)] pt-12">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold transition-all hover:bg-[var(--accent)]"
        >
          <Code2 size={18} /> View Contract Source
        </a>
        <Link
          href="/security"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold transition-all hover:bg-[var(--accent)]"
        >
          <ShieldCheck size={18} /> Security Overview
        </Link>
      </section>
    </div>
  );
}

function ContractDocs() {
  return (
    <div className="space-y-16">
      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-blue-500 rounded-full" /> Contract Overview
        </h2>
        <p className="text-[var(--muted)] leading-relaxed">
          The SandWitch MultiSender is a stateless, non-custodial forwarder contract. 
          It allows users to distribute ETH and ERC20 tokens to multiple addresses in a 
          single atomic transaction, significantly reducing gas overhead and user friction.
        </p>
      </section>

      {/* Deployed Addresses */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-blue-500 rounded-full" /> Deployed Addresses
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SUPPORTED_CHAINS.map((chain) => {
            const addr = MULTISENDER_ADDRESSES[chain.id];
            const explorer = EXPLORER_URLS[chain.id];
            return (
              <div key={chain.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-sm">{chain.name}</span>
                  <a href={`${explorer}/address/${addr}`} target="_blank" className="text-blue-500 text-xs hover:underline flex items-center gap-1">
                    Explorer <ExternalLink size={10} />
                  </a>
                </div>
                <code className="block w-full bg-[var(--input-bg)] p-3 rounded-lg text-[10px] font-mono text-[var(--muted)] break-all border border-[var(--border)]">
                  {addr}
                </code>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Structures */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-blue-500 rounded-full" /> Data Structures
        </h2>
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">MultiSend Struct</h3>
            <pre className="overflow-x-auto rounded-xl bg-[var(--input-bg)] p-5 text-xs text-blue-400 leading-relaxed border border-[var(--border)]">
{`struct MultiSend {
    TokenType tokenType;       // 0: NATIVE, 1: ERC20
    address token;             // Token address (0x0 for native)
    TokenReceiver[] receivers; // Array of {address, uint256}
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Logic */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-blue-500 rounded-full" /> Core Functions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { 
              name: "sendNativeTokens", 
              desc: "Distributes ETH. Automatically calculates total value required and refunds any excess msg.value to the sender." 
            },
            { 
              name: "sendERC20Tokens", 
              desc: "Distributes a specific ERC20 token. Uses OpenZeppelin SafeERC20 to handle non-standard token implementations." 
            },
            { 
              name: "send", 
              desc: "The universal entry point. Accepts an array of MultiSend structs, allowing mixed native and multi-token batches." 
            },
            { 
              name: "emergencyWithdraw", 
              desc: "Not applicable. The contract is stateless and holds zero funds between transactions." 
            }
          ].map((f) => (
            <div key={f.name} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="font-mono text-sm font-bold text-green-500 mb-2">{f.name}()</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AppDocs() {
  return (
    <div className="space-y-16">
      {/* Technology Stack */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-purple-500 rounded-full" /> Technology Stack
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Frontend", val: "Next.js 15 (React 19)" },
            { label: "Blockchain", val: "Wagmi 2.x & Viem 2.x" },
            { label: "Persistence", val: "IndexedDB (Browser)" },
            { label: "Styling", val: "Tailwind CSS 4.x" },
            { label: "Icons", val: "Lucide React" },
            { label: "Deployment", val: "Vercel Edge" }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">{item.label}</div>
              <div className="text-sm font-bold">{item.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Storage Architecture */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-purple-500 rounded-full" /> Local Data Architecture
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              SandWitch follows a "Zero-Server" philosophy. All user data is persisted 
              locally within the browser using IndexedDB. This ensures that your financial 
              privacy is maintained and your contacts never leave your device.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Database size={16} className="text-purple-500" /> 
                <span><strong>Address Book:</strong> Stored in <code>contacts</code> object store.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap size={16} className="text-purple-500" /> 
                <span><strong>Token List:</strong> Stored in <code>tokens</code> with chain-specific ID.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe size={16} className="text-purple-500" /> 
                <span><strong>RPC Config:</strong> Stored in <code>rpc_config</code> for dynamic overrides.</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent)] p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Code size={14} /> Data Portability (JSON Schema)
            </h3>
            <p className="text-xs text-[var(--muted)] mb-4">
              The Import/Export feature uses a unified JSON schema containing all three 
              stores. This allows seamless migration between browsers.
            </p>
            <code className="block bg-[var(--card)] p-3 rounded-lg text-[10px] font-mono text-purple-400 border border-[var(--border)]">
{`{
  "version": 1,
  "contacts": [...],
  "tokens": [...],
  "rpc_config": {...}
}`}
            </code>
          </div>
        </div>
      </section>

      {/* RPC & Custom Networks */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-purple-500 rounded-full" /> Dynamic RPC Override
        </h2>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            SandWitch uses a custom Wagmi transport layer. It prioritizes user-defined 
            RPCs found in the local database before falling back to public infrastructure. 
            This is managed by the <code>createWagmiConfig()</code> utility in <code>@/config/wagmi.ts</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <ChevronRight size={14} className="mt-1 text-purple-500" />
              <div>
                <div className="font-bold text-sm">Low Latency</div>
                <p className="text-xs text-[var(--muted)]">Connect to your nearest local node.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight size={14} className="mt-1 text-purple-500" />
              <div>
                <div className="font-bold text-sm">Privacy</div>
                <p className="text-xs text-[var(--muted)]">Bypass public RPC tracking/logging.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
