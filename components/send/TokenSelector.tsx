"use client";

import { useState, useMemo, useEffect } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useTokenList } from "@/hooks/useTokenList";
import { useSettings } from "@/hooks/useSettings";
import { Coins, Search, Star, Globe, User, Package, Wallet, Loader2, Filter, Database } from "lucide-react";
import { formatUnits } from "viem";
import { NATIVE_CURRENCY, SUPPORTED_CHAINS } from "@/config/chains";
import SearchModal from "@/components/ui/SearchModal";
import FilterDropdown from "@/components/ui/FilterDropdown";

interface TokenSelectorProps {
  isNative?: boolean;
  hideNative?: boolean;
  tokenAddress: string;
  tokenSymbol?: string;
  decimals?: number;
  balance?: bigint;
  chainId?: number;
  ownerAddress?: string;
  onToggleNative: (isNative: boolean) => void;
  onAddressChange: (address: string) => void;
  onInfoChange: (info: { name: string; symbol: string; decimals: number; balance?: bigint }) => void;
  onPickToken: (token: { address: string; name: string; symbol: string; decimals: number }) => void;
}

/**
 * TokenSelector with hybrid input support.
 * Allows direct address entry/pasting and modal-based searching.
 */
export default function TokenSelector({
  isNative,
  hideNative,
  tokenAddress,
  tokenSymbol,
  decimals: currentDecimals,
  balance: currentBalance,
  chainId,
  ownerAddress,
  onToggleNative,
  onAddressChange,
  onInfoChange,
  onPickToken,
}: TokenSelectorProps) {
  const { settings, isLoaded } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<"all" | "popular" | "personal">("all");
  const [filterChainId, setFilterChainId] = useState<number | null>(chainId || null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveScope, setSaveScope] = useState<"global" | "user">("global");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSourceFilter(settings.defaultTokenSourceFilter);
    }
  }, [isLoaded, settings.defaultTokenSourceFilter]);

  const validAddress = useMemo(() => {
    const isActuallyERC20 = (isNative === false) || hideNative;
    return isActuallyERC20 && tokenAddress.startsWith("0x") && tokenAddress.length === 42
      ? (tokenAddress as `0x${string}`)
      : undefined;
  }, [isNative, tokenAddress, hideNative]);

  const validOwner = useMemo(() =>
    ownerAddress && ownerAddress.startsWith("0x") && ownerAddress.length === 42
      ? (ownerAddress as `0x${string}`)
      : undefined
  , [ownerAddress]);

  const { name, symbol, decimals, balance, isLoading } = useTokenInfo(validAddress, chainId, validOwner);
  const { tokens: allTokens, add: saveToken, isTokenSaved } = useTokenList(false);

  const nativeInfo = useMemo(() => 
    chainId ? NATIVE_CURRENCY[chainId] : { symbol: "ETH", name: "Ethereum" },
  [chainId]);

  const filteredTokens = useMemo(() => {
    return allTokens.filter(t => {
      if (sourceFilter === "popular" && t.scope !== "default") return false;
      if (sourceFilter === "personal" && t.scope === "default") return false;
      if (filterChainId !== null && t.chainId !== filterChainId) return false;
      return true;
    });
  }, [allTokens, sourceFilter, filterChainId]);

  useEffect(() => {
    if (chainId) {
      Promise.resolve().then(() => {
        setFilterChainId(chainId);
      });
    }
  }, [chainId]);

  // Notify parent when info is loaded or cleared
  useEffect(() => {
    const isActuallyNative = isNative === true && !hideNative;
    const isActuallyValidERC20 = (isNative === false || hideNative) && validAddress && name && symbol && decimals !== undefined;

    if (isActuallyNative || isActuallyValidERC20) {
      const newSymbol = isActuallyNative ? nativeInfo.symbol : symbol!;
      const newDecimals = isActuallyNative ? 18 : decimals!;
      
      const hasChanged = 
        newSymbol !== tokenSymbol || 
        newDecimals !== currentDecimals || 
        balance !== currentBalance;

      if (hasChanged) {
        onInfoChange({ 
          name: isActuallyNative ? nativeInfo.name : name!, 
          symbol: newSymbol, 
          decimals: newDecimals,
          balance
        });
      }
    }
  }, [validAddress, name, symbol, decimals, balance, isNative, hideNative, onInfoChange, tokenSymbol, currentDecimals, currentBalance, nativeInfo]);

  useEffect(() => {
    if (name) {
      Promise.resolve().then(() => {
        setCustomName(name);
      });
    }
  }, [name]);

  const canSave = validAddress && name && symbol && decimals !== undefined && !isTokenSaved(tokenAddress);

  const handleSaveToken = () => {
    if (!validAddress || !name || !symbol || decimals === undefined) return;
    saveToken({ address: tokenAddress, name: customName || name, symbol, decimals, chainId }, saveScope);
    setShowSaveForm(false);
  };

  const activeChainName = filterChainId === null 
    ? "All Networks" 
    : SUPPORTED_CHAINS.find(c => c.id === filterChainId)?.name ?? "Unknown Network";

  const sourceLabel = {
    all: "All Sources",
    popular: "Popular",
    personal: "Personal"
  }[sourceFilter];

  return (
    <div className="space-y-3">
      {/* Toggle */}
      {!hideNative && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleNative(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all ${
              isNative === true
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : "border border-(--border) text-(--muted) hover:text-foreground hover:border-blue-500/20"
            }`}
          >
            <Coins size={14} />
            {nativeInfo.symbol}
          </button>
          <button
            type="button"
            onClick={() => onToggleNative(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all ${
              isNative === false
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : "border border-(--border) text-(--muted) hover:text-foreground hover:border-blue-500/20"
            }`}
          >
            <Search size={14} />
            ERC20
          </button>
        </div>
      )}

      {/* Selector Trigger & Input */}
      {(isNative === false || hideNative) && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Paste token address (0x...)"
              className="w-full rounded-xl border border-(--border) bg-(--input-bg) pl-4 pr-12 py-3 text-sm text-foreground outline-none transition-all focus:border-blue-500/50 hover:border-(--border-hover)"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {tokenSymbol && !isLoading && (
                <span className="hidden sm:block rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500 uppercase">
                  {tokenSymbol}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg p-1.5 text-(--muted) hover:bg-(--accent) hover:text-blue-500 transition-colors"
                title="Search Tokens"
              >
                <Coins size={18} />
              </button>
            </div>
          </div>

          {/* Save token form */}
          {showSaveForm && canSave && (
            <div className="flex flex-col gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Save to List</span>
                <button onClick={() => setShowSaveForm(false)} className="text-xs text-(--muted) hover:text-foreground">✕</button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-(--muted) uppercase pl-1">Token Name</label>
                <input
                  type="text"
                  placeholder="Enter custom name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-lg border border-purple-500/20 bg-(--input-bg) px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button onClick={() => setSaveScope("global")} className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium ${saveScope === "global" ? "bg-blue-500/10 text-blue-500 border border-blue-500/30" : "border border-(--border) text-(--muted)"}`}><Globe size={9} /> Global</button>
                  <button onClick={() => setSaveScope("user")} className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium ${saveScope === "user" ? "bg-purple-500/10 text-purple-500 border border-purple-500/30" : "border border-(--border) text-(--muted)"}`}><User size={9} /> Wallet</button>
                </div>
                <button onClick={handleSaveToken} className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition-all hover:scale-[1.02]">Save Token</button>
              </div>
            </div>
          )}

          {/* Token info display */}
          {(tokenAddress.length > 0 || (isNative && !hideNative)) && (
            <div className="flex flex-col gap-2 rounded-lg bg-(--accent) px-3 py-2 text-sm border border-(--border) shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-(--muted)">
                    <Loader2 size={14} className="animate-spin" />
                    Fetching token info...
                  </span>
                ) : (isNative && !hideNative) || (name && symbol) ? (
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-bold">{isNative ? nativeInfo.symbol : symbol}</span>
                    <span className="text-(--muted) text-xs truncate max-w-[150px]">— {isNative ? nativeInfo.name : name}</span>
                    {canSave && (
                      <button onClick={() => setShowSaveForm(true)} className="ml-1 text-purple-500 hover:bg-purple-500/10 p-1 rounded-md transition-colors"><Star size={12} /></button>
                    )}
                    {validAddress && isTokenSaved(tokenAddress) && <span className="text-[10px] text-purple-500 font-bold ml-1">Saved ✓</span>}
                  </div>
                ) : (
                  <span className="text-amber-500 text-xs font-medium">
                    {tokenAddress.length === 42 ? "Unknown Token" : "Invalid Address Length"}
                  </span>
                )}
                {balance !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-500 font-bold">
                    <Wallet size={12} />
                    {Number(formatUnits(balance, isNative ? 18 : (decimals ?? 18))).toLocaleString(undefined, { maximumFractionDigits: 6 })} {isNative ? nativeInfo.symbol : symbol}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token Search Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Token"
        items={filteredTokens}
        searchFields={(t) => [t.name, t.symbol, t.address]}
        onSelect={(t) => {
          onPickToken({ address: t.address, name: t.name, symbol: t.symbol, decimals: t.decimals });
        }}
        onCustomInput={onAddressChange}
        renderFilter={() => (
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label={sourceLabel}
              value={sourceFilter}
              options={[
                { id: "all", label: "All Sources", icon: Globe },
                { id: "popular", label: "Popular", icon: Package },
                { id: "personal", label: "Personal", icon: User },
              ]}
              onChange={setSourceFilter}
              icon={Database}
              title="Filter by Source"
            />
            <FilterDropdown
              label={activeChainName}
              value={filterChainId}
              options={[
                { id: null as number | null, label: "All Networks", icon: Globe },
                ...SUPPORTED_CHAINS.map(c => ({
                  id: c.id as number | null,
                  label: c.name,
                  renderIcon: (active: boolean) => (
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--accent) text-[10px] ${active ? "text-blue-500" : "text-(--muted)"}`}>
                      {c.name[0]}
                    </div>
                  )
                }))
              ]}
              onChange={setFilterChainId}
              icon={Filter}
              title="Filter by Network"
            />
          </div>
        )}
        placeholder="Search name or paste address..."
        renderItem={(token, onSelect) => (
          <button
            onClick={onSelect}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-(--accent)"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--accent) text-(--muted) font-bold group-hover:bg-blue-500/10 group-hover:text-blue-500">
              {token.symbol[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-500">{token.symbol}</span>
                <span className="font-medium truncate">{token.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-(--muted) opacity-60 font-mono truncate">{token.address}</span>
                <span className="rounded-md bg-blue-500/5 px-1.5 py-0.5 text-[8px] font-bold text-blue-500/70 border border-blue-500/10">
                  {SUPPORTED_CHAINS.find(c => c.id === token.chainId)?.name || `Chain ${token.chainId}`}
                </span>
              </div>
            </div>
            <span className="text-xs text-(--muted)">
              {token.scope === "default" ? <Package size={12} className="text-green-500" /> : token.scope === "global" ? <Globe size={12} /> : <User size={12} />}
            </span>
          </button>
        )}
      />
    </div>
  );
}
