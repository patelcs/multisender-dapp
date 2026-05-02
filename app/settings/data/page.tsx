"use client";

import { useState, useRef } from "react";
import {
  FileJson,
  Download,
  Upload,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAddressBook } from "@/hooks/useAddressBook";
import { useTokenList } from "@/hooks/useTokenList";
import { useSettings } from "@/hooks/useSettings";
import {
  exportUserData,
  importUserData,
  validateImportData,
  clearAllData,
  type ExportData,
} from "@/lib/storage";

// ─── Import / Export Section ────────────────────────────────────

function ImportExportSection() {
  const { refresh: refreshAddr } = useAddressBook();
  const { refresh: refreshTokens } = useTokenList();
  const { refresh: refreshSettings } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);

  const handleExport = async () => {
    const data = await exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sandwich-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!validateImportData(parsed)) {
          toast.error("Invalid file format");
          return;
        }
        setImportPreview(parsed);
      } catch {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
    // Reset so re-selecting same file works
    e.target.value = "";
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    const result = await importUserData(importPreview);
    toast.success(
      `Imported ${result.addressBookAdded} contacts, ${result.tokensAdded} tokens${result.settingsImported ? ", and general settings" : ""}`
    );
    setImportPreview(null);
    refreshAddr();
    refreshTokens();
    if (result.settingsImported) refreshSettings();
  };

  return (
    <section>
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <FileJson size={20} className="text-green-500" />
        Import &amp; Export
      </h2>
      <p className="mt-1 text-sm text-(--muted)">
        Export all your data (including global and all wallet-specific entries) as JSON, or import from a file.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--card) px-6 py-3 text-sm font-medium text-(--foreground) transition-all hover:border-green-500/50 hover:bg-green-500/5"
        >
          <Download size={16} className="text-green-500" />
          Export JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--card) px-6 py-3 text-sm font-medium text-(--foreground) transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
        >
          <Upload size={16} className="text-blue-500" />
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Import preview */}
      {importPreview && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
          <p className="text-sm font-medium">
            Ready to import:
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-(--muted)">
            <span>
              <strong className="text-(--foreground)">{importPreview.addressBook?.length ?? 0}</strong> contacts
            </span>
            <span>
              <strong className="text-(--foreground)">{importPreview.tokenList?.length ?? 0}</strong> tokens
            </span>
            {importPreview.rpcConfig && importPreview.rpcConfig.length > 0 && (
              <span>
                <strong className="text-(--foreground)">{importPreview.rpcConfig.length}</strong> RPCs
              </span>
            )}
            {importPreview.settings && (
              <span className="flex items-center gap-1 text-blue-500 font-bold">
                ✓ Includes Settings
              </span>
            )}
          </div>
          <p className="text-xs text-(--muted)">
            Duplicate entries (same address) will be skipped. Settings will be overwritten.
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmImport}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Confirm Import
            </button>
            <button
              onClick={() => setImportPreview(null)}
              className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--muted)"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Danger Zone ────────────────────────────────────────────────

function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { refresh: refreshAddr } = useAddressBook();
  const { refresh: refreshTokens } = useTokenList();

  const handleClear = async () => {
    await clearAllData();
    setShowConfirm(false);
    refreshAddr();
    refreshTokens();
    toast.success("All local data cleared");
  };

  return (
    <section>
      <h2 className="flex items-center gap-2 text-xl font-bold text-red-500">
        <AlertTriangle size={20} />
        Danger Zone
      </h2>
      <p className="mt-1 text-sm text-(--muted)">
        Permanently delete all locally stored data (address book + tokens).
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10"
        >
          <Trash2 size={16} />
          Clear All Data
        </button>
      ) : (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
          <p className="text-sm font-medium text-red-500">
            Are you sure? This will permanently delete all your contacts and saved tokens.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--muted)"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function DataManagementPage() {
  return (
    <div className="space-y-10">
      <ImportExportSection />
      <hr className="border-(--border)" />
      <DangerZone />
    </div>
  );
}
