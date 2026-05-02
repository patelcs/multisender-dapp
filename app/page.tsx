"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useConnection, useBalance, useReadContract, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { useTokenList, TokenEntry } from "@/hooks/useTokenList";
import { SUPPORTED_CHAINS, NATIVE_CURRENCY } from "@/config/chains";
import { ERC20_ABI } from "@/config/abi";
import { 
  Wallet, 
  RefreshCw, 
  Search, 
  ArrowUpRight,
  Filter,
  ChevronDown,
  Check,
  Globe,
  Database,
  Package,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

/**
 * Individual row component to isolate balance fetching hooks.
 * This prevents hook-in-loop violations and ensures correct chain scoping.
 */
function TokenBalanceRow({ 
  token, 
  userAddress, 
  searchQuery, 
  selectedChainId,
  showZeroBalances
}: { 
  token: TokenEntry, 
  userAddress: `0x${string}`,
  searchQuery: string,
  selectedChainId: number | "all",
  showZeroBalances: boolean
}) {
  const isNative = token.address === "0x0000000000000000000000000000000000000000";
  
  // Fetch Native Balance
  const { data: nativeData, isLoading: isNativeLoading, isError: isNativeError } = useBalance({
    address: userAddress,
    chainId: token.chainId,
    query: {
      enabled: !!userAddress && isNative,
      staleTime: 30_000,
    }
  });

  // Fetch ERC20 Balance
  const { data: erc20Data, isLoading: isErc20Loading, isError: isErc20Error } = useReadContract({
    address: isNative ? undefined : token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress],
    chainId: token.chainId,
    query: {
      enabled: !!userAddress && !isNative,
      staleTime: 30_000,
    }
  });

  const isLoading = isNative ? isNativeLoading : isErc20Loading;
  const isError = isNative ? isNativeError : isErc20Error;
  const balance = isNative ? nativeData?.value : (erc20Data as bigint | undefined);

  const matchesFilter = useMemo(() => {
    const matchesChain = selectedChainId === "all" || token.chainId === selectedChainId;
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChain && matchesSearch;
  }, [token, selectedChainId, searchQuery]);

  // Hide if it doesn't match filters
  if (!matchesFilter) return null;

  // Hide if balance is zero (once loaded) and we want to hide them
  if (!showZeroBalances && !isLoading && !isError && (balance === undefined || balance === 0n)) return null;

  return (
    <tr className="transition-colors hover:bg-(--accent)/30">
      <td className="px-6 py-4">
        <Link 
          href={`/token/${token.chainId}/${token.address}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-xs font-bold text-white shadow-sm">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="font-bold">{token.name}</div>
            <div className="text-xs text-(--muted) font-mono">{token.address.slice(0, 6)}...{token.address.slice(-4)}</div>
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-0.5 text-xs font-medium text-blue-500">
          {SUPPORTED_CHAINS.find(c => c.id === token.chainId)?.name}
        </span>
      </td>
      <td className="px-6 py-4">
        {isLoading ? (
          <div className="h-6 w-24 animate-pulse rounded-lg bg-(--accent)" />
        ) : isError ? (
          <div className="text-xs text-red-500 font-medium">Error fetching</div>
        ) : (
          <>
            <div className="font-bold">
              {Number(formatUnits(balance ?? 0n, token.decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <div className="text-xs text-(--muted)">{token.symbol}</div>
          </>
        )}
      </td>
    </tr>
  );
}

import { useSettings } from "@/hooks/useSettings";

export default function PortfolioPage() {
  const { settings, isLoaded } = useSettings();
  const { address: userAddress, isConnected } = useConnection();
  const currentChainId = useChainId();
  const [selectedChainId, setSelectedChainId] = useState<number | "all">(currentChainId);
  const [sourceFilter, setSourceFilter] = useState<"all" | "popular" | "personal">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showZeroBalances, setShowZeroBalances] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);

  const { tokens: savedTokens, isLoading: tokensLoading, refresh: refreshTokens } = useTokenList(false);

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowZeroBalances(settings.portfolioShowZeroBalances);
      setSourceFilter(settings.defaultTokenSourceFilter);
    }
  }, [isLoaded, settings.portfolioShowZeroBalances, settings.defaultTokenSourceFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected chain when current chain changes if it was not manually changed
  // This helps when the user switches networks in their wallet
  useEffect(() => {
    if (isConnected) {
      Promise.resolve().then(() => {
        setSelectedChainId(currentChainId);
      });
    }
  }, [currentChainId, isConnected]);

  // 1. Prepare the full list of potential assets (Native + Saved ERC20s)
  const allPotentialAssets = useMemo(() => {
    const result: TokenEntry[] = [];

    // Add native assets for each chain (only if source is "all" or "popular")
    if (sourceFilter === "all" || sourceFilter === "popular") {
      SUPPORTED_CHAINS.forEach(chain => {
        const nativeInfo = NATIVE_CURRENCY[chain.id];
        result.push({
          id: `native-${chain.id}`,
          address: "0x0000000000000000000000000000000000000000",
          name: nativeInfo.name,
          symbol: nativeInfo.symbol,
          decimals: nativeInfo.decimals,
          chainId: chain.id,
          scope: "default",
          isDefault: true,
        });
      });
    }

    // Add saved tokens based on source filter
    const filteredSaved = savedTokens.filter(t => {
      if (sourceFilter === "popular" && t.scope !== "default") return false;
      if (sourceFilter === "personal" && t.scope === "default") return false;
      return true;
    });

    result.push(...filteredSaved);

    return result;
  }, [savedTokens, sourceFilter]);

  const handleRefresh = () => {
    refreshTokens();
  };

  const activeFilterName = selectedChainId === "all" 
    ? "All Chains" 
    : SUPPORTED_CHAINS.find(c => c.id === selectedChainId)?.name ?? "Unknown Network";

  const sourceLabel = {
    all: "All Sources",
    popular: "Popular",
    personal: "Personal"
  }[sourceFilter];

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 rounded-full bg-blue-500/10 p-6 text-blue-500">
          <Wallet size={48} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Connect your wallet</h1>
        <p className="mt-4 max-w-md text-(--muted)">
          Connect your wallet to view your portfolio across all supported chains and manage your tokens.
        </p>
        <div className="mt-8">
          <div className="rounded-xl border border-(--border) bg-(--card) p-4 text-sm font-medium">
            Use the &quot;Connect Wallet&quot; button in the top right.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            My <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="mt-2 text-base sm:text-lg text-(--muted)">
            Viewing your balances across all supported networks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2.5 text-sm font-bold transition-all hover:bg-(--accent)"
          >
            <RefreshCw size={16} className={tokensLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/multisend"
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            Send Tokens
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {/* Source Filter Dropdown */}
          <div className="relative" ref={sourceDropdownRef}>
            <button
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-sm font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Database size={16} className={sourceFilter !== "all" ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-37.5">{sourceLabel}</span>
              <ChevronDown size={16} className={`text-(--muted) transition-transform ${showSourceDropdown ? "rotate-180" : ""}`} />
            </button>

            {showSourceDropdown && (
              <div className="absolute left-0 top-full z-20 mt-2 w-52 origin-top-left rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
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
                    Popular
                  </button>
                  <button
                    onClick={() => { setSourceFilter("personal"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "personal" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <User size={14} className={sourceFilter === "personal" ? "text-blue-500" : "text-(--muted)"} />
                    Personal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Network Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-sm font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Filter size={16} className={selectedChainId !== "all" ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-37.5">{activeFilterName}</span>
              <ChevronDown size={16} className={`text-(--muted) transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute left-0 top-full z-20 mt-2 w-56 origin-top-left rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">Filter by Network</div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      setSelectedChainId("all");
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                      selectedChainId === "all" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                    }`}
                  >
                    <Globe size={14} className={selectedChainId === "all" ? "text-blue-500" : "text-(--muted)"} />
                    All Chains
                  </button>
                  <div className="my-1 border-t border-(--border) opacity-50" />
                  {SUPPORTED_CHAINS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChainId(c.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                        selectedChainId === c.id ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                      }`}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--accent) text-[10px]">
                        {c.name[0]}
                      </div>
                      <span className="truncate">{c.name}</span>
                      {selectedChainId === c.id && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zero Balance Toggle */}
          <button
            onClick={() => setShowZeroBalances(!showZeroBalances)}
            className={`flex items-center gap-2 rounded-xl border border-(--border) px-4 py-2 text-sm font-bold transition-all ${
              showZeroBalances 
                ? "bg-blue-500/5 text-blue-500 border-blue-500/20" 
                : "bg-(--card) text-(--muted) hover:text-foreground"
            }`}
            title={showZeroBalances ? "Showing all tokens" : "Hiding tokens with zero balance"}
          >
            {showZeroBalances ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="hidden sm:inline">{showZeroBalances ? "Showing All" : "Hide Empty"}</span>
          </button>
        </div>

        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" size={18} />
          <input
            type="text"
            placeholder="Search tokens or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-(--border) bg-(--card) py-2 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="overflow-hidden rounded-3xl border border-(--border) bg-(--card) shadow-xl">
        {tokensLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={40} className="animate-spin text-blue-500" />
            <p className="mt-4 text-(--muted)">Loading assets...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-(--border) bg-(--accent)/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-(--muted)">Token</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-(--muted)">Network</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-(--muted)">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {allPotentialAssets.map((token) => (
                  <TokenBalanceRow 
                    key={token.id} 
                    token={token} 
                    userAddress={userAddress!} 
                    searchQuery={searchQuery} 
                    selectedChainId={selectedChainId} 
                    showZeroBalances={showZeroBalances}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-12 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-500">How Portfolio Works</h3>
            <p className="mt-2 text-(--muted) leading-relaxed">
              This view scans your saved tokens and the default list across all supported networks. 
              Your private RPC settings from settings are respected during balance fetching.
            </p>
          </div>
          <Link
            href="/settings/tokens"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 px-6 py-3 text-sm font-bold text-blue-500 hover:bg-blue-500/10 transition-all"
          >
            Manage Token List
          </Link>
        </div>
      </div>
    </div>
  );
}
