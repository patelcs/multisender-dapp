"use client";

import { useState } from "react";
import { 
  Network, 
  Save, 
  RotateCcw, 
  Globe, 
  Check, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { useRPCConfig } from "@/hooks/useRPCConfig";
import { SUPPORTED_CHAINS } from "@/config/chains";

export default function NetworksPage() {
  const { rpcs, isLoading, update } = useRPCConfig();
  const [editingChainId, setEditingId] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState("");

  const handleSave = async (chainId: number) => {
    if (editUrl && !editUrl.startsWith("http") && !editUrl.startsWith("ws")) {
      toast.error("Invalid RPC URL. Must start with http://, https://, or ws://");
      return;
    }
    
    try {
      await update(chainId, editUrl);
      setEditingId(null);
      toast.success("RPC updated. Refresh the page for changes to take effect.");
    } catch (err) {
      toast.error("Failed to save RPC");
    }
  };

  const handleReset = async (chainId: number) => {
    try {
      await update(chainId, "");
      toast.success("RPC reset to default");
    } catch (err) {
      toast.error("Failed to reset RPC");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Network size={20} className="text-blue-500" />
          Network Configuration
        </h2>
      </div>
      
      <p className="text-sm text-[var(--muted)]">
        Override the default public RPC endpoints with your own private nodes for better reliability and privacy. 
        Changes require a page refresh to take effect.
      </p>

      <div className="grid gap-4">
        {SUPPORTED_CHAINS.map((chain) => {
          const customRpc = rpcs.find(r => r.chainId === chain.id);
          const isEditing = editingChainId === chain.id;
          
          return (
            <div key={chain.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-blue-500/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-bold">
                    {chain.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{chain.name}</span>
                      {customRpc ? (
                        <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                          Custom
                        </span>
                      ) : (
                        <span className="rounded-md bg-blue-500/5 px-2 py-0.5 text-[10px] font-bold text-blue-500/60">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--muted)]">Chain ID: {chain.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(chain.id);
                          setEditUrl(customRpc?.url || "");
                        }}
                        className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--accent)]"
                      >
                        {customRpc ? "Change RPC" : "Configure"}
                      </button>
                      {customRpc && (
                        <button
                          onClick={() => handleReset(chain.id)}
                          className="rounded-xl border border-red-500/20 p-2 text-red-500 hover:bg-red-500/5"
                          title="Reset to default"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(chain.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Save size={14} /> Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pl-1">
                      Custom RPC URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://your-node-url.com"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm font-mono focus:border-blue-500/50"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] opacity-70">
                      Currently using:
                    </span>
                    <span className="truncate font-mono text-xs text-[var(--foreground)] opacity-80">
                      {customRpc?.url || "Public Shared RPC (Default)"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
          <p className="font-bold">Security Note:</p>
          <p>
            Always use trusted RPC providers. A malicious RPC could misreport balances or simulate 
            transactions incorrectly. SandWitch never shares your private keys with any RPC.
          </p>
        </div>
      </div>
    </section>
  );
}
