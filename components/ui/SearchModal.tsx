"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Loader2, Plus } from "lucide-react";

interface SearchModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  searchFields: (item: T) => string[];
  renderItem: (item: T, onSelect: () => void) => React.ReactNode;
  onSelect: (item: T) => void;
  onCustomInput?: (value: string) => void;
  renderFilter?: () => React.ReactNode;
  placeholder?: string;
  isLoading?: boolean;
}

export default function SearchModal<T>({
  isOpen,
  onClose,
  title,
  items,
  searchFields,
  renderItem,
  onSelect,
  onCustomInput,
  renderFilter,
  placeholder = "Search...",
  isLoading = false,
}: SearchModalProps<T>) {
  const [query, setQuery] = useState("");

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) =>
      searchFields(item).some((field) => field?.toLowerCase().includes(q))
    );
  }, [items, query, searchFields]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-(--border) bg-(--card) shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border) px-6 py-4">
          <h2 className="text-lg font-bold text-(--foreground)">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-(--muted) hover:bg-(--accent) hover:text-(--foreground) transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="p-4 border-b border-(--border) space-y-3 overflow-visible">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" size={18} />
            <input
              autoFocus
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-(--border) bg-(--input-bg) py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          {renderFilter && (
            <div className="flex items-center gap-2 py-1">
              {renderFilter()}
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-(--muted)">
              <Loader2 size={24} className="animate-spin mb-2" />
              <p className="text-sm">Loading items...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Custom Input Option */}
              {onCustomInput && query.trim().startsWith("0x") && query.trim().length === 42 && (
                <button
                  onClick={() => {
                    onCustomInput(query.trim());
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-3 text-left text-sm transition-colors hover:bg-blue-500/10"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                    <Plus size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-blue-500">Use Custom Address</div>
                    <div className="text-[10px] font-mono text-(--muted) truncate">{query.trim()}</div>
                  </div>
                </button>
              )}

              {filteredItems.length > 0 ? (
                filteredItems.map((item, i) => (
                  <div key={i}>
                    {renderItem(item, () => {
                      onSelect(item);
                      onClose();
                    })}
                  </div>
                ))
              ) : !query.trim().startsWith("0x") || query.trim().length !== 42 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <p className="text-(--muted) mb-4">No results found for &quot;{query}&quot;</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
