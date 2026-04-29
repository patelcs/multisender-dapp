"use client";

import { useState, useRef, useEffect } from "react";
import {
  Coins,
  Plus,
  Trash2,
  Globe,
  User,
  Package,
  Wallet,
  Loader2,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { isAddress, getAddress, formatUnits } from "viem";
import toast from "react-hot-toast";
import { useTokenList } from "@/hooks/useTokenList";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { SUPPORTED_CHAINS } from "@/config/chains";

// ─── Scope badge ────────────────────────────────────────────────

function ScopeBadge({ scope }: { scope: "global" | "user" | "default" }) {
  if (scope === "default") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
        <Package size={10} /> Default
      </span>
    );
  }
  return scope === "global" ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
      <Globe size={10} /> Global
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500">
      <User size={10} /> Wallet
    </span>
  );
}

function TokenRow({ token, onRemove }: { token: any; onRemove: () => void }) {
  const { address: userAddress } = useAccount();
  const { balance, isLoading, isError } = useTokenInfo(token.address as `0x${string}`, token.chainId);
  const chainName = SUPPORTED_CHAINS.find((c) => c.id === token.chainId)?.name ?? `Chain ${token.chainId}`;

  return (
    <div className="group relative flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--muted)] font-bold transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500">
            {token.symbol[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-[var(--foreground)]">{token.symbol}</span>
              <span className="text-xs text-[var(--muted)] truncate">{token.name}</span>
              <ScopeBadge scope={token.scope} />
              <span className="rounded-md bg-blue-500/5 px-2 py-0.5 text-[10px] font-bold text-blue-500/70 border border-blue-500/10">
                {chainName}
              </span>
            </div>
            <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--muted)] opacity-60">
              {token.address}
            </p>
          </div>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4">
        {userAddress && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">Balance</div>
            {isLoading ? (
              <Loader2 size={12} className="animate-spin text-blue-500 mt-0.5" />
            ) : isError ? (
              <span className="text-[10px] font-medium text-red-400">Error</span>
            ) : balance !== undefined ? (
              <div className="flex items-center gap-1.5 text-sm font-bold text-blue-500">
                <Wallet size={12} className="opacity-70" />
                {Number(formatUnits(balance, token.decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
            ) : (
              <span className="text-[10px] font-medium text-[var(--muted)]">—</span>
            )}
          </div>
        )}

        {!token.isDefault && (
          <button
            onClick={() => {
              onRemove();
              toast.success(`${token.symbol} removed`);
            }}
            className="shrink-0 rounded-xl p-2 text-[var(--muted)] transition-all hover:bg-red-500/10 hover:text-red-500"
            aria-label="Delete token"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SavedTokensPage() {
  const { tokens, add, remove } = useTokenList(false);
  const { isConnected } = useAccount();
  const currentChainId = useChainId();
  const [showAdd, setShowAdd] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newScope, setNewScope] = useState<"global" | "user">("global");
  const [selectedChainId, setSelectedChainId] = useState<number>(currentChainId);
  const [filterChainId, setFilterChainId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected chain when current chain changes, but only if not manually changed
  useEffect(() => {
    setSelectedChainId(currentChainId);
  }, [currentChainId]);

  const validAddress =
    isAddress(newAddress)
      ? getAddress(newAddress)
      : undefined;

  const { name, symbol, decimals, balance, isLoading, isError, error } = useTokenInfo(validAddress, selectedChainId);

  const handleAdd = async () => {
    if (!validAddress || isError || !name || !symbol || decimals === undefined) {
      toast.error("Enter a valid token address and wait for info to load");
      return;
    }
    if (newScope === "user" && !isConnected) {
      toast.error("Connect a wallet to add user-scoped tokens");
      return;
    }
    try {
      await add({ address: newAddress, name, symbol, decimals, chainId: selectedChainId }, newScope);
      setNewAddress("");
      setNewScope("global");
      setShowAdd(false);
      toast.success(`${symbol} saved`);
    } catch (err: any) {
      toast.error(err.message || "Failed to save token");
    }
  };

  const filteredTokens = filterChainId === null 
    ? tokens 
    : tokens.filter(t => t.chainId === filterChainId);

  const activeFilterName = filterChainId === null 
    ? "All Networks" 
    : SUPPORTED_CHAINS.find(c => c.id === filterChainId)?.name ?? "Unknown Network";

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Coins size={20} className="text-purple-500" />
          Saved Tokens
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Scalable Network Filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Filter size={14} className={filterChainId ? "text-blue-500" : "text-[var(--muted)]"} />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{activeFilterName}</span>
              <ChevronDown size={14} className={`text-[var(--muted)] transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Filter by Network</div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      setFilterChainId(null);
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                      filterChainId === null ? "bg-blue-500/10 text-blue-500" : "hover:bg-[var(--accent)]"
                    }`}
                  >
                    <Globe size={14} className={filterChainId === null ? "text-blue-500" : "text-[var(--muted)]"} />
                    All Networks
                  </button>
                  <div className="my-1 border-t border-[var(--border)] opacity-50" />
                  {SUPPORTED_CHAINS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setFilterChainId(c.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                        filterChainId === c.id ? "bg-blue-500/10 text-blue-500" : "hover:bg-[var(--accent)]"
                      }`}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--accent)] text-[10px]">
                        {c.name[0]}
                      </div>
                      <span className="truncate">{c.name}</span>
                      {filterChainId === c.id && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-purple-500/30 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Token</span>
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        Showing <strong>{filteredTokens.length}</strong> token{filteredTokens.length !== 1 ? "s" : ""} in your list.
      </p>

      {/* Add form */}
      {showAdd && (
        <div className="mt-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">Token Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm font-mono focus:border-purple-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">Network</label>
              <div className="relative">
                <select
                  value={selectedChainId}
                  onChange={(e) => setSelectedChainId(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm font-semibold focus:border-purple-500/50"
                >
                  {SUPPORTED_CHAINS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[var(--card)]">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]" />
              </div>
            </div>
          </div>

          {validAddress && (
            <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 shadow-sm">
              {isLoading ? (
                <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  Fetching metadata on {SUPPORTED_CHAINS.find(c => c.id === selectedChainId)?.name}...
                </span>
              ) : isError ? (
                <div className="flex flex-col gap-1">
                  <span className="text-red-500 text-sm font-bold">
                    Token not found on this network.
                  </span>
                  {error && (
                    <span className="text-[10px] text-red-400 font-mono break-all opacity-70">
                      {error instanceof Error ? error.message : String(error)}
                    </span>
                  )}
                </div>
              ) : name && symbol ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-bold">
                      {symbol[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{symbol}</div>
                      <div className="text-xs text-[var(--muted)]">{name} • {decimals} decimals</div>
                    </div>
                  </div>
                  {balance !== undefined && (
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Your Balance</div>
                      <div className="text-sm font-bold text-blue-500">
                        {Number(formatUnits(balance, decimals ?? 18)).toLocaleString()} {symbol}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
          
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setNewScope("global")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                  newScope === "global"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Globe size={14} /> Global
              </button>
              <button
                onClick={() => setNewScope("user")}
                disabled={!isConnected}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border disabled:opacity-30 ${
                  newScope === "user"
                    ? "bg-purple-500 border-purple-500 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <User size={14} /> Wallet
              </button>
            </div>
            
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name || !symbol || isError || isLoading}
                className="flex-1 sm:flex-none rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-40 shadow-md shadow-purple-500/10"
              >
                Save Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token list */}
      {filteredTokens.length > 0 ? (
        <div className="mt-6 space-y-3">
          {filteredTokens.map((token) => (
            <TokenRow key={token.id} token={token} onRemove={() => remove(token.id)} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--muted)] mb-4">
            <Coins size={24} />
          </div>
          <p className="text-sm font-medium text-[var(--muted)] px-4">
            {tokens.length === 0 
              ? "Your token list is empty. Add a custom token to get started." 
              : "No tokens found for this network."}
          </p>
        </div>
      )}
    </section>
  );
}
