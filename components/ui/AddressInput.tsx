"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { BookUser, Building2, Globe, User, Tag, Package, Filter, Database } from "lucide-react";
import { useAddressBook } from "@/hooks/useAddressBook";
import { useSettings } from "@/hooks/useSettings";
import SearchModal from "./SearchModal";
import FilterDropdown from "./FilterDropdown";

interface AddressInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
  chainId?: number;
}

export default function AddressInput({
  value,
  onChange,
  placeholder,
  className = "",
  chainId,
}: AddressInputProps) {
  const { settings, isLoaded } = useSettings();
  const { entries, uniqueTags, getLabel } = useAddressBook(chainId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("All Tags");
  const [sourceFilter, setSourceFilter] = useState<"all" | "popular" | "personal">("all");
  
  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSourceFilter(settings.defaultAddressSourceFilter);
    }
  }, [isLoaded, settings.defaultAddressSourceFilter]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const savedEntry = useMemo(() => 
    entries.find(e => e.address.toLowerCase() === value.toLowerCase()),
    [entries, value]
  );
  
  const savedLabel = savedEntry?.label || getLabel(value);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (sourceFilter === "popular" && e.scope !== "default") return false;
      if (sourceFilter === "personal" && e.scope === "default") return false;
      if (tagFilter !== "All Tags" && !e.tags?.includes(tagFilter)) return false;
      return true;
    });
  }, [entries, tagFilter, sourceFilter]);

  const sourceLabel = {
    all: "All Sources",
    popular: "Popular",
    personal: "Personal"
  }[sourceFilter];

  return (
    <div className={`relative w-full group ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-(--border) bg-(--input-bg) pl-4 pr-12 py-2.5 text-sm outline-none transition-all focus:border-blue-500/50 hover:border-(--border-hover)"
        />
        
        <div className="absolute right-1.5 flex items-center gap-1">
          {savedLabel && (
            <span className="hidden sm:block rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500 uppercase truncate max-w-[80px]">
              {savedLabel}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg p-1.5 text-(--muted) hover:bg-(--accent) hover:text-blue-500 transition-colors"
            title="Open Address Book"
          >
            <BookUser size={18} />
          </button>
        </div>
      </div>

      {/* Selection Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Address"
        items={filteredEntries}
        searchFields={(e) => [e.label, e.address, ...(e.tags || [])]}
        onSelect={(e) => onChange(e.address)}
        onCustomInput={onChange}
        renderFilter={() => (
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label={sourceLabel}
              value={sourceFilter}
              options={[
                { id: "all", label: "All Sources", icon: Globe },
                { id: "popular", label: "Popular", icon: Package },
                { id: "personal", label: "Personal", icon: User },
              ]}
              onChange={setSourceFilter}
              icon={Database}
              title="Filter by Source"
            />
            <FilterDropdown
              label={tagFilter}
              value={tagFilter}
              options={[
                { id: "All Tags", label: "All Tags", icon: Globe },
                ...uniqueTags.map(tag => ({
                  id: tag,
                  label: tag,
                  icon: Tag
                }))
              ]}
              onChange={setTagFilter}
              icon={Filter}
              title="Filter by Tag"
            />
          </div>
        )}
        placeholder="Search name, address or tag..."
        renderItem={(entry, onSelect) => (
          <button
            onClick={onSelect}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-(--accent)"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              entry.scope === "default" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
            }`}>
              {entry.scope === "default" ? <Building2 size={16} /> : <BookUser size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="font-bold truncate">{entry.label}</div>
                <div className="flex flex-wrap gap-1">
                  {entry.tags?.map(t => (
                    <span key={t} className="rounded px-1 bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono text-(--muted) truncate">{entry.address}</div>
            </div>
          </button>
        )}
      />
    </div>
  );
}
