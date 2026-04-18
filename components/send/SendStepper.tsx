"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Circle,
  Loader2,
  X,
  Shield,
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
  const {
    needsApproval,
    requestApproval,
    isApproving,
    approvalConfirmed,
    refetchAllowance,
    approveError,
  } = useTokenApproval(step.tokenAddress, step.requiredAmount);

  useEffect(() => {
    if (approvalConfirmed) {
      refetchAllowance();
      onComplete();
    }
  }, [approvalConfirmed, onComplete, refetchAllowance]);

  // Already approved
  if (!needsApproval && isActive) {
    // Auto-complete if already approved
    setTimeout(onComplete, 500);
  }

  const isDone = !needsApproval || approvalConfirmed;

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
              : "Approval required for the exact send amount"}
          </p>
        </div>
        {isActive && !isDone && !isApproving && (
          <button
            onClick={requestApproval}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Approve
          </button>
        )}
      </div>
      {approveError && (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {(approveError as Error).message?.slice(0, 100) ?? "Approval failed"}
        </p>
      )}
      {isActive && !isDone && (
        <div className="mt-3">
          <InfoBanner variant="security">
            You are approving the MultiSender contract to transfer <strong>only the exact amount</strong> needed
            for this send. The contract is non-custodial and cannot access any other tokens or amounts.
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
  const [approvalsComplete, setApprovalsComplete] = useState(false);
  const chainId = useChainId();
  const explorer = EXPLORER_URLS[chainId];

  const { executeSend, txHash, isSending, isConfirmed, sendError } =
    useMultiSend();

  const totalSteps = approvalSteps.length + 1; // approvals + final send

  const handleApprovalComplete = useCallback(() => {
    if (currentStep < approvalSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setApprovalsComplete(true);
      setCurrentStep(approvalSteps.length);
    }
  }, [currentStep, approvalSteps.length]);

  useEffect(() => {
    if (approvalSteps.length === 0) {
      setApprovalsComplete(true);
      setCurrentStep(0);
    }
  }, [approvalSteps.length]);

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
              key={step.tokenAddress}
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
                  The MultiSender contract is <strong>non-custodial</strong> — it forwards tokens
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
