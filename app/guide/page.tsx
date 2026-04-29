"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Send,
  Plus,
  BookUser,
  ShieldCheck,
  Settings,
  Database,
  ArrowRight,
  HelpCircle,
  Coins,
  Layers,
  ChevronRight,
  Zap,
  Star,
  Globe,
  Download,
} from "lucide-react";

const SECTIONS = [
  { id: "send", label: "Sending Assets", icon: Send },
  { id: "management", label: "Tokens & Contacts", icon: BookUser },
  { id: "advanced", label: "Advanced Features", icon: Settings },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("send");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="gradient-text">Usage</span> Guide
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Learn how to master SandWitch and streamline your multi-chain workflows.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
              activeTab === s.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)] hover:border-blue-500/30"
            }`}
          >
            <s.icon size={18} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "send" && <SendSection />}
        {activeTab === "management" && <ManagementSection />}
        {activeTab === "advanced" && <AdvancedSection />}
      </div>

      {/* FAQ */}
      <section className="mt-20">
        <div className="mb-8 border-b border-[var(--border)] pb-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-blue-500/20"
            >
              <h3 className="flex items-center gap-2 font-bold text-blue-500">
                <HelpCircle size={16} />
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Links */}
      <section className="mt-16 flex flex-wrap justify-center gap-4">
        <Link
          href="/multisend"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
        >
          Start Multi Sending <ArrowRight size={18} />
        </Link>
        <Link
          href="/approvals"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-8 py-3.5 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-[var(--accent)] hover:scale-[1.02]"
        >
          Manage Approvals <ShieldCheck size={18} />
        </Link>
      </section>
    </div>
  );
}

function SendSection() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Multi Send */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500">
            <Layers size={14} /> Recommended
          </div>
          <h2 className="text-3xl font-bold">Multi Send</h2>
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            The flagship feature of SandWitch. Batch hundreds of recipients and multiple tokens 
            into a single transaction to save up to 80% on gas fees.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <span className="text-sm"><strong>Add Tokens:</strong> Click "Add Another Token" to create groups for ETH or any ERC20.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <span className="text-sm"><strong>Recipient Lists:</strong> Paste addresses or select from your address book.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <span className="text-sm"><strong>Amount Tools:</strong> Use bulk tools to set identical amounts, increments, or percentages.</span>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Workflow</h3>
          <div className="space-y-6">
            {[
              "Connect Wallet & Select Network",
              "Add Token Groups & Recipients",
              "Review & Approve ERC20 Permissions",
              "Execute Atomic Multi-Send Transaction"
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-sm font-black text-white">{i + 1}</div>
                <p className="text-sm font-medium self-center">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single Send */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--accent)] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="text-amber-500" /> Single Send
            </h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Perfect for standard one-to-one transfers. It uses the direct <code>transfer()</code> function 
              instead of the Multi-Send contract for maximum simplicity and zero overhead.
            </p>
          </div>
          <Link 
            href="/send"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Try Single Send <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ManagementSection() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Token List */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
            <Star size={28} />
          </div>
          <h3 className="text-2xl font-bold">Token List</h3>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Stop searching for contract addresses. Save your favorite ERC20 tokens locally 
            to pick them instantly during any send operation.
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium">
              <Globe size={14} className="text-blue-500" /> Global: Available across all wallets
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium">
              <Wallet size={14} className="text-purple-500" /> Personal: Private to your connected wallet
            </div>
          </div>
          <Link href="/settings/tokens" className="mt-6 inline-block text-sm font-bold text-blue-500 hover:underline">
            Manage your tokens →
          </Link>
        </div>

        {/* Contact List */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <BookUser size={28} />
          </div>
          <h3 className="text-2xl font-bold">Address Book</h3>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Manage your frequent recipients. Save addresses with custom labels to enable 
            instant auto-suggest in all address inputs.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Key Benefits</span>
            <ul className="grid gap-2 grid-cols-2">
              <li className="text-xs text-[var(--muted)] flex gap-2"><Plus size={10} className="text-green-500" /> No re-typing</li>
              <li className="text-xs text-[var(--muted)] flex gap-2"><Plus size={10} className="text-green-500" /> Error prevention</li>
              <li className="text-xs text-[var(--muted)] flex gap-2"><Plus size={10} className="text-green-500" /> Label tagging</li>
              <li className="text-xs text-[var(--muted)] flex gap-2"><Plus size={10} className="text-green-500" /> Local storage</li>
            </ul>
          </div>
          <Link href="/settings/address-book" className="mt-6 inline-block text-sm font-bold text-blue-500 hover:underline">
            Open Address Book →
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdvancedSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Approvals */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <ShieldCheck className="mb-4 text-blue-500" size={24} />
          <h4 className="font-bold">Approval Manager</h4>
          <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
            Review and modify spending permissions for any ERC20 token. Set specific 
            allowances or revoke access completely for maximum security.
          </p>
        </div>

        {/* RPC Override */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <Globe className="mb-4 text-purple-500" size={24} />
          <h4 className="font-bold">RPC Overrides</h4>
          <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
            Connect directly to your private nodes or preferred RPC providers (Alchemy, 
            Infura, QuickNode) to bypass rate limits and improve reliability.
          </p>
        </div>

        {/* Import/Export */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <Database className="mb-4 text-green-500" size={24} />
          <h4 className="font-bold">Data Control</h4>
          <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
            Your data is yours. Export your tokens, contacts, and settings as a JSON file 
            and import them into any other browser or device.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
        <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
          <HelpCircle size={20} /> Pro Tip: Exact Approvals
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          By default, SandWitch calculates the <strong>exact total</strong> needed for your 
          Multi-Send batch and requests approval for that amount only. Unlike other apps 
          that ask for "Infinite" approvals, we ensure your remaining allowance returns to zero 
          after the send, minimizing your security risk.
        </p>
      </div>
    </div>
  );
}

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
    q: "Are my contacts and tokens shared?",
    a: "No. All data is stored locally in your browser's IndexedDB. We have no servers and never see your data.",
  },
  {
    q: "Can I use custom RPCs for all chains?",
    a: "Yes. You can override the default public RPC for any supported network in Settings > Networks.",
  },
  {
    q: "What is the benefit of Global vs User scope?",
    a: "Global tokens/contacts appear no matter which wallet you connect. User scope items only show up when that specific wallet address is active.",
  },
];
