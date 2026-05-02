"use client";

import { Heart, Copy, Check, ExternalLink } from "lucide-react";
import { DONATE_ADDRESS, PORTFOLIO_URL } from "@/lib/constants";
import { useState } from "react";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(DONATE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25">
            <Heart size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Support <span className="gradient-text">Sandwich</span>
          </h1>
          <p className="mt-4 text-lg text-(--muted)">
            Sandwich is free, open-source, and non-custodial. If you find it
            useful, consider supporting the developer with a donation.
          </p>

          {/* Developer link */}
          <div className="mt-8">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-blue-500"
            >
              <ExternalLink size={14} />
              Visit Developer Portfolio
            </a>
          </div>

          {/* Thank you */}
          <div className="mt-12 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
            <p className="text-sm leading-relaxed text-(--foreground)">
              <strong>Thank you!</strong> Every donation — no matter the size — helps keep this
              project alive and motivates continued development. 💜
            </p>
          </div>
        </div>

        {/* Donation address card */}
        <div className="rounded-2xl border border-(--border) bg-(--card) p-6 sm:p-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-(--muted)">
            Donation Address (ETH / ERC20)
          </h2>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-(--input-bg) p-4">
            <code className="flex-1 break-all text-sm font-medium">
              {DONATE_ADDRESS}
            </code>
            <button
              onClick={copyAddress}
              className="shrink-0 rounded-lg border border-(--border) p-2 text-(--muted) transition-colors hover:text-(--foreground) hover:bg-(--accent)"
              aria-label="Copy address"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
          <p className="mt-4 text-xs text-(--muted)">
            Send ETH or any ERC20 token on Ethereum Mainnet or compatible networks
            to the address above.
          </p>
        </div>
      </div>
    </div>
  );
}
