"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAddressBook } from "@/hooks/useAddressBook";

// ─── Scope badge ────────────────────────────────────────────────

function ScopeBadge({ scope }: { scope: "global" | "user" | "default" }) {
  if (scope === "default") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
        <Package size={10} /> Default
      </span>
    );
  }
  return scope === "global" ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
      <Globe size={10} /> Global
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500">
      <User size={10} /> Wallet
    </span>
  );
}

export default function AddressBookPage() {
  const { entries, add, remove, update } = useAddressBook();
  const { isConnected } = useAccount();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newScope, setNewScope] = useState<"global" | "user">("global");

  // Edit form
  const [editLabel, setEditLabel] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.label.toLowerCase().includes(search.toLowerCase()) ||
          e.address.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const handleAdd = async () => {
    if (!newLabel.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newAddress.trim() || !newAddress.startsWith("0x") || newAddress.length !== 42) {
      toast.error("Enter a valid address (0x...)");
      return;
    }
    if (newScope === "user" && !isConnected) {
      toast.error("Connect a wallet to add user-scoped entries");
      return;
    }
    try {
      await add(newLabel.trim(), newAddress.trim(), newScope);
      setNewLabel("");
      setNewAddress("");
      setNewScope("global");
      setShowAdd(false);
      toast.success("Contact added");
    } catch (err: any) {
      toast.error(err.message || "Failed to save contact");
    }
  };

  const startEdit = (entry: typeof entries[0]) => {
    setEditingId(entry.id);
    setEditLabel(entry.label);
    setEditAddress(entry.address);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    update(editingId, { label: editLabel.trim(), address: editAddress.trim() });
    setEditingId(null);
    toast.success("Contact updated");
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <BookUser size={20} className="text-blue-500" />
          Address Book
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={14} />
          Add Contact
        </button>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Named addresses available across all chains. {entries.length} contact{entries.length !== 1 ? "s" : ""} saved.
      </p>

      {/* Add form */}
      {showAdd && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Name (e.g. Alice, Treasury)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm"
            />
            <input
              type="text"
              placeholder="Address (0x...)"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm font-mono"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setNewScope("global")}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  newScope === "global"
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                    : "border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                <Globe size={12} /> Global
              </button>
              <button
                onClick={() => setNewScope("user")}
                disabled={!isConnected}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40 ${
                  newScope === "user"
                    ? "bg-purple-500/10 text-purple-500 border border-purple-500/30"
                    : "border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                <User size={12} /> This Wallet
              </button>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {entries.length > 0 && (
        <div className="relative mt-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] pl-9 pr-3 py-2.5 text-sm"
          />
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="mt-4 space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === entry.id ? (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5 text-sm"
                  />
                  <input
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5 text-sm font-mono"
                  />
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{entry.label}</span>
                    <ScopeBadge scope={entry.scope} />
                  </div>
                  <p className="mt-0.5 truncate font-mono text-xs text-[var(--muted)]">
                    {entry.address}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1.5 shrink-0">
                {editingId === entry.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="rounded-lg p-1.5 text-green-500 hover:bg-green-500/10"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(entry)}
                      className="rounded-lg p-1.5 text-[var(--muted)] hover:text-blue-500 hover:bg-blue-500/10"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        remove(entry.id);
                        toast.success("Contact removed");
                      }}
                      className="rounded-lg p-1.5 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
          No contacts yet. Add your first contact above.
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
          No contacts match &quot;{search}&quot;
        </div>
      )}
    </section>
  );
}
