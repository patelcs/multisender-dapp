"use client";

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { MULTISENDER_ABI } from "@/config/abi";
import { MULTISENDER_ADDRESSES } from "@/config/chains";

export interface Receiver {
  receiver: `0x${string}`;
  amount: bigint;
}

export interface MultiSendGroup {
  tokenType: 0 | 1; // 0 = NATIVE, 1 = ERC20
  token: `0x${string}`;
  receivers: Receiver[];
}

/**
 * Hook to execute multi-send transactions.
 * Chooses the optimal contract function based on token groups:
 *   - Single native group → sendNativeTokens
 *   - Single ERC20 group → sendERC20Tokens
 *   - Multiple/mixed → send()
 */
export function useMultiSend() {
  const chainId = useChainId();
  const contractAddress = MULTISENDER_ADDRESSES[chainId];

  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const executeSend = (groups: MultiSendGroup[]) => {
    if (!contractAddress || groups.length === 0) return;

    // Calculate total native value
    const totalNativeValue = groups
      .filter((g) => g.tokenType === 0)
      .reduce(
        (sum, g) => sum + g.receivers.reduce((s, r) => s + r.amount, 0n),
        0n
      );

    // Optimization: if only one group, use specialized function
    if (groups.length === 1) {
      const group = groups[0];
      if (group.tokenType === 0) {
        // Single native send
        writeContract({
          address: contractAddress,
          abi: MULTISENDER_ABI,
          functionName: "sendNativeTokens",
          args: [group.receivers],
          value: totalNativeValue,
        });
        return;
      } else {
        // Single ERC20 send
        writeContract({
          address: contractAddress,
          abi: MULTISENDER_ABI,
          functionName: "sendERC20Tokens",
          args: [group.token, group.receivers],
        });
        return;
      }
    }

    // Multiple groups → use the master send() function
    writeContract({
      address: contractAddress,
      abi: MULTISENDER_ABI,
      functionName: "send",
      args: [groups],
      value: totalNativeValue,
    });
  };

  return {
    executeSend,
    txHash,
    isSending: isSending || isConfirming,
    isConfirmed,
    sendError,
  };
}
