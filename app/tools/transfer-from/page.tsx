"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, parseUnits, formatUnits } from "viem";
import TokenSelector from "@/components/send/TokenSelector";
import AddressInput from "@/components/ui/AddressInput";
import toast from "react-hot-toast";

export default function TransferFromPage() {
  const { address: connectedAddress, isConnected, chainId } = useAccount();
  const [tokenAddress, setTokenAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    balance?: bigint;
  } | null>(null);

  const { data: allowance, isLoading: isAllowanceLoading, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: ownerAddress && connectedAddress ? [ownerAddress as `0x${string}`, connectedAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenAddress && ownerAddress && connectedAddress && tokenAddress.length === 42 && ownerAddress.length === 42),
    }
  });

  const { data: ownerBalance, isLoading: isOwnerBalanceLoading, refetch: refetchOwnerBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: ownerAddress ? [ownerAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenAddress && ownerAddress && tokenAddress.length === 42 && ownerAddress.length === 42),
    }
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isWaitingForTx, isSuccess } = useWaitForTransactionReceipt({ hash });

  const formattedAllowance = useMemo(() => {
    if (allowance === undefined || !tokenInfo) return "0";
    return formatUnits(allowance, tokenInfo.decimals);
  }, [allowance, tokenInfo]);

  const formattedOwnerBalance = useMemo(() => {
    if (ownerBalance === undefined || !tokenInfo) return "0";
    return formatUnits(ownerBalance, tokenInfo.decimals);
  }, [ownerBalance, tokenInfo]);

  const handleTransfer = async () => {
    if (!tokenAddress || !ownerAddress || !recipientAddress || !amount || !tokenInfo) return;
    
    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);
      
      if (allowance !== undefined && parsedAmount > allowance) {
        toast.error("Amount exceeds approved allowance");
        return;
      }

      if (ownerBalance !== undefined && parsedAmount > ownerBalance) {
        toast.error("Amount exceeds owner balance");
        return;
      }

      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "transferFrom",
        args: [ownerAddress as `0x${string}`, recipientAddress as `0x${string}`, parsedAmount],
      });
    } catch {
      toast.error("Failed to initiate transfer");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Transfer completed successfully!");
      refetchAllowance();
      refetchOwnerBalance();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount("");
    }
  }, [isSuccess, refetchAllowance, refetchOwnerBalance]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Transfer <span className="gradient-text">From</span>
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-(--muted) max-w-2xl">
          Execute transactions on behalf of another wallet if you have an active ERC20 allowance.
        </p>
      </div>

      {!isConnected ? (
        <div className="rounded-3xl border border-(--border) bg-(--card) p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="mt-4 text-(--muted)">
            You must be connected to check allowances and execute transfers.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-(--border) bg-(--card) p-8 shadow-sm">
              <div className="space-y-6">
                {/* Token Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-(--muted) pl-1">Token to Transfer</label>
                  <TokenSelector
                    hideNative
                    isNative={false}
                    tokenAddress={tokenAddress}
                    tokenSymbol={tokenInfo?.symbol}
                    decimals={tokenInfo?.decimals}
                    chainId={chainId}
                    onToggleNative={() => {}}
                    onAddressChange={setTokenAddress}
                    onInfoChange={setTokenInfo}
                    onPickToken={(t) => {
                      setTokenAddress(t.address);
                      setTokenInfo({ name: t.name, symbol: t.symbol, decimals: t.decimals });
                    }}
                  />
                </div>

                <div className="space-y-6">
                  {/* Owner Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-(--muted) pl-1">Token Owner Address</label>
                    <AddressInput
                      value={ownerAddress}
                      onChange={setOwnerAddress}
                      placeholder="0x... (Wallet that approved you)"
                      chainId={chainId}
                    />
                  </div>

                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-(--muted)">Recipient Address</label>
                      {isConnected && connectedAddress && recipientAddress.toLowerCase() !== connectedAddress.toLowerCase() && (
                        <button 
                          type="button"
                          onClick={() => setRecipientAddress(connectedAddress)}
                          className="text-[10px] font-bold text-blue-500 hover:underline"
                        >
                          Use My Wallet
                        </button>
                      )}
                    </div>
                    <AddressInput
                      value={recipientAddress}
                      onChange={setRecipientAddress}
                      placeholder="0x... (Where to send tokens)"
                      chainId={chainId}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-(--muted)">Amount to Transfer</label>
                    {allowance !== undefined && tokenInfo && (
                      <button 
                        onClick={() => setAmount(formattedAllowance)}
                        className="text-[10px] font-bold text-blue-500 hover:underline"
                      >
                        Max Approved: {Number(formattedAllowance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {tokenInfo.symbol}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full rounded-xl border border-(--border) bg-(--input-bg) px-4 py-3 font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                    />
                    {tokenInfo && (
                      <button 
                        onClick={() => setAmount(formattedAllowance)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-500 hover:bg-blue-500/10 px-2 py-1 rounded transition-colors"
                      >
                        USE MAX
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={!tokenAddress || !ownerAddress || !recipientAddress || !amount || isPending || isWaitingForTx || !allowance || allowance === 0n}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending || isWaitingForTx ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {isPending ? "Confirming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft size={18} />
                      Execute transferFrom
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-(--border) bg-(--accent)/50 p-6 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-(--muted)">Allowance Status</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-(--muted) uppercase block mb-1">Approved for You</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black ${allowance && allowance > 0n ? 'text-green-500' : 'text-(--muted)'}`}>
                      {isAllowanceLoading ? "..." : Number(formattedAllowance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                    <span className="text-xs font-bold opacity-60">{tokenInfo?.symbol || "Tokens"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-(--muted) uppercase block mb-1">Owner Balance</span>
                  <div className="flex items-center gap-2">
                    <Wallet size={12} className="text-blue-500" />
                    <span className="text-sm font-bold">
                      {isOwnerBalanceLoading ? "..." : Number(formattedOwnerBalance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                  </div>
                </div>
              </div>

              {allowance === 0n && ownerAddress && tokenAddress && !isAllowanceLoading && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                    No allowance found. The owner must first grant you permission via the standard ERC20 Approve function.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-(--border) bg-(--card) p-6">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-blue-500" />
                Security
              </h3>
              <p className="text-[11px] text-(--muted) leading-relaxed">
                The <code>transferFrom</code> function allows you to move funds from another wallet that has 
                specifically granted you a &quot;Spending Allowance&quot;. This is a standard ERC20 mechanism 
                used by decentralised protocols.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
