"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  BookUser,
  ShieldCheck,
  Database,
  ArrowRight,
  HelpCircle,
  Layers,
  ChevronRight,
  Zap,
  Star,
  Globe,
  ArrowRightLeft,
  Filter,
} from "lucide-react";

const SECTIONS = [
  { id: "send", label: "Sending Assets", icon: Send },
  { id: "management", label: "Tokens & Contacts", icon: BookUser },
  { id: "advanced", label: "Network & Security", icon: ShieldCheck },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("send");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="gradient-text">Usage</span> Guide
        </h1>
        <p className="mt-4 text-lg text-(--muted) max-w-2xl mx-auto">
          Learn how to master Sandwich and streamline your multi-chain workflows.
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
                : "bg-(--card) text-(--muted) border border-(--border) hover:text-(--foreground) hover:border-blue-500/30"
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

      {/* Navigation Links */}
      <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/docs"
          className="group flex flex-col rounded-2xl border border-(--border) bg-(--card) p-6 transition-all hover:border-blue-500/20"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Layers size={20} />
          </div>
          <h3 className="font-bold group-hover:text-blue-500">Technical Docs</h3>
          <p className="mt-2 text-xs text-(--muted)">Deep dive into our architecture, smart contracts, and developer APIs.</p>
        </Link>
        <Link
          href="/security"
          className="group flex flex-col rounded-2xl border border-(--border) bg-(--card) p-6 transition-all hover:border-purple-500/20"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold group-hover:text-purple-500">Security Overview</h3>
          <p className="mt-2 text-xs text-(--muted)">Understand how we protect your funds with non-custodial design and exact approvals.</p>
        </Link>
        <Link
          href="/getting-started"
          className="group flex flex-col rounded-2xl border border-(--border) bg-(--card) p-6 transition-all hover:border-amber-500/20"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Zap size={20} />
          </div>
          <h3 className="font-bold group-hover:text-amber-500">Quick Start</h3>
          <p className="mt-2 text-xs text-(--muted)">New to Sandwich? Follow our 2-minute onboarding guide to get up and running.</p>
        </Link>
      </section>

      {/* FAQ */}
      <section className="mt-20">
        <div className="mb-8 border-b border-(--border) pb-4 text-center sm:text-left">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-(--border) bg-(--card) p-6 transition-all hover:border-blue-500/20"
            >
              <h3 className="flex items-center gap-2 font-bold text-blue-500">
                <HelpCircle size={16} />
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--muted)">
                {item.a}
              </p>
            </div>
          ))}
        </div>
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
            <Layers size={14} /> Power User Choice
          </div>
          <h2 className="text-3xl font-bold">Multi Send</h2>
          <p className="mt-4 text-(--muted) leading-relaxed">
            Batch hundreds of recipients and multiple tokens into a single transaction to save up to 80% on gas fees. Perfect for airdrops and bulk payments.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <div className="text-sm">
                <strong>Recipient Lists:</strong> Paste addresses, use bulk CSV-style input, or pick from your address book.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <div className="text-sm">
                <strong>Smart Filtering:</strong> Use the built-in filters in the search modal to find contacts by source or custom tags.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-500"><ChevronRight size={12} /></div>
              <div className="text-sm">
                <strong>Amount Tools:</strong> Set identical amounts, apply increments, or distribute percentages across all recipients.
              </div>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-(--border) bg-(--card) p-8 shadow-xl">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--muted)">Workflow</h3>
          <div className="space-y-6">
            {[
              "Connect Wallet & Select Network",
              "Add Token Groups & Recipient Lists",
              "Review & Approve Exact Allowances",
              "Execute Atomic Batch Transaction"
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
      <div className="rounded-3xl border border-(--border) bg-(--accent) p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="text-amber-500" /> Single Send
            </h3>
            <p className="mt-3 text-sm text-(--muted)">
              Perfect for standard one-to-one transfers. It uses the direct <code>transfer()</code> function for maximum simplicity and zero protocol overhead.
            </p>
          </div>
          <Link 
            href="/send"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all hover:scale-[1.02]"
          >
            Try Single Send <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Transfer From */}
      <div className="rounded-3xl border border-(--border) bg-(--card) p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="mb-4 lg:mb-0 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <ArrowRightLeft size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Transfer From (Delegated Sending)</h3>
            <p className="mt-3 text-sm text-(--muted) leading-relaxed">
              Use your delegated spending power. This tool checks if another wallet has approved you to move their ERC20 tokens. If an allowance exists, you can execute a <code>transferFrom</code> transaction to yourself or any other recipient.
            </p>
          </div>
          <Link 
            href="/tools/transfer-from"
            className="inline-flex items-center gap-2 rounded-xl border border-(--border) px-6 py-3 text-sm font-bold text-(--foreground) hover:bg-(--accent) transition-all hover:scale-[1.02]"
          >
            Check Allowances <ArrowRight size={16} />
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
        <div className="rounded-3xl border border-(--border) bg-(--card) p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
            <Star size={28} />
          </div>
          <h3 className="text-2xl font-bold">Custom Token List</h3>
          <p className="mt-4 text-sm text-(--muted) leading-relaxed">
            Stop searching for contract addresses. Save favorite tokens locally and even <strong>customize their display names</strong> to make them recognizable.
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-(--accent) px-3 py-2 text-xs font-medium">
              <Globe size={14} className="text-blue-500" /> Global Scope: Persists across all your wallets
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-(--accent) px-3 py-2 text-xs font-medium">
              <Filter size={14} className="text-purple-500" /> Smart Filters: Sort by source or chain in the selector
            </div>
          </div>
          <Link href="/settings/tokens" className="mt-6 inline-block text-sm font-bold text-blue-500 hover:underline">
            Manage your tokens →
          </Link>
        </div>

        {/* Contact List */}
        <div className="rounded-3xl border border-(--border) bg-(--card) p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <BookUser size={28} />
          </div>
          <h3 className="text-2xl font-bold">Address Book & Tags</h3>
          <p className="mt-4 text-sm text-(--muted) leading-relaxed">
            Manage frequent recipients with <strong>Custom Tags</strong>. Categorize addresses as &quot;Payroll&quot;, &quot;Friends&quot;, or &quot;Exchanges&quot; for instant discovery.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-xs font-bold text-(--muted) uppercase tracking-widest mb-1">Key Features</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs text-(--muted) flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Multi-Tagging</div>
              <div className="text-xs text-(--muted) flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Auto-Suggest</div>
              <div className="text-xs text-(--muted) flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Filter by Tag</div>
              <div className="text-xs text-(--muted) flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Label Override</div>
            </div>
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
        <div className="rounded-2xl border border-(--border) bg-(--card) p-6">
          <ShieldCheck className="mb-4 text-blue-500" size={24} />
          <h4 className="font-bold">Approval Manager</h4>
          <p className="mt-2 text-xs text-(--muted) leading-relaxed">
            Review and modify spending permissions. Set specific allowances or revoke access completely for maximum security.
          </p>
        </div>

        {/* RPC Override */}
        <div className="rounded-2xl border border-(--border) bg-(--card) p-6">
          <Globe className="mb-4 text-purple-500" size={24} />
          <h4 className="font-bold">Custom RPCs</h4>
          <p className="mt-2 text-xs text-(--muted) leading-relaxed">
            Connect to private nodes or preferred providers to bypass public RPC rate limits and ensure transaction privacy.
          </p>
        </div>

        {/* Import/Export */}
        <div className="rounded-2xl border border-(--border) bg-(--card) p-6">
          <Database className="mb-4 text-green-500" size={24} />
          <h4 className="font-bold">Full Data Portability</h4>
          <p className="mt-2 text-xs text-(--muted) leading-relaxed">
            Export all your local data as a JSON file and import it into another device. Your data never leaves your control.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">
          <h3 className="text-xl font-bold flex items-center gap-2 text-blue-500">
            <Database size={20} /> Zero-Server Architecture
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-(--muted)">
            Sandwich stores 100% of your configuration in your browser&apos;s <strong>IndexedDB</strong>. We don&apos;t have accounts, databases, or cookies. Your privacy is enforced by architecture.
          </p>
        </div>
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
            <ShieldCheck size={20} /> Safety Tip: Exact Approvals
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-(--muted)">
            Sandwich defaults to requesting the <strong>exact total</strong> needed for your batch. We never ask for infinite approvals by default, minimizing your long-term security risk.
          </p>
        </div>
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
