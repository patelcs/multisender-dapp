"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Loader2, 
} from "lucide-react";
import { 
  useAccount, 
  useChainId, 
  useReadContract, 
  useWriteContract,
} from "wagmi";
import { isAddress, getAddress, formatUnits, parseUnits } from "viem";
import toast from "react-hot-toast";
import TokenSelector from "@/components/send/TokenSelector";
import AddressInput from "@/components/ui/AddressInput";
import { ERC20_ABI } from "@/config/abi";
import InfoBanner from "@/components/ui/InfoBanner";

export default function ApprovalsPage() {
  const { isConnected, address: userAddress } = useAccount();
  const chainId = useChainId();

  // State
  const [tokenAddress, setTokenAddress] = useState("");
  const [spenderAddress, setSpenderAddress] = useState("");
  const [newAllowance, setNewAllowance] = useState("");
  const [isNative, setIsNative] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
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

  const validToken = !isNative && isAddress(tokenAddress) ? getAddress(tokenAddress) : undefined;
  const validSpender = isAddress(spenderAddress) ? getAddress(spenderAddress) : undefined;

  // Read current allowance
  const { data: currentAllowance, refetch: refetchAllowance, isLoading: isAllowanceLoading } = useReadContract({
    address: validToken,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress && validSpender ? [userAddress, validSpender] : undefined,
    query: { enabled: !!userAddress && !!validToken && !!validSpender }
  });

  // Actions
  const { writeContractAsync } = useWriteContract();

  const handleUpdateAllowance = async () => {
    if (!validToken || !validSpender) {
      toast.error("Invalid token or spender address");
      return;
    }

    if (!newAllowance || isNaN(parseFloat(newAllowance)) || parseFloat(newAllowance) < 0) {
      toast.error("Invalid allowance amount");
      return;
    }

    const units = parseUnits(newAllowance, tokenInfo.decimals);
    setIsPending(true);
    const tid = toast.loading(`Updating allowance to ${newAllowance} ${tokenInfo.symbol}...`);

    try {
      await writeContractAsync({
        address: validToken,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [validSpender, units],
      });

      toast.success("Approval transaction sent!", { id: tid });
      setNewAllowance("");
      setTimeout(refetchAllowance, 5000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || err.message || "Approval failed", { id: tid });
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-xs">
              Connect a wallet to manage your token approvals and permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Approvals</span>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          View and modify token spending permissions for any contract or address.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 shadow-sm space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Token Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">Token</label>
              <TokenSelector
                isNative={isNative}
                hideNative={true}
                tokenAddress={tokenAddress}
                tokenSymbol={tokenInfo.symbol}
                decimals={tokenInfo.decimals}
                balance={tokenInfo.balance}
                chainId={chainId}
                onToggleNative={() => {}} // Always ERC20 for approvals
                onAddressChange={setTokenAddress}
                onInfoChange={(info) => setTokenInfo(info)}
                onPickToken={(t) => {
                  setTokenAddress(t.address);
                  setIsNative(false);
                }}
              />
            </div>

            {/* Spender Input with Auto-suggest */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">
                Spender Address
              </label>
              <AddressInput
                value={spenderAddress}
                onChange={setSpenderAddress}
                placeholder="0x..."
              />
            </div>
          </div>

          {/* Current Allowance Display */}
          {validToken && validSpender && (
            <div className="rounded-xl bg-[var(--accent)] p-4 border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Current Allowance</div>
                  {isAllowanceLoading ? (
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                  ) : currentAllowance !== undefined ? (
                    <div className="text-lg font-bold text-[var(--foreground)]">
                      {Number(formatUnits(currentAllowance, tokenInfo.decimals)).toLocaleString()} {tokenInfo.symbol}
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">Error fetching allowance</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Your Balance</div>
                  <div className="text-sm font-bold opacity-80 text-blue-500">
                    {tokenInfo.balance !== undefined 
                      ? `${Number(formatUnits(tokenInfo.balance, tokenInfo.decimals)).toLocaleString()} ${tokenInfo.symbol}`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Section */}
          {validToken && validSpender && (
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">Set New Allowance</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={newAllowance}
                    onChange={(e) => setNewAllowance(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm font-bold focus:border-blue-500/50 outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setNewAllowance("0")}
                      className="px-2 py-1 text-[10px] font-bold bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20"
                    >
                      Revoke
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewAllowance(formatUnits(2n**256n - 1n, tokenInfo.decimals))}
                      className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-500 rounded-md hover:bg-green-500/20"
                    >
                      Infinite
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdateAllowance}
                disabled={isPending || !newAllowance}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ShieldCheck size={18} />
                )}
                Update Permission
              </button>
            </div>
          )}
        </div>

        <InfoBanner variant="security" title="Safe Approvals">
          <p>
            Approvals allow a smart contract or address to spend tokens on your behalf. 
            Only approve addresses you trust. You can set a specific amount, or 
            &quot;Infinite&quot; (max uint256) for convenience, or &quot;Revoke&quot; (0) to cancel access.
          </p>
        </InfoBanner>
      </div>
    </div>
  );
}
