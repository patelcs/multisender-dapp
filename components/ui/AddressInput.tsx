"use client";

import { useState, useRef, useEffect } from "react";
import { BookUser, Star } from "lucide-react";
import { useAddressBook } from "@/hooks/useAddressBook";

interface AddressInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
}

/** 
 * Reusable autocomplete dropdown for address book matches 
 * Used in MultiSend, Single Send, and Approval Manager.
 */
export default function AddressInput({
  value,
  onChange,
  placeholder,
  className = "",
}: AddressInputProps) {
  const { search, isAddressSaved, getLabel, add } = useAddressBook();
  const [focused, setFocused] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const matches = focused ? search(value) : [];
  const savedLabel = getLabel(value);
  const canSave =
    value.startsWith("0x") && value.length === 42 && !isAddressSaved(value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
        setShowSave(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSave = () => {
    if (!saveLabel.trim()) return;
    add(saveLabel.trim(), value, "global");
    setSaveLabel("");
    setShowSave(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)] transition-colors focus:border-blue-500/50 outline-none"
        />
        {/* Saved name label */}
        {savedLabel && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">
            {savedLabel}
          </span>
        )}
        {/* Save to address book button */}
        {canSave && !savedLabel && !showSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowSave(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
            title="Save to address book"
          >
            <Star size={14} />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {focused && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          {matches.map((entry) => (
            <button
              key={entry.id}
              onClick={() => {
                onChange(entry.address);
                setFocused(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--accent)]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <BookUser size={14} />
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate">{entry.label}</div>
                <div className="text-[10px] font-mono text-[var(--muted)] truncate">{entry.address}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Inline save form */}
      {showSave && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 flex gap-2 rounded-xl border border-blue-500/20 bg-[var(--card)] p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <input
            type="text"
            placeholder="Name this address..."
            value={saveLabel}
            onChange={(e) => setSaveLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-xs outline-none focus:border-blue-500/30"
          />
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => setShowSave(false)}
            className="rounded-lg border border-[var(--border)] px-2 py-2 text-xs text-[var(--muted)]"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
