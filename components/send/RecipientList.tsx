"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, FileText, X } from "lucide-react";
import AddressInput from "@/components/ui/AddressInput";
import toast from "react-hot-toast";

export interface RecipientRow {
  id: string;
  address: string;
  amount: string;
}

interface RecipientListProps {
  recipients: RecipientRow[];
  onChange: (updater: RecipientRow[] | ((prev: RecipientRow[]) => RecipientRow[])) => void;
  tokenSymbol: string;
  chainId?: number;
}

export default function RecipientList({
  recipients,
  onChange,
  tokenSymbol,
  chainId,
}: RecipientListProps) {
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const addRow = useCallback(() => {
    onChange((prev) => [
      ...prev,
      { id: crypto.randomUUID(), address: "", amount: "" },
    ]);
  }, [onChange]);

  const removeRow = (id: string) => {
    onChange((prev) => {
      if (prev.length <= 1) {
        return [{ id: prev[0].id, address: "", amount: "" }];
      }
      return prev.filter((r) => r.id !== id);
    });
  };

  const handleBulkPaste = useCallback((text: string, currentId?: string) => {
    const lines = text.split(/[\n,;]+/).map(l => l.trim()).filter(l => l);
    
    if (lines.length === 0) return false;

    // If it's just one line and it has no spaces (except trailing), 
    // it's not really a bulk paste, it's just a single address.
    if (lines.length === 1 && !lines[0].includes(" ") && !lines[0].includes("\t")) {
      return false;
    }

    const newRecipients: RecipientRow[] = [];
    lines.forEach(line => {
      const parts = line.split(/[\s\t]+/).filter(p => p);
      if (parts.length > 0) {
        newRecipients.push({
          id: crypto.randomUUID(),
          address: parts[0],
          amount: parts.length > 1 ? parts[1] : ""
        });
      }
    });

    if (newRecipients.length > 0) {
      onChange((prev) => {
        const isFirstRowEmpty = prev.length === 1 && !prev[0].address && !prev[0].amount;
        
        if (currentId) {
          // If we are pasting into a specific row, replace that row and append others after it
          const index = prev.findIndex(r => r.id === currentId);
          if (index !== -1) {
            const result = [...prev];
            result.splice(index, 1, ...newRecipients);
            return result;
          }
        }

        if (isFirstRowEmpty) {
          return newRecipients;
        }
        
        return [...prev, ...newRecipients];
      });
      toast.success(`Added ${newRecipients.length} recipients`);
      return true;
    }
    return false;
  }, [onChange]);

  const updateRow = (id: string, field: "address" | "amount", value: string) => {
    // Only trigger bulk paste if there's a delimiter that strongly suggests multiple entries
    if (field === "address" && (value.includes(",") || value.includes("\n") || value.includes("\t") || value.includes(" "))) {
      if (handleBulkPaste(value, id)) return;
    }

    onChange((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const applyBulk = () => {
    handleBulkPaste(bulkText);
    setBulkText("");
    setShowBulk(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-(--muted)">
          Recipients ({recipients.length})
        </h4>
        {/* <button
          onClick={() => setShowBulk(!showBulk)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-500 transition-colors hover:text-blue-400"
        >
          {showBulk ? <X size={12} /> : <FileText size={12} />}
          {showBulk ? "Cancel Bulk Add" : "Bulk Add / CSV"}
        </button> */}
      </div>

      {showBulk && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-(--muted)">
            Paste a list of addresses, one per line. You can also include amounts separated by a space or comma.
            <br />
            <code className="mt-1 block bg-(--accent) p-1 rounded">0xAddress1 1.5<br />0xAddress2, 2.0</code>
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="0x...&#10;0x... 1.2"
            rows={5}
            className="w-full rounded-lg border border-(--border) bg-(--input-bg) p-3 font-mono text-sm outline-none focus:border-blue-500/50"
          />
          <button
            onClick={applyBulk}
            disabled={!bulkText.trim()}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            Add Recipients
          </button>
        </div>
      )}

      {/* Header labels */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_160px_40px] gap-2 text-xs font-medium text-(--muted) px-1">
        <span>Address</span>
        <span>Amount ({tokenSymbol})</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="space-y-4 sm:space-y-2">
        {recipients.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_160px_40px] sm:gap-2 border-b border-(--border) pb-4 sm:border-none sm:pb-0"
          >
            <div className="space-y-1 sm:space-y-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) sm:hidden">Address</label>
              <AddressInput
                value={row.address}
                onChange={(val) => updateRow(row.id, "address", val)}
                placeholder={`Recipient address (0x...)`}
                className="!w-full"
                chainId={chainId}
              />
            </div>
            <div className="space-y-1 sm:space-y-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) sm:hidden">Amount ({tokenSymbol})</label>
              <input
                type="text"
                placeholder="0.0"
                value={row.amount}
                onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                className="w-full rounded-xl border border-(--border) bg-(--input-bg) px-3 py-2.5 text-sm text-(--foreground) placeholder-(--muted) transition-colors focus:border-blue-500/50"
              />
            </div>
            <div className="flex justify-end sm:block">
              <button
                onClick={() => removeRow(row.id)}
                disabled={recipients.length <= 1 && !recipients[0].address && !recipients[0].amount}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-(--border) text-(--muted) transition-colors hover:border-red-500/50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Remove recipient"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--border) py-3 text-sm font-medium text-(--muted) transition-all hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5"
      >
        <Plus size={16} />
        Add Recipient
      </button>
    </div>
  );
}
