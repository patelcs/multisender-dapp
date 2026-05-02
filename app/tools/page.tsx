"use client";

import Link from "next/link";
import { Send, Layers, ShieldCheck, ArrowRight, ArrowRightLeft, Info } from "lucide-react";

const TOOLS = [
  {
    title: "Multi-Send",
    description: "Batch token distributions in one transaction.",
    href: "/multisend",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    title: "Single Send",
    description: "Direct one-to-one token transfers.",
    href: "/send",
    icon: Send,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "Transfer From",
    description: "Execute transfers using delegated approvals.",
    href: "/tools/transfer-from",
    icon: ArrowRightLeft,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Approval Manager",
    description: "Review and revoke token spending permissions.",
    href: "/approvals",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Utility <span className="gradient-text">Tools</span>
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-(--muted) max-w-2xl">
          A suite of multi-chain utilities designed for efficiency, security, and ease of use.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className={`group relative flex flex-col rounded-2xl border ${tool.border} bg-(--card) p-4 sm:p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/5`}
          >
            <div className={`mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${tool.bg} ${tool.color}`}>
              <tool.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-lg font-bold leading-tight group-hover:text-blue-500 transition-colors">
                {tool.title}
              </h3>
              
              <div className="group/info relative shrink-0">
                <Info size={14} className="text-(--muted) hover:text-blue-500 transition-colors sm:w-[18px] sm:h-[18px]" />
                <div className="absolute bottom-full right-0 mb-2 w-48 scale-95 rounded-xl border border-(--border) bg-(--card) p-3 text-xs font-medium text-(--foreground) opacity-0 shadow-xl transition-all group-hover/info:scale-100 group-hover/info:opacity-100 pointer-events-none z-10">
                  {tool.description}
                  <div className="absolute right-2 top-full border-8 border-transparent border-t-(--card)" />
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-blue-500 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
              Open <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Info Callout */}
      <div className="mt-12 sm:mt-16 rounded-3xl border border-(--border) bg-(--accent) p-6 sm:p-8 text-center">
        <h4 className="text-base sm:text-lg font-bold">More tools coming soon</h4>
        <p className="mt-2 text-xs sm:text-sm text-(--muted)">
          We are constantly building new utilities to help you manage your assets across the multichain ecosystem.
        </p>
      </div>
    </div>
  );
}
