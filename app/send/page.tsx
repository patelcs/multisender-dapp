"use client";

import { useState, useEffect, Suspense } from "react";
import { Send, Wallet, Loader2 } from "lucide-react";
import { useConnection, useChainId, useSendTransaction, useWriteContract } from "wagmi";
import { parseUnits, isAddress, getAddress, formatUnits } from "viem";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import TokenSelector from "@/components/send/TokenSelector";
import AddressInput from "@/components/ui/AddressInput";
import { ERC20_ABI } from "@/config/abi";
import InfoBanner from "@/components/ui/InfoBanner";

function SingleSendContent() {
  const { isConnected } = useConnection();
  const chainId = useChainId();
  const searchParams = useSearchParams();

  // Form State
  const [tokenAddress, setTokenAddress] = useState("");
  const [isNative, setIsNative] = useState<boolean>(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  
  // Pre-fill from URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      const isTokenNative = token === "0x0000000000000000000000000000000000000000";
      Promise.resolve().then(() => {
        setIsNative(isTokenNative);
        setTokenAddress(isTokenNative ? "" : token);
      });
    }
  }, [searchParams]);

  // Token Info State
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    balance?: bigint;
  }>({
    name: "",
    symbol: "",
    decimals: 18,
  });

  // Actions
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const handleSend = async () => {
    if (!isConnected) {
      toast.error("Connect your wallet first");
      return;
    }

    if (!isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }

    const units = parseUnits(amount, tokenInfo.decimals);
    
    if (tokenInfo.balance !== undefined && units > tokenInfo.balance) {
      toast.error(`Insufficient ${tokenInfo.symbol} balance`);
      return;
    }

    setIsPending(true);
    const tid = toast.loading(`Sending ${amount} ${tokenInfo.symbol}...`);

    try {
      if (isNative) {
        await sendTransactionAsync({
          to: recipient as `0x${string}`,
          value: units,
        });
      } else {
        await writeContractAsync({
          address: getAddress(tokenAddress),
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipient as `0x${string}`, units],
        });
      }

      toast.success("Transaction sent!", { id: tid });
      setAmount("");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? (err as { shortMessage?: string }).shortMessage || err.message : "Transaction failed";
      toast.error(errorMessage, { id: tid });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Send</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-(--muted)">
          Quickly transfer tokens to another address using the standard token contract.
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Wallet size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-sm text-(--muted) max-w-xs">
              Connect a wallet to start sending tokens securely across any network.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-sm space-y-6">
            {/* Token Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Select Asset</label>
              <TokenSelector
                isNative={isNative}
                tokenAddress={tokenAddress}
                tokenSymbol={tokenInfo.symbol}
                decimals={tokenInfo.decimals}
                balance={tokenInfo.balance}
                chainId={chainId}
                onToggleNative={(val) => {
                  setIsNative(val);
                  if (val) setTokenAddress("");
                  setTokenInfo({ name: "", symbol: "", decimals: 18 });
                }}
                onAddressChange={setTokenAddress}
                onInfoChange={(info) => setTokenInfo(info)}
                onPickToken={(t) => {
                  setTokenAddress(t.address);
                  setIsNative(false);
                }}
              />
            </div>

            {/* Recipient Input with Auto-suggest */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">
                Recipient Address
              </label>
              <AddressInput
                value={recipient}
                onChange={setRecipient}
                placeholder="0x..."
                chainId={chainId}
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted)">Amount</label>
                {tokenInfo.symbol && tokenInfo.balance !== undefined && (
                  <button 
                    onClick={() => setAmount(formatUnits(tokenInfo.balance!, tokenInfo.decimals))}
                    className="text-[10px] font-bold text-blue-500 hover:underline"
                  >
                    Max: {Number(formatUnits(tokenInfo.balance!, tokenInfo.decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-(--border) bg-(--input-bg) px-4 py-3.5 text-lg font-bold transition-colors focus:border-blue-500/50 outline-none pr-20"
                />
                {tokenInfo.symbol && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-(--muted) text-sm">
                    {tokenInfo.symbol}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSend}
              disabled={isPending || !recipient || !amount || !tokenInfo.symbol}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send {tokenInfo.symbol || "Asset"}
                </>
              )}
            </button>
          </div>

          <InfoBanner variant="info" title="Direct Transfer">
            This feature performs a direct <code>transfer()</code> call on the token contract. 
            It does not use the Sandwich multi-send contract, making it perfect for simple one-to-one transfers.
          </InfoBanner>
        </div>
      )}
    </div>
  );
}

export default function SingleSendPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <SingleSendContent />
    </Suspense>
  );
}
