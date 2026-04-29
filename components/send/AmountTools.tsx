"use client";

import { useState } from "react";
import { Calculator, Equal, TrendingUp, Percent, X } from "lucide-react";
import { type RecipientRow } from "./RecipientList";

interface AmountToolsProps {
  recipients: RecipientRow[];
  decimals: number;
  onChange: (recipients: RecipientRow[]) => void;
}

type ToolMode = "same" | "increment" | "formula" | "percentage" | null;

export default function AmountTools({ recipients, decimals, onChange }: AmountToolsProps) {
  const [mode, setMode] = useState<ToolMode>(null);
  const [sameValue, setSameValue] = useState("");
  const [startValue, setStartValue] = useState("");
  const [stepValue, setStepValue] = useState("");
  const [formula, setFormula] = useState("100 * (i + 1)");
  const [totalValue, setTotalValue] = useState("");

  const applyTool = () => {
    if (recipients.length === 0) return;

    let updated: RecipientRow[];

    switch (mode) {
      case "same":
        updated = recipients.map((r) => ({ ...r, amount: sameValue }));
        break;

      case "increment": {
        const start = parseFloat(startValue) || 0;
        const step = parseFloat(stepValue) || 0;
        updated = recipients.map((r, i) => ({
          ...r,
          amount: String(start + step * i),
        }));
        break;
      }

      case "formula": {
        try {
          updated = recipients.map((r, i) => {
            // Safe-ish eval with only 'i' and 'n' in scope
            const n = recipients.length;
            const result = Function("i", "n", `"use strict"; return (${formula})`)(i, n);
            return { ...r, amount: String(Number(result)) };
          });
        } catch {
          return; // Don't apply if formula is invalid
        }
        break;
      }

      case "percentage": {
        const total = parseFloat(totalValue) || 0;
        const each = total / recipients.length;
        updated = recipients.map((r) => ({
          ...r,
          amount: String(parseFloat(each.toFixed(decimals))),
        }));
        break;
      }

      default:
        return;
    }

    onChange(updated);
    setMode(null);
  };

  const tools = [
    { key: "same" as const, label: "Same", icon: Equal, desc: "Set identical amount for all" },
    { key: "increment" as const, label: "Increment", icon: TrendingUp, desc: "Start + step for each" },
    { key: "formula" as const, label: "Formula", icon: Calculator, desc: "Custom formula f(i)" },
    { key: "percentage" as const, label: "Equal Split", icon: Percent, desc: "Split total equally" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Amount Tools
      </p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => setMode(mode === tool.key ? null : tool.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              mode === tool.key
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-blue-500/20"
            }`}
            title={tool.desc}
          >
            <tool.icon size={12} />
            {tool.label}
          </button>
        ))}
      </div>

      {/* Tool input panel */}
      {mode && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-500">
              {tools.find((t) => t.key === mode)?.desc}
            </p>
            <button
              onClick={() => setMode(null)}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X size={14} />
            </button>
          </div>

          {mode === "same" && (
            <input
              type="text"
              placeholder="Amount for each recipient"
              value={sameValue}
              onChange={(e) => setSameValue(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            />
          )}

          {mode === "increment" && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Start value"
                value={startValue}
                onChange={(e) => setStartValue(e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Step (increment)"
                value={stepValue}
                onChange={(e) => setStepValue(e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              />
            </div>
          )}

          {mode === "formula" && (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="e.g. 100 * (i + 1)"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 font-mono text-sm"
              />
              <p className="text-xs text-[var(--muted)]">
                Variables: <code>i</code> (0-based index), <code>n</code> (total recipients)
              </p>
            </div>
          )}

          {mode === "percentage" && (
            <input
              type="text"
              placeholder="Total amount to split equally"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            />
          )}

          <button
            onClick={applyTool}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Apply to All Recipients
          </button>
        </div>
      )}
    </div>
  );
}
