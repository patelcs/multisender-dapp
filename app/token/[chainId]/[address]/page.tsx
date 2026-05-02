"use client";

import { useConnection } from "wagmi";
import { useParams } from "next/navigation";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { SUPPORTED_CHAINS } from "@/config/chains";
import { 
  ArrowLeft, 
  Send, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink, 
  Wallet,
  Coins,
  Activity
} from "lucide-react";
import Link from "next/link";
import { formatUnits } from "viem";

export default function TokenPortfolioPage() {
  const params = useParams();
  const chainId = Number(params.chainId);
  const tokenAddress = params.address as string;
  const { address: userAddress } = useConnection();

  const isNative = tokenAddress === "0x0000000000000000000000000000000000000000";
  
  const { name, symbol, decimals, balance, isLoading: tokenLoading } = useTokenInfo(
    isNative ? undefined : (tokenAddress as `0x${string}`),
    chainId
  );

  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  
  const tokenName = isNative ? (chain?.nativeCurrency.name || "Ethereum") : name;
  const tokenSymbol = isNative ? (chain?.nativeCurrency.symbol || "ETH") : symbol;
  const tokenDecimals = isNative ? 18 : decimals;

  const isLoading = tokenLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-(--muted) hover:text-(--foreground) transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </Link>

      {/* Token Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold text-white shadow-lg">
            {tokenSymbol?.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tokenName || "Loading..."}</h1>
            <div className="flex items-center gap-2 text-(--muted)">
              <span className="rounded-md bg-(--accent) px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                {chain?.name}
              </span>
              {!isNative && (
                <span className="text-xs font-mono">{tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}</span>
              )}
            </div>
          </div>
        </div>
        
        {chain?.blockExplorers?.default.url && (
          <a
            href={`${chain.blockExplorers.default.url}/address/${isNative ? userAddress : tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-sm font-bold transition-all hover:bg-(--accent)"
          >
            <ExternalLink size={16} />
            Explorer
          </a>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="md:col-span-2 rounded-3xl border border-(--border) bg-(--card) p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-(--muted)">
              <Wallet size={16} />
              Your Balance
            </div>
            {isLoading && <Activity size={16} className="animate-spin text-blue-500" />}
          </div>
          
          <div className="mb-2 text-5xl font-extrabold tracking-tight">
            {balance !== undefined ? (
              Number(formatUnits(balance, tokenDecimals || 18)).toLocaleString(undefined, { maximumFractionDigits: 6 })
            ) : (
              "0.00"
            )}
          </div>
          <div className="text-xl font-bold text-blue-500">{tokenSymbol}</div>
          
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-(--border) pt-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-(--muted)">Decimals</div>
              <div className="mt-1 font-bold">{tokenDecimals || 18}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-(--muted)">Type</div>
              <div className="mt-1 font-bold">{isNative ? "Native" : "ERC20"}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-(--muted)">Actions</h3>
            <div className="grid gap-3">
              <Link
                href={`/send?token=${tokenAddress}&chainId=${chainId}`}
                className="flex items-center gap-3 rounded-xl bg-blue-500/10 p-4 text-blue-500 transition-all hover:bg-blue-500 hover:text-white"
              >
                <Send size={20} />
                <div className="text-left">
                  <div className="text-sm font-bold">Single Send</div>
                  <div className="text-[10px] opacity-80">Simple transfer</div>
                </div>
              </Link>
              
              <Link
                href={`/multisend?token=${tokenAddress}&chainId=${chainId}`}
                className="flex items-center gap-3 rounded-xl bg-purple-500/10 p-4 text-purple-500 transition-all hover:bg-purple-500 hover:text-white"
              >
                <ArrowUpRight size={20} />
                <div className="text-left">
                  <div className="text-sm font-bold">Multi Send</div>
                  <div className="text-[10px] opacity-80">Bulk distribution</div>
                </div>
              </Link>

              {!isNative && (
                <Link
                  href={`/approvals?token=${tokenAddress}&chainId=${chainId}`}
                  className="flex items-center gap-3 rounded-xl bg-amber-500/10 p-4 text-amber-500 transition-all hover:bg-amber-500 hover:text-white"
                >
                  <ShieldCheck size={20} />
                  <div className="text-left">
                    <div className="text-sm font-bold">Approvals</div>
                    <div className="text-[10px] opacity-80">Manage permissions</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {!isNative && (
        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
              <Coins size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-500">About ERC20 Transfers</h4>
              <p className="mt-1 text-sm text-(--muted) leading-relaxed">
                Standard ERC20 transfers require a small amount of native gas ({chain?.nativeCurrency.symbol}) 
                to process. Multi-send distribution also requires an approval step before the contract 
                can distribute your tokens.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
