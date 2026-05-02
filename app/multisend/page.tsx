"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { Plus, Send, AlertCircle, Wallet } from "lucide-react";
import { useConnection, useChainId } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import TokenGroup, { type TokenGroupData } from "@/components/send/TokenGroup";
import SendStepper from "@/components/send/SendStepper";
import ConnectButton from "@/components/wallet/ConnectButton";
import InfoBanner from "@/components/ui/InfoBanner";
import { MULTISENDER_ADDRESSES, NATIVE_CURRENCY } from "@/config/chains";
import type { MultiSendGroup } from "@/hooks/useMultiSend";

function createEmptyGroup(nativeSymbol: string = "ETH"): TokenGroupData {
  return {
    id: crypto.randomUUID(),
    isNative: true,
    tokenAddress: "",
    tokenSymbol: nativeSymbol,
    decimals: 18,
    recipients: [{ id: crypto.randomUUID(), address: "", amount: "" }],
  };
}

function MultiSendContent() {
  const { isConnected } = useConnection();
  const chainId = useChainId();
  const searchParams = useSearchParams();
  const contractAddress = MULTISENDER_ADDRESSES[chainId];
  const nativeCurrency = NATIVE_CURRENCY[chainId] ?? { symbol: "ETH", decimals: 18 };

  const [groups, setGroups] = useState<TokenGroupData[]>([createEmptyGroup(nativeCurrency.symbol)]);
  const [showStepper, setShowStepper] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Pre-fill from URL - only on initial load or if token param changes
  const initialTokenRef = useState(searchParams.get("token"))[0];
  useEffect(() => {
    const token = searchParams.get("token");
    if (token && token === initialTokenRef) {
      const isNative = token === "0x0000000000000000000000000000000000000000";
      Promise.resolve().then(() => {
        setGroups([{
          ...createEmptyGroup(nativeCurrency.symbol),
          isNative,
          tokenAddress: isNative ? "" : token,
        }]);
      });
    }
  }, [initialTokenRef, nativeCurrency.symbol, searchParams]); // nativeCurrency.symbol is still needed if chain changes

  const addGroup = useCallback(() => {
    setGroups((g) => [...g, createEmptyGroup(nativeCurrency.symbol)]);
  }, [nativeCurrency.symbol]);

  const removeGroup = useCallback((id: string) => {
    setGroups((g) => {
      if (g.length <= 1) return g;
      return g.filter((grp) => grp.id !== id);
    });
  }, []);

  const updateGroup = useCallback((id: string, updater: Partial<TokenGroupData> | ((prev: TokenGroupData) => Partial<TokenGroupData>)) => {
    setGroups((g) => g.map((grp) => {
      if (grp.id !== id) return grp;
      const updated = typeof updater === 'function' ? updater(grp) : updater;
      return { ...grp, ...updated };
    }));
  }, []);

  // Validation
  const validate = (): boolean => {
    const errors: string[] = [];

    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      errors.push("Sandwich contract is not deployed on this chain yet.");
    }

    groups.forEach((group, gi) => {
      const label = `Token Group #${gi + 1}`;

      if (!group.isNative && !isAddress(group.tokenAddress)) {
        errors.push(`${label}: Invalid ERC20 token address.`);
      }

      const validRecipients = group.recipients.filter(
        (r) => r.address.trim() || r.amount.trim()
      );

      if (validRecipients.length === 0) {
        errors.push(`${label}: Add at least one recipient.`);
      }

      validRecipients.forEach((r, ri) => {
        if (!isAddress(r.address)) {
          errors.push(`${label}, Recipient ${ri + 1}: Invalid address.`);
        }
        const amt = parseFloat(r.amount);
        if (isNaN(amt) || amt <= 0) {
          errors.push(`${label}, Recipient ${ri + 1}: Invalid amount.`);
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Build send data
  const buildSendData = useCallback((): {
    approvalSteps: { tokenAddress: `0x${string}`; tokenSymbol: string; requiredAmount: bigint }[];
    sendGroups: MultiSendGroup[];
  } => {
    const approvalSteps: { tokenAddress: `0x${string}`; tokenSymbol: string; requiredAmount: bigint }[] = [];
    const sendGroups: MultiSendGroup[] = [];

    groups.forEach((group) => {
      const decimals = group.decimals ?? (group.isNative ? nativeCurrency.decimals : 18);

      const receivers = group.recipients
        .filter((r) => r.address.trim() && r.amount.trim() && parseFloat(r.amount) > 0)
        .map((r) => ({
          receiver: r.address as `0x${string}`,
          amount: parseUnits(r.amount, decimals),
        }));

      if (receivers.length === 0) return;

      if (group.isNative) {
        sendGroups.push({
          tokenType: 0,
          token: "0x0000000000000000000000000000000000000000",
          receivers,
        });
      } else {
        const tokenAddr = group.tokenAddress as `0x${string}`;
        const totalAmount = receivers.reduce((sum, r) => sum + r.amount, 0n);

        approvalSteps.push({
          tokenAddress: tokenAddr,
          tokenSymbol: group.tokenSymbol || "ERC20",
          requiredAmount: totalAmount,
        });

        sendGroups.push({
          tokenType: 1,
          token: tokenAddr,
          receivers,
        });
      }
    });

    return { approvalSteps, sendGroups };
  }, [groups, nativeCurrency.decimals]);

  const handleReviewAndSend = () => {
    if (!validate()) {
      toast.error("Please fix the validation errors before proceeding.");
      return;
    }
    setShowStepper(true);
  };

  const { approvalSteps, sendGroups } = useMemo(() => buildSendData(), [buildSendData]);

  // Summary stats
  const totalRecipients = groups.reduce((s, g) => s + g.recipients.filter((r) => r.address.trim()).length, 0);
  const totalTokens = groups.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Multi</span> Send
        </h1>
        <p className="mt-2 text-sm sm:text-base text-(--muted)">
          Add tokens, configure recipients, and send everything in one transaction.
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-(--border) bg-(--card) p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Wallet size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Connect a wallet to start sending tokens to multiple addresses.
            </p>
          </div>
          <ConnectButton />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Token groups */}
          {groups.map((group, i) => (
            <TokenGroup
              key={group.id}
              group={group}
              index={i}
              totalGroups={groups.length}
              otherGroups={groups.filter((g) => g.id !== group.id)}
              chainId={chainId}
              onChange={(updated) => updateGroup(group.id, updated)}
              onRemove={() => removeGroup(group.id)}
            />
          ))}

          {/* Add token group */}
          <button
            onClick={addGroup}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-(--border) py-4 text-sm font-medium text-(--muted) transition-all hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5"
          >
            <Plus size={18} />
            Add Another Token
          </button>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
                <AlertCircle size={16} />
                Please fix the following errors:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                {validationErrors.map((err, i) => (
                  <li key={i} className="text-sm text-red-400">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary + Send button */}
          <div className="rounded-2xl border border-(--border) bg-(--card) p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-6 text-sm text-(--muted)">
                <span>
                  <strong className="text-(--foreground)">{totalTokens}</strong> token
                  {totalTokens !== 1 ? "s" : ""}
                </span>
                <span>
                  <strong className="text-(--foreground)">{totalRecipients}</strong> recipient
                  {totalRecipients !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={handleReviewAndSend}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send size={16} />
                Review & Send
              </button>
            </div>
          </div>

          {/* Security info */}
          <InfoBanner variant="security" title="Your funds are safe">
            The Sandwich contract is non-custodial — it forwards tokens directly to recipients
            in the same transaction. It never stores, holds, or locks your tokens. ERC20 approvals
            are requested for the exact required amount only.
          </InfoBanner>
        </div>
      )}

      {/* Stepper modal */}
      {showStepper && (
        <SendStepper
          approvalSteps={approvalSteps}
          sendGroups={sendGroups}
          onClose={() => setShowStepper(false)}
          onSuccess={() => {
            toast.success("All tokens sent successfully!");
          }}
        />
      )}
    </div>
  );
}

export default function MultiSendPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <MultiSendContent />
    </Suspense>
  );
}
