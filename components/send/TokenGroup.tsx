"use client";

import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Copy } from "lucide-react";
import TokenSelector from "./TokenSelector";
import RecipientList, { type RecipientRow } from "./RecipientList";
import AmountTools from "./AmountTools";

export interface TokenGroupData {
  id: string;
  isNative: boolean;
  tokenAddress: string;
  recipients: RecipientRow[];
}

interface TokenGroupProps {
  group: TokenGroupData;
  index: number;
  totalGroups: number;
  otherGroups: TokenGroupData[];
  onChange: (updated: TokenGroupData) => void;
  onRemove: () => void;
}

export default function TokenGroup({
  group,
  index,
  totalGroups,
  otherGroups,
  onChange,
  onRemove,
}: TokenGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const tokenSymbol = group.isNative ? "ETH" : "Token";

  const updateField = <K extends keyof TokenGroupData>(
    field: K,
    value: TokenGroupData[K]
  ) => {
    onChange({ ...group, [field]: value });
  };

  const importFromGroup = (sourceGroup: TokenGroupData, includeAmounts: boolean) => {
    const imported: RecipientRow[] = sourceGroup.recipients.map((r) => ({
      id: crypto.randomUUID(),
      address: r.address,
      amount: includeAmounts ? r.amount : "",
    }));
    updateField("recipients", imported);
    setShowImport(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--accent)] px-5 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]"
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          Token Group #{index + 1}
          {group.isNative ? (
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
              ETH
            </span>
          ) : group.tokenAddress ? (
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-500">
              ERC20
            </span>
          ) : null}
          <span className="text-xs font-normal text-[var(--muted)]">
            ({group.recipients.length} recipients)
          </span>
        </button>
        <div className="flex items-center gap-2">
          {totalGroups > 1 && (
            <button
              onClick={onRemove}
              className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:text-red-500 hover:bg-red-500/10"
              aria-label="Remove token group"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="space-y-6 p-5">
          {/* Token selection */}
          <TokenSelector
            isNative={group.isNative}
            tokenAddress={group.tokenAddress}
            onToggleNative={(isNative) => updateField("isNative", isNative)}
            onAddressChange={(addr) => updateField("tokenAddress", addr)}
          />

          {/* Import from other group */}
          {otherGroups.length > 0 && (
            <div>
              <button
                onClick={() => setShowImport(!showImport)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-500 transition-colors hover:text-blue-400"
              >
                <Copy size={12} />
                Import recipients from another token group
              </button>
              {showImport && (
                <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2">
                  {otherGroups.map((og, ogIdx) => (
                    <div key={og.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-[var(--accent)] p-3">
                      <span className="text-sm text-[var(--foreground)]">
                        Group #{otherGroups.indexOf(og) + 1}{" "}
                        ({og.recipients.length} recipients)
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => importFromGroup(og, true)}
                          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50"
                        >
                          With Amounts
                        </button>
                        <button
                          onClick={() => importFromGroup(og, false)}
                          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50"
                        >
                          Addresses Only
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recipient list */}
          <RecipientList
            recipients={group.recipients}
            onChange={(r) => updateField("recipients", r)}
            tokenSymbol={tokenSymbol}
          />

          {/* Amount tools */}
          <AmountTools
            recipients={group.recipients}
            onChange={(r) => updateField("recipients", r)}
          />
        </div>
      )}
    </div>
  );
}
