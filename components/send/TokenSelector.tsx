"use client";

import { useState, useRef, useEffect } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useTokenList } from "@/hooks/useTokenList";
import { Coins, Search, Loader2, Star, Globe, User, Package, Wallet } from "lucide-react";
import { formatUnits } from "viem";

interface TokenSelectorProps {
  isNative?: boolean;
  hideNative?: boolean;
  tokenAddress: string;
  tokenSymbol?: string;
  decimals?: number;
  balance?: bigint;
  chainId?: number;
  onToggleNative: (isNative: boolean) => void;
  onAddressChange: (address: string) => void;
  onInfoChange: (info: { name: string; symbol: string; decimals: number; balance?: bigint }) => void;
  onPickToken: (token: { address: string; name: string; symbol: string; decimals: number }) => void;
}

export default function TokenSelector({
  isNative,
  hideNative,
  tokenAddress,
  tokenSymbol,
  decimals: currentDecimals,
  balance: currentBalance,
  chainId,
  onToggleNative,
  onAddressChange,
  onInfoChange,
  onPickToken,
}: TokenSelectorProps) {
  const validAddress =
    isNative === false && tokenAddress.startsWith("0x") && tokenAddress.length === 42
      ? (tokenAddress as `0x${string}`)
      : undefined;

  const { name, symbol, decimals, balance, isLoading } = useTokenInfo(validAddress, chainId);
  const { tokens: allTokens, add: saveToken, isTokenSaved } = useTokenList();

  // Notify parent when info is loaded, but only if it changed
  useEffect(() => {
    const isActuallyNative = isNative === true && !hideNative;
    const isActuallyValidERC20 = (isNative === false || hideNative) && validAddress && name && symbol && decimals !== undefined;

    if (isActuallyNative || isActuallyValidERC20) {
      const newSymbol = isActuallyNative ? "ETH" : symbol!;
      const newDecimals = isActuallyNative ? 18 : decimals!;
      
      const hasChanged = 
        newSymbol !== tokenSymbol || 
        newDecimals !== currentDecimals || 
        balance !== currentBalance;

      if (hasChanged) {
        onInfoChange({ 
          name: isActuallyNative ? "Ethereum" : name!, 
          symbol: newSymbol, 
          decimals: newDecimals,
          balance
        });
      }
    }
  }, [validAddress, name, symbol, decimals, balance, isNative, hideNative, onInfoChange, tokenSymbol, currentDecimals, currentBalance]);

  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveScope, setSaveScope] = useState<"global" | "user">("global");
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
        setShowSaveForm(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const matches = focused
    ? allTokens.filter((t) => {
        const q = tokenAddress.toLowerCase();
        if (!q.trim()) return true;
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesSymbol = t.symbol.toLowerCase().includes(q);
        // Only match address if query is significant to prevent accidental hex matches
        const matchesAddress =
          (q.startsWith("0x") || q.length >= 4) && t.address.toLowerCase().includes(q);
        return matchesName || matchesSymbol || matchesAddress;
      })
    : [];

  const canSave =
    validAddress && name && symbol && decimals !== undefined && !isTokenSaved(tokenAddress);

  const handleSaveToken = () => {
    if (!validAddress || !name || !symbol || decimals === undefined) return;
    saveToken({ address: tokenAddress, name, symbol, decimals }, saveScope);
    setShowSaveForm(false);
  };

  return (
    <div className="space-y-3">
      {/* Toggle */}
      {!hideNative && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              onToggleNative(true);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all ${
              isNative === true
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-blue-500/20"
            }`}
          >
            <Coins size={14} />
            ETH
          </button>
          <button
            type="button"
            onClick={() => onToggleNative(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all ${
              isNative === false
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-blue-500/20"
            }`}
          >
            <Search size={14} />
            ERC20
          </button>
        </div>
      )}

      {/* ERC20 mode */}
      {(isNative === false || hideNative) && (
        <div className="space-y-2">
          {/* Autocomplete Input */}
          <div className="relative" ref={wrapperRef}>
            <input
              type="text"
              placeholder="Paste ERC20 address or search tokens..."
              value={tokenAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              onFocus={() => setFocused(true)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder-[var(--muted)] transition-colors focus:border-blue-500/50 outline-none"
            />
            {/* Save token button */}
            {canSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSaveForm(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
                title="Save to token list"
              >
                <Star size={14} />
              </button>
            )}
            {/* Already saved badge */}
            {validAddress && isTokenSaved(tokenAddress) && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-500">
                Saved ✓
              </span>
            )}

            {/* Autocomplete dropdown */}
            {focused && matches.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                {matches.map((token) => (
                  <button
                    key={token.id}
                    onMouseDown={(e) => {
                      // Prevent input blur before selection
                      e.preventDefault();
                    }}
                    onClick={() => {
                      onPickToken({
                        address: token.address,
                        name: token.name,
                        symbol: token.symbol,
                        decimals: token.decimals,
                      });
                      setFocused(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--accent)]"
                  >
                    <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-500">
                      {token.symbol}
                    </span>
                    <span className="flex-1 font-medium">{token.name}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {token.scope === "default" ? (
                        <Package size={10} className="inline text-green-500" />
                      ) : token.scope === "global" ? (
                        <Globe size={10} className="inline" />
                      ) : (
                        <User size={10} className="inline" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save token form */}
          {showSaveForm && canSave && (
            <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="text-xs font-medium text-purple-500 whitespace-nowrap">
                Save {symbol}:
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSaveScope("global")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                    saveScope === "global"
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                      : "border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <Globe size={9} /> Global
                </button>
                <button
                  onClick={() => setSaveScope("user")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                    saveScope === "user"
                      ? "bg-purple-500/10 text-purple-500 border border-purple-500/30"
                      : "border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <User size={9} /> Wallet
                </button>
              </div>
              <button
                onClick={handleSaveToken}
                className="ml-auto rounded-md bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>
          )}

          {/* Token info display */}
          {(validAddress || (isNative && !hideNative)) && (
            <div className="flex flex-col gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-[var(--muted)]">
                    <Loader2 size={14} className="animate-spin" />
                    Fetching token info...
                  </span>
                ) : (isNative && !hideNative) || (name && symbol) ? (
                  <span className="text-[var(--foreground)] text-xs">
                    <strong className="font-bold">{isNative ? "ETH" : symbol}</strong> — {isNative ? "Ethereum" : name}{" "}
                    {!isNative && (
                      <span className="text-[var(--muted)] font-mono">
                        ({decimals} decimals)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-amber-500 text-xs font-medium">
                    Could not fetch token info. Verify the address.
                  </span>
                )}

                {balance !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-500 font-bold">
                    <Wallet size={12} />
                    {Number(formatUnits(balance, isNative ? 18 : (decimals ?? 18))).toLocaleString(undefined, { maximumFractionDigits: 6 })} {isNative ? "ETH" : symbol}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
