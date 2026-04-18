"use client";

import { Plus, Trash2 } from "lucide-react";

export interface RecipientRow {
  id: string;
  address: string;
  amount: string;
}

interface RecipientListProps {
  recipients: RecipientRow[];
  onChange: (recipients: RecipientRow[]) => void;
  tokenSymbol: string;
}

export default function RecipientList({
  recipients,
  onChange,
  tokenSymbol,
}: RecipientListProps) {
  const addRow = () => {
    onChange([
      ...recipients,
      { id: crypto.randomUUID(), address: "", amount: "" },
    ]);
  };

  const removeRow = (id: string) => {
    if (recipients.length <= 1) return;
    onChange(recipients.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: "address" | "amount", value: string) => {
    onChange(
      recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[var(--muted)]">
          Recipients ({recipients.length})
        </h4>
      </div>

      {/* Header labels */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_160px_40px] gap-2 text-xs font-medium text-[var(--muted)] px-1">
        <span>Address</span>
        <span>Amount ({tokenSymbol})</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {recipients.map((row, index) => (
          <div
            key={row.id}
            className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_160px_40px] sm:gap-2"
          >
            <input
              type="text"
              placeholder={`Recipient address ${index + 1} (0x...)`}
              value={row.address}
              onChange={(e) => updateRow(row.id, "address", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted)] transition-colors focus:border-blue-500/50"
            />
            <input
              type="text"
              placeholder="0.0"
              value={row.amount}
              onChange={(e) => updateRow(row.id, "amount", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted)] transition-colors focus:border-blue-500/50"
            />
            <button
              onClick={() => removeRow(row.id)}
              disabled={recipients.length <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-red-500/50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed self-end sm:self-auto"
              aria-label="Remove recipient"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] py-3 text-sm font-medium text-[var(--muted)] transition-all hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5"
      >
        <Plus size={16} />
        Add Recipient
      </button>
    </div>
  );
}
