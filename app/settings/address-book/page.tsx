"use client";

import { useState, useRef, useEffect } from "react";
import {
  BookUser,
  Plus,
  Pencil,
  X,
  Check,
  Trash2,
  Search,
  Globe,
  User,
  Package,
  Filter,
  ChevronDown,
  Tag,
  Database,
} from "lucide-react";
import { useConnection } from "wagmi";
import toast from "react-hot-toast";
import { useAddressBook } from "@/hooks/useAddressBook";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULT_ADDRESS_TAGS } from "@/config/address-tags";
import { SUPPORTED_CHAINS } from "@/config/chains";

// ─── Scope badge ────────────────────────────────────────────────

function ScopeBadge({ scope }: { scope: "global" | "user" | "default" }) {
  if (scope === "default") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500 uppercase">
        <Package size={10} /> Default
      </span>
    );
  }
  return scope === "global" ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500 uppercase">
      <Globe size={10} /> Public
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500 uppercase">
      <User size={10} /> Private
    </span>
  );
}

export default function AddressBookPage() {
  const { settings, isLoaded } = useSettings();
  const { entries, add, remove, update, uniqueTags } = useAddressBook();
  const { isConnected } = useConnection();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("All Tags");
  const [sourceFilter, setSourceFilter] = useState<"all" | "popular" | "personal">("all");
  
  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSourceFilter(settings.defaultAddressSourceFilter);
    }
  }, [isLoaded, settings.defaultAddressSourceFilter]);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add form
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newScope, setNewScope] = useState<"global" | "user">("global");
  const [newChainId, setNewChainId] = useState<number | undefined>(undefined);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  // Edit form
  const [editLabel, setEditLabel] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editChainId, setEditChainId] = useState<number | undefined>(undefined);

  const filtered = entries.filter((e) => {
    // Source filter logic
    if (sourceFilter === "popular" && e.scope !== "default") return false;
    if (sourceFilter === "personal" && e.scope === "default") return false;

    const matchesSearch = 
      e.label.toLowerCase().includes(search.toLowerCase()) ||
      e.address.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tagFilter === "All Tags" || e.tags?.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  const handleAdd = async () => {
    if (!newLabel.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newAddress.trim() || !newAddress.startsWith("0x") || newAddress.length !== 42) {
      toast.error("Enter a valid address (0x...)");
      return;
    }
    try {
      await add(newLabel.trim(), newAddress.trim(), newScope, newTags, newChainId);
      setNewLabel("");
      setNewAddress("");
      setNewScope("global");
      setNewChainId(undefined);
      setNewTags([]);
      setShowAdd(false);
      toast.success("Entry added");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save entry");
    }
  };

  const startEdit = (entry: typeof entries[0]) => {
    setEditingId(entry.id);
    setEditLabel(entry.label);
    setEditAddress(entry.address);
    setEditTags(entry.tags || []);
    setEditChainId(entry.chainId);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    update(editingId, { 
      label: editLabel.trim(), 
      address: editAddress.trim(),
      tags: editTags,
      chainId: editChainId
    });
    setEditingId(null);
    toast.success("Entry updated");
  };

  const toggleTag = (tag: string, currentTags: string[], setter: (tags: string[]) => void) => {
    if (currentTags.includes(tag)) {
      setter(currentTags.filter((t) => t !== tag));
    } else {
      setter([...currentTags, tag]);
    }
  };

  const sourceLabel = {
    all: "All Sources",
    popular: "Popular",
    personal: "Personal"
  }[sourceFilter];

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <BookUser size={20} className="text-blue-500" />
          Address Book
        </h2>

        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <div className="relative" ref={sourceDropdownRef}>
            <button
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-xs font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Database size={14} className={sourceFilter !== "all" ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{sourceLabel}</span>
              <ChevronDown size={14} className={`text-(--muted) transition-transform ${showSourceDropdown ? "rotate-180" : ""}`} />
            </button>

            {showSourceDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-52 origin-top-right rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">Filter by Source</div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { setSourceFilter("all"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "all" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <Globe size={14} className={sourceFilter === "all" ? "text-blue-500" : "text-(--muted)"} />
                    All Sources
                  </button>
                  <button
                    onClick={() => { setSourceFilter("popular"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "popular" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <Package size={14} className={sourceFilter === "popular" ? "text-blue-500" : "text-(--muted)"} />
                    Popular (Defaults)
                  </button>
                  <button
                    onClick={() => { setSourceFilter("personal"); setShowSourceDropdown(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${sourceFilter === "personal" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"}`}
                  >
                    <User size={14} className={sourceFilter === "personal" ? "text-blue-500" : "text-(--muted)"} />
                    Personal (Added)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tag Filter */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--card) px-4 py-2 text-xs font-bold transition-all hover:border-blue-500/50 hover:shadow-sm"
            >
              <Filter size={14} className={tagFilter !== "All Tags" ? "text-blue-500" : "text-(--muted)"} />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{tagFilter}</span>
              <ChevronDown size={14} className={`text-(--muted) transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">Filter by Tag</div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      setTagFilter("All Tags");
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                      tagFilter === "All Tags" ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                    }`}
                  >
                    <Globe size={14} className={tagFilter === "All Tags" ? "text-blue-500" : "text-(--muted)"} />
                    All Tags
                  </button>
                  <div className="my-1 border-t border-(--border) opacity-50" />
                  {uniqueTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setTagFilter(tag);
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                        tagFilter === tag ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                      }`}
                    >
                      <Tag size={14} className={tagFilter === tag ? "text-blue-500" : "text-(--muted)"} />
                      <span className="truncate">{tag}</span>
                      {tagFilter === tag && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-(--muted)">
        Manage your contacts and contract addresses. {entries.length} entries saved.
      </p>

      {/* Add form */}
      {showAdd && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Uniswap Router"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full rounded-lg border border-(--border) bg-(--input-bg) px-3 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-lg border border-(--border) bg-(--input-bg) px-3 py-2.5 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {DEFAULT_ADDRESS_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, newTags, setNewTags)}
                    className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${
                      newTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-(--accent) text-(--muted) border border-(--border)"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {newTags.filter(t => !(DEFAULT_ADDRESS_TAGS as readonly string[]).includes(t)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, newTags, setNewTags)}
                    className="rounded-md px-2 py-1 text-[10px] font-bold bg-blue-500 text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customTagInput.trim()) {
                      e.preventDefault();
                      if (!newTags.includes(customTagInput.trim())) {
                        setNewTags([...newTags, customTagInput.trim()]);
                      }
                      setCustomTagInput("");
                    }
                  }}
                  className="flex-1 rounded-lg border border-(--border) bg-(--input-bg) px-3 py-1.5 text-xs focus:border-blue-500/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-(--muted) pl-1">Network Scoping</label>
              <div className="relative">
                <select
                  value={newChainId || "global"}
                  onChange={(e) => setNewChainId(e.target.value === "global" ? undefined : Number(e.target.value))}
                  className="w-full appearance-none rounded-lg border border-(--border) bg-(--input-bg) px-3 py-2.5 text-sm outline-none focus:border-blue-500/50"
                >
                  <option value="global">Global (All Chains)</option>
                  {SUPPORTED_CHAINS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--muted)" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setNewScope("global")}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  newScope === "global"
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                    : "border border-(--border) text-(--muted)"
                }`}
              >
                <Globe size={12} /> Public
              </button>
              <button
                onClick={() => setNewScope("user")}
                disabled={!isConnected}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40 ${
                  newScope === "user"
                    ? "bg-purple-500/10 text-purple-500 border border-purple-500/30"
                    : "border border-(--border) text-(--muted)"
                }`}
              >
                <User size={12} /> Private
              </button>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-(--border) px-3 py-1.5 text-xs font-medium text-(--muted) hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-(--border) bg-(--input-bg) pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="mt-4 space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={`flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--card) p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center sm:justify-between ${editingId === entry.id ? 'border-blue-500/30 ring-1 ring-blue-500/10' : ''}`}
            >
              <div className="min-w-0 flex-1 space-y-2">
                {editingId === entry.id ? (
                  <div className="grid gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="rounded-lg border border-(--border) bg-(--input-bg) px-3 py-1.5 text-sm"
                      placeholder="Name"
                    />
                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="rounded-lg border border-(--border) bg-(--input-bg) px-3 py-1.5 text-sm font-mono"
                      placeholder="0x..."
                    />
                    <div className="flex flex-wrap gap-2">
                      {uniqueTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, editTags, setEditTags)}
                          className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${editTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-(--accent) text-(--muted)'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-(--foreground)">{entry.label}</span>
                      <ScopeBadge scope={entry.scope} />
                      {entry.chainId && (
                        <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold text-amber-500 uppercase">
                          {SUPPORTED_CHAINS.find(c => c.id === entry.chainId)?.name || 'Chain Specific'}
                        </span>
                      )}
                    </div>
                    <p className="truncate font-mono text-[10px] text-(--muted) bg-(--accent)/50 px-2 py-1 rounded-md inline-block">
                      {entry.address}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags?.map(tag => (
                        <span key={tag} className="rounded-md bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-1.5 shrink-0 border-t border-(--border) pt-3 sm:border-none sm:pt-0">
                {editingId === entry.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="rounded-lg bg-green-500/10 p-2 text-green-500 hover:bg-green-500/20"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-(--accent) p-2 text-(--muted) hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : entry.scope !== "default" ? (
                  <>
                    <button
                      onClick={() => startEdit(entry)}
                      className="rounded-lg bg-(--accent) p-2 text-(--muted) hover:text-blue-500 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        remove(entry.id);
                        toast.success("Entry removed");
                      }}
                      className="rounded-lg bg-(--accent) p-2 text-(--muted) hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-(--muted) uppercase px-2 italic">Read Only</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-(--border) py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-4">
            <BookUser size={24} />
          </div>
          <h3 className="text-sm font-bold">Your Address Book is Empty</h3>
          <p className="mt-1 text-xs text-(--muted)">Add your first contact or contract to get started.</p>
        </div>
      ) : (
        <div className="mt-8 text-center text-sm text-(--muted) py-12">
          No entries found matching your filters.
        </div>
      )}
    </section>
  );
}
