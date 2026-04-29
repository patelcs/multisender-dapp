"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle,
  Circle,
  Loader2,
  X,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useTokenApproval } from "@/hooks/useTokenApproval";
import { useMultiSend, type MultiSendGroup } from "@/hooks/useMultiSend";
import { useChainId } from "wagmi";
import { EXPLORER_URLS } from "@/config/chains";
import InfoBanner from "@/components/ui/InfoBanner";

interface ApprovalStep {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  requiredAmount: bigint;
}

interface SendStepperProps {
  approvalSteps: ApprovalStep[];
  sendGroups: MultiSendGroup[];
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

/** Individual approval step component */
function ApprovalStepCard({
  step,
  isActive,
  onComplete,
}: {
  step: ApprovalStep;
  isActive: boolean;
  onComplete: () => void;
}) {
  const [approvalType, setApprovalType] = useState<"exact" | "max">("exact");
  const hasCompleted = useRef(false);

  const {
    needsApproval,
    requestApproval,
    isApproving,
    approvalConfirmed,
    refetchAllowance,
    approveError,
  } = useTokenApproval(step.tokenAddress, step.requiredAmount);

  // Handle successful approval
  useEffect(() => {
    if (approvalConfirmed && !hasCompleted.current) {
      hasCompleted.current = true;
      refetchAllowance();
      onComplete();
    }
  }, [approvalConfirmed, onComplete, refetchAllowance]);

  // Handle auto-complete if already approved
  useEffect(() => {
    if (!needsApproval && isActive && !hasCompleted.current) {
      hasCompleted.current = true;
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [needsApproval, isActive, onComplete]);

  const isDone = !needsApproval || approvalConfirmed;

  const handleApprove = () => {
    requestApproval(approvalType === "max" ? MAX_UINT256 : step.requiredAmount);
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isDone
          ? "border-green-500/30 bg-green-500/5"
          : isActive
          ? "border-blue-500/30 bg-blue-500/5"
          : "border-[var(--border)] bg-[var(--card)] opacity-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {isDone ? (
          <CheckCircle size={20} className="shrink-0 text-green-500" />
        ) : isApproving ? (
          <Loader2 size={20} className="shrink-0 animate-spin text-blue-500" />
        ) : (
          <Circle size={20} className="shrink-0 text-[var(--muted)]" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">
            Approve {step.tokenSymbol}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {isDone
              ? "Approval confirmed ✓"
              : isApproving
              ? "Waiting for approval confirmation..."
              : "Choose approval amount and confirm"}
          </p>
        </div>
        {isActive && !isDone && !isApproving && (
          <button
            onClick={handleApprove}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Approve
          </button>
        )}
      </div>

      {isActive && !isDone && !isApproving && (
        <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted)]">Approval Type:</span>
            <div className="flex gap-1 rounded-lg bg-[var(--accent)] p-1">
              <button
                onClick={() => setApprovalType("exact")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  approvalType === "exact"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Exact Amount
              </button>
              <button
                onClick={() => setApprovalType("max")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  approvalType === "max"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Infinite (Max)
              </button>
            </div>
          </div>
          
          <p className="text-[10px] leading-relaxed text-[var(--muted)]">
            {approvalType === "exact" 
              ? "Approves only the amount required for this transaction. More secure but requires a new approval next time."
              : "Approves a very large amount. You won't have to approve this token again for future transactions, saving gas and time."}
          </p>
        </div>
      )}

      {approveError && (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {(approveError as Error).message?.slice(0, 100) ?? "Approval failed"}
        </p>
      )}
      
      {isActive && !isDone && (
        <div className="mt-3">
          <InfoBanner variant="security">
            The SandWitch contract is <strong>non-custodial</strong>. 
            {approvalType === "exact" 
              ? " You are approving only the minimum required amount." 
              : " Approving 'Max' is safe as the contract can only transfer tokens when you explicitly call the send function."}
          </InfoBanner>
        </div>
      )}
    </div>
  );
}

export default function SendStepper({
  approvalSteps,
  sendGroups,
  onClose,
  onSuccess,
}: SendStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const chainId = useChainId();
  const explorer = EXPLORER_URLS[chainId];

  const { executeSend, txHash, isSending, isConfirmed, sendError } =
    useMultiSend();

  const totalSteps = approvalSteps.length + 1; // approvals + final send
  const approvalsComplete = approvalSteps.length === 0 || currentStep >= approvalSteps.length;

  const handleApprovalComplete = useCallback(() => {
    setCurrentStep((s) => s + 1);
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  const handleSend = () => {
    executeSend(sendGroups);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              Review & Send
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 p-6">
          {/* Approval steps */}
          {approvalSteps.map((step, i) => (
            <ApprovalStepCard
              key={`${step.tokenAddress}-${i}`}
              step={step}
              isActive={currentStep === i}
              onComplete={handleApprovalComplete}
            />
          ))}

          {/* Final send step */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              isConfirmed
                ? "border-green-500/30 bg-green-500/5"
                : approvalsComplete || approvalSteps.length === 0
                ? "border-blue-500/30 bg-blue-500/5"
                : "border-[var(--border)] bg-[var(--card)] opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {isConfirmed ? (
                <CheckCircle size={20} className="shrink-0 text-green-500" />
              ) : isSending ? (
                <Loader2 size={20} className="shrink-0 animate-spin text-blue-500" />
              ) : (
                <Circle size={20} className="shrink-0 text-[var(--muted)]" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">Execute Multi-Send</p>
                <p className="text-xs text-[var(--muted)]">
                  {isConfirmed
                    ? "Transaction confirmed! ✓"
                    : isSending
                    ? "Waiting for transaction confirmation..."
                    : "Send all tokens to all recipients"}
                </p>
              </div>
              {(approvalsComplete || approvalSteps.length === 0) &&
                !isSending &&
                !isConfirmed && (
                  <button
                    onClick={handleSend}
                    className="shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 active:scale-[0.98]"
                  >
                    Send
                  </button>
                )}
            </div>

            {sendError && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} />
                {(sendError as Error).message?.slice(0, 150) ?? "Transaction failed"}
              </p>
            )}

            {txHash && (
              <div className="mt-3">
                <a
                  href={`${explorer}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:underline"
                >
                  <ExternalLink size={13} />
                  View on Explorer
                </a>
              </div>
            )}

            {(approvalsComplete || approvalSteps.length === 0) && !isConfirmed && (
              <div className="mt-3">
                <InfoBanner variant="info">
                  The SandWitch contract is <strong>non-custodial</strong> — it forwards tokens
                  directly to recipients and cannot store your funds. Any excess ETH is automatically refunded.
                </InfoBanner>
              </div>
            )}
          </div>
        </div>

        {/* Success banner */}
        {isConfirmed && (
          <div className="border-t border-[var(--border)] px-6 py-4">
            <div className="rounded-xl bg-green-500/10 p-4 text-center">
              <p className="text-sm font-semibold text-green-500">
                🎉 All tokens sent successfully!
              </p>
              <button
                onClick={onClose}
                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
