"use client";

import { useMemo, useState } from "react";
import { useAccount, useReadContracts, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { ERC20_ABI } from "@/config/abi";
import { useTokenList, TokenEntry } from "@/hooks/useTokenList";
import { SUPPORTED_CHAINS, NATIVE_CURRENCY } from "@/config/chains";
import { 
  Wallet, 
  RefreshCw, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ExternalLink,
  Coins,
  ShieldCheck,
  TrendingUp,
  CreditCard
} from "lucide-react";
import Link from "next/link";

interface TokenBalance extends TokenEntry {
  balance: bigint;
  formattedBalance: string;
}

export default function PortfolioPage() {
  const { address: userAddress, isConnected } = useAccount();
  const [selectedChainId, setSelectedChainId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { tokens, isLoading: tokensLoading, refresh: refreshTokens } = useTokenList(false);

  // 1. Prepare native balance queries for each chain
  const nativeBalances = SUPPORTED_CHAINS.map(chain => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, refetch } = useBalance({
      address: userAddress,
      chainId: chain.id,
      query: { enabled: !!userAddress }
    });
    return { chainId: chain.id, data, isLoading, refetch };
  });

  // 2. Prepare ERC20 balance queries
  const erc20Tokens = useMemo(() => {
    return tokens.filter(t => t.address !== "0x0000000000000000000000000000000000000000");
  }, [tokens]);

  const erc20Contracts = useMemo(() => {
    if (!userAddress) return [];
    return erc20Tokens.map(t => ({
      address: t.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [userAddress],
      chainId: t.chainId,
    }));
  }, [erc20Tokens, userAddress]);

  const { data: erc20BalancesData, isLoading: balancesLoading, refetch: refetchBalances } = useReadContracts({
    contracts: erc20Contracts,
    query: {
      enabled: erc20Contracts.length > 0 && !!userAddress,
    }
  });

  // 3. Merge everything
  const allBalances: TokenBalance[] = useMemo(() => {
    if (!userAddress) return [];

    const result: TokenBalance[] = [];

    // Add native balances
    nativeBalances.forEach(nb => {
      if (nb.data && nb.data.value > 0n) {
        const nativeInfo = NATIVE_CURRENCY[nb.chainId];
        result.push({
          id: `native-${nb.chainId}`,
          address: "0x0000000000000000000000000000000000000000",
          name: nativeInfo.name,
          symbol: nativeInfo.symbol,
          decimals: nativeInfo.decimals,
          chainId: nb.chainId,
          scope: "default",
          isDefault: true,
          balance: nb.data.value,
          formattedBalance: formatUnits(nb.data.value, nativeInfo.decimals),
        });
      }
    });

    // Add ERC20 balances
    if (erc20BalancesData) {
      erc20Tokens.forEach((t, i) => {
        const balanceResult = erc20BalancesData[i] as any;
        if (balanceResult?.status === "success" && typeof balanceResult.result === "bigint" && balanceResult.result > 0n) {
          const val = balanceResult.result;
          result.push({
            ...t,
            balance: val,
            formattedBalance: formatUnits(val, t.decimals),
          });
        }
      });
    }

    return result;
  }, [userAddress, nativeBalances, erc20BalancesData, erc20Tokens]);

  // 4. Filter by chain and search query
  const filteredBalances = useMemo(() => {
    return allBalances.filter(b => {
      const matchesChain = selectedChainId === "all" || b.chainId === selectedChainId;
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           b.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChain && matchesSearch;
    });
  }, [allBalances, selectedChainId, searchQuery]);

  const handleRefresh = () => {
    refetchBalances();
    nativeBalances.forEach(nb => nb.refetch());
    refreshTokens();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 rounded-full bg-blue-500/10 p-6 text-blue-500">
          <Wallet size={48} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Connect your wallet</h1>
        <p className="mt-4 max-w-md text-[var(--muted)]">
          Connect your wallet to view your portfolio across all supported chains and manage your tokens.
        </p>
        <div className="mt-8">
          {/* ConnectButton is handled by Navbar, but we can show a placeholder or prompt */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm font-medium">
            Use the &quot;Connect Wallet&quot; button in the top right.
          </div>
        </div>
      </div>
    );
  }

  const isLoading = tokensLoading || (balancesLoading && erc20Contracts.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            My <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">
            Viewing your non-zero balances across all supported networks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-bold transition-all hover:bg-[var(--accent)]"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/multisend"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            Send Tokens
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Coins size={20} />
          </div>
          <div className="text-sm font-medium text-[var(--muted)]">Assets Found</div>
          <div className="mt-1 text-2xl font-bold">{allBalances.length}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <TrendingUp size={20} />
          </div>
          <div className="text-sm font-medium text-[var(--muted)]">Active Chains</div>
          <div className="mt-1 text-2xl font-bold">
            {new Set(allBalances.map(b => b.chainId)).size}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
            <ShieldCheck size={20} />
          </div>
          <div className="text-sm font-medium text-[var(--muted)]">Security Status</div>
          <div className="mt-1 text-2xl font-bold text-green-500">Secure</div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <CreditCard size={20} />
          </div>
          <div className="text-sm font-medium text-[var(--muted)]">Address</div>
          <div className="mt-1 text-sm font-mono font-bold truncate">
            {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedChainId("all")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              selectedChainId === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All Chains
          </button>
          {SUPPORTED_CHAINS.map(chain => (
            <button
              key={chain.id}
              onClick={() => setSelectedChainId(chain.id)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                selectedChainId === chain.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {chain.name}
            </button>
          ))}
        </div>

        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <input
            type="text"
            placeholder="Search tokens or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={40} className="animate-spin text-blue-500" />
            <p className="mt-4 text-[var(--muted)]">Fetching balances...</p>
          </div>
        ) : filteredBalances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--accent)]/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Token</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Network</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Balance</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredBalances.map((token) => (
                  <tr key={token.id} className="transition-colors hover:bg-[var(--accent)]/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold">{token.name}</div>
                          <div className="text-xs text-[var(--muted)] font-mono">{token.address.slice(0, 6)}...{token.address.slice(-4)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                        {SUPPORTED_CHAINS.find(c => c.id === token.chainId)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{parseFloat(token.formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                      <div className="text-xs text-[var(--muted)]">{token.symbol}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/multisend?token=${token.address}&chainId=${token.chainId}`}
                          className="rounded-lg bg-blue-500/10 p-2 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          title="Multi Send"
                        >
                          <ArrowUpRight size={18} />
                        </Link>
                        <a
                          href={`${SUPPORTED_CHAINS.find(c => c.id === token.chainId)?.blockExplorers?.default.url}/address/${userAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-[var(--accent)] p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          title="View on Explorer"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-[var(--accent)] p-6 text-[var(--muted)]">
              <Filter size={40} />
            </div>
            <h3 className="text-xl font-bold">No assets found</h3>
            <p className="mt-2 max-w-sm text-[var(--muted)]">
              We couldn&apos;t find any tokens with a non-zero balance on the selected networks. 
              Try adding more tokens in settings or switching networks.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/settings/tokens"
                className="rounded-xl border border-[var(--border)] px-6 py-2.5 text-sm font-bold transition-all hover:bg-[var(--accent)]"
              >
                Add Tokens
              </Link>
              <button
                onClick={() => {setSelectedChainId("all"); setSearchQuery("");}}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-12 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-500">How Portfolio Works</h3>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              This view scans all tokens in your **personal list** and our **global default list** across 
              Ethereum and Sepolia. It only displays assets where you have a positive balance. 
              You can quickly jump to Multi-Send for any asset using the shortcut icon.
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
