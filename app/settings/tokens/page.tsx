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
  Database,
} from "lucide-react";
import { useConnection, useChainId } from "wagmi";
import { isAddress, getAddress, formatUnits } from "viem";
import toast from "react-hot-toast";
import { useTokenList } from "@/hooks/useTokenList";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useSettings } from "@/hooks/useSettings";
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

function TokenRow({ token, onRemove }: { token: { address: string; symbol: string; name: string; chainId: number; scope: "global" | "user" | "default"; isDefault: boolean; decimals: number }; onRemove: () => void }) {
  const { address: userAddress } = useConnection();
  const { balance, isLoading, isError } = useTokenInfo(token.address as `0x${string}`, token.chainId);
  const chainName = SUPPORTED_CHAINS.find((c) => c.id === token.chainId)?.name ?? `Chain ${token.chainId}`;

  return (
    <div className="group relative flex items-center justify-between rounded-2xl border border-(--border) bg-(--card) p-4 transition-all hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--accent) text-(--muted) font-bold transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500">
            {token.symbol[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-(--foreground)">{token.symbol}</span>
              <span className="text-xs text-(--muted) truncate">{token.name}</span>
              <ScopeBadge scope={token.scope} />
              <span className="rounded-md bg-blue-500/5 px-2 py-0.5 text-[10px] font-bold text-blue-500/70 border border-blue-500/10">
                {chainName}
              </span>
            </div>
            <p className="mt-0.5 truncate font-mono text-[10px] text-(--muted) opacity-60">
              {token.address}
            </p>
          </div>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4">
        {userAddress && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-[9px] font-bold uppercase tracking-wider text-(--muted)">Balance</div>
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
              <span className="text-[10px] font-medium text-(--muted)">—</span>
            )}
          </div>
        )}

        {!token.isDefault && (
          <button
            onClick={() => {
              onRemove();
              toast.success(`${token.symbol} removed`);
            }}
            className="shrink-0 rounded-xl p-2 text-(--muted) transition-all hover:bg-red-500/10 hover:text-red-500"
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
  const { settings, isLoaded } = useSettings();
  const { tokens, add, remove } = useTokenList(false);
  const { isConnected } = useConnection();
  const currentChainId = useChainId();
  const [showAdd, setShowAdd] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [customName, setCustomName] = useState("");
  const [newScope, setNewScope] = useState<"global" | "user">("global");
  const [selectedChainId, setSelectedChainId] = useState<number>(currentChainId);
  
  // Filters
  const [filterChainId, setFilterChainId] = useState<number | null>(null);
  const [sourceFilter, setSourceFilter] = useState<"all" | "popular" | "personal">("all");
  
  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSourceFilter(settings.defaultTokenSourceFilter);
    }
  }, [isLoaded, settings.defaultTokenSourceFilter]);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected chain when current chain changes, but only if not manually changed
  useEffect(() => {
    Promise.resolve().then(() => {
      setSelectedChainId(currentChainId);
    });
  }, [currentChainId]);

  // Sync customName with fetched name
  const validAddress =
    isAddress(newAddress)
      ? getAddress(newAddress)
      : undefined;

  const { name, symbol, decimals, balance, isLoading, isError, error } = useTokenInfo(validAddress, selectedChainId);

  useEffect(() => {
    if (name) {
      Promise.resolve().then(() => {
        setCustomName(name);
      });
    }
  }, [name]);

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
      await add({ 
        address: newAddress, 
        name: customName || name, 
        symbol, 
        decimals, 
        chainId: selectedChainId 
      }, newScope);
      setNewAddress("");
      setCustomName("");
      setNewScope("global");
      setShowAdd(false);
      toast.success(`${symbol} saved`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save token");
    }
  };

  const filteredTokens = tokens.filter(t => {
    // Source filter logic
    if (sourceFilter === "popular" && t.scope !== "default") return false;
    if (sourceFilter === "personal" && t.scope === "default") return false;
    
    // Network filter logic
    if (filterChainId !== null && t.chainId !== filterChainId) return false;
    
    return true;
  });

  const activeFilterName = filterChainId === null 
    ? "All Networks" 
    : SUPPORTED_CHAINS.find(c => c.id === filterChainId)?.name ?? "Unknown Network";

  const sourceLabel = {
    all: "All Sources",
    popular: "Popular",
    personal: "Personal"
  }[sourceFilter];

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Coins size={20} className="text-purple-500" />
          Saved Tokens
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <div className="relative" ref={sourceDropdownRef}>
            <button
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-xs font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Database size={14} className={sourceFilter !== "all" ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{sourceLabel}</span>
              <ChevronDown size={14} className={`text-(--muted) transition-transform ${showSourceDropdown ? "rotate-180" : ""}`} />
            </button>

            {showSourceDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-52 origin-top-right rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">Filter by Source</div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { setSourceFilter("all"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "all" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <Globe size={14} className={sourceFilter === "all" ? "text-blue-500" : "text-(--muted)"} />
                    All Sources
                  </button>
                  <button
                    onClick={() => { setSourceFilter("popular"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "popular" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <Package size={14} className={sourceFilter === "popular" ? "text-blue-500" : "text-(--muted)"} />
                    Popular (Defaults)
                  </button>
                  <button
                    onClick={() => { setSourceFilter("personal"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "personal" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <User size={14} className={sourceFilter === "personal" ? "text-blue-500" : "text-(--muted)"} />
                    Personal (Added)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Network Filter */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-xs font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Filter size={14} className={filterChainId ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{activeFilterName}</span>
              <ChevronDown size={14} className={`text-(--muted) transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">Filter by Network</div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      setFilterChainId(null);
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                      filterChainId === null ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                    }`}
                  >
                    <Globe size={14} className={filterChainId === null ? "text-blue-500" : "text-(--muted)"} />
                    All Networks
                  </button>
                  <div className="my-1 border-t border-(--border) opacity-50" />
                  {SUPPORTED_CHAINS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setFilterChainId(c.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                        filterChainId === c.id ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                      }`}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--accent) text-[10px]">
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

      <p className="mt-4 text-sm text-(--muted)">
        Showing <strong>{filteredTokens.length}</strong> token{filteredTokens.length !== 1 ? "s" : ""} in your list.
      </p>

      {/* Add form */}
      {showAdd && (
        <div className="mt-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Token Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-xl border border-(--border) bg-(--input-bg) px-4 py-3 text-sm font-mono focus:border-purple-500/50 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Network</label>
              <div className="relative">
                <select
                  value={selectedChainId}
                  onChange={(e) => setSelectedChainId(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-(--border) bg-(--input-bg) px-4 py-3 text-sm font-semibold focus:border-purple-500/50 outline-none"
                >
                  {SUPPORTED_CHAINS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-(--card)">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--muted)" />
              </div>
            </div>
          </div>

          {validAddress && (
            <div className="rounded-xl bg-(--card) border border-(--border) p-4 shadow-sm">
              {isLoading ? (
                <span className="flex items-center gap-2 text-sm text-(--muted)">
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-bold">
                      {symbol[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold">{symbol}</div>
                      <div className="flex flex-col gap-1.5 mt-1">
                        <label className="text-[9px] font-bold text-(--muted) uppercase tracking-tight">Display Name</label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="w-full sm:w-64 rounded-lg border border-(--border) bg-(--input-bg) px-3 py-1.5 text-xs font-medium focus:border-purple-500/50 outline-none transition-colors"
                          placeholder="Enter custom name..."
                        />
                      </div>
                    </div>
                  </div>
                  {balance !== undefined && (
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-(--muted)">Your Balance</div>
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
                    : "border-(--border) text-(--muted) hover:text-(--foreground)"
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
                    : "border-(--border) text-(--muted) hover:text-(--foreground)"
                }`}
              >
                <User size={14} /> Wallet
              </button>
            </div>
            
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-(--muted) hover:text-(--foreground)"
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
        <div className="mt-8 rounded-2xl border border-dashed border-(--border) py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--accent) text-(--muted) mb-4">
            <Coins size={24} />
          </div>
          <p className="text-sm font-medium text-(--muted) px-4">
            {tokens.length === 0 
              ? "Your token list is empty. Add a custom token to get started." 
              : "No tokens found for this network."}
          </p>
        </div>
      )}
    </section>
  );
}
