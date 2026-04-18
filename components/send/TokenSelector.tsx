"use client";

import { useState } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { Coins, Search, Loader2 } from "lucide-react";

interface TokenSelectorProps {
  isNative: boolean;
  tokenAddress: string;
  onToggleNative: (isNative: boolean) => void;
  onAddressChange: (address: string) => void;
}

export default function TokenSelector({
  isNative,
  tokenAddress,
  onToggleNative,
  onAddressChange,
}: TokenSelectorProps) {
  const validAddress =
    !isNative && tokenAddress.startsWith("0x") && tokenAddress.length === 42
      ? (tokenAddress as `0x${string}`)
      : undefined;

  const { name, symbol, decimals, isLoading } = useTokenInfo(validAddress);

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggleNative(true)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            isNative
              ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
              : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-blue-500/20"
          }`}
        >
          <Coins size={16} />
          Native (ETH)
        </button>
        <button
          onClick={() => onToggleNative(false)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            !isNative
              ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
              : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-blue-500/20"
          }`}
        >
          <Search size={16} />
          ERC20 Token
        </button>
      </div>

      {/* ERC20 address input */}
      {!isNative && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Paste ERC20 token contract address (0x...)"
            value={tokenAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)] transition-colors focus:border-blue-500/50"
          />
          {/* Token info display */}
          {validAddress && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm">
              {isLoading ? (
                <span className="flex items-center gap-2 text-[var(--muted)]">
                  <Loader2 size={14} className="animate-spin" />
                  Fetching token info...
                </span>
              ) : name && symbol ? (
                <span className="text-[var(--foreground)]">
                  <strong>{symbol}</strong> — {name}{" "}
                  <span className="text-[var(--muted)]">
                    ({decimals} decimals)
                  </span>
                </span>
              ) : (
                <span className="text-amber-500">
                  Could not fetch token info. Verify the address.
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
