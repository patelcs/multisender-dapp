"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC20_ABI } from "@/config/abi";
import { MULTISENDER_ADDRESSES } from "@/config/chains";
import { useChainId, useConnection } from "wagmi";

/**
 * Hook to check and request ERC20 approval for the Sandwich contract.
 */
export function useTokenApproval(
  tokenAddress: `0x${string}` | undefined,
  requiredAmount: bigint
) {
  const chainId = useChainId();
  const { address: userAddress } = useConnection();
  const spender = MULTISENDER_ADDRESSES[chainId];

  const enabled =
    !!tokenAddress &&
    tokenAddress !== "0x0000000000000000000000000000000000000000" &&
    !!userAddress &&
    !!spender;

  // Read current allowance
  const {
    data: currentAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress && spender ? [userAddress, spender] : undefined,
    query: { enabled },
  });

  // Write approve
  const {
    writeContract: approve,
    data: approveTxHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();

  // Wait for approve tx
  const { isLoading: isWaitingForApproval, isSuccess: approvalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveTxHash,
    });

  const allowance = (currentAllowance as bigint) ?? 0n;
  const needsApproval = enabled && allowance < requiredAmount;

  const requestApproval = (amount?: bigint) => {
    if (!tokenAddress || !spender) return;
    approve({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender, amount ?? requiredAmount],
    });
  };

  return {
    allowance,
    needsApproval,
    requestApproval,
    refetchAllowance,
    isApproving: isApproving || isWaitingForApproval,
    approvalConfirmed,
    approveError,
  };
}
