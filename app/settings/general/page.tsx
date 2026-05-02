"use client";

import { useSettings } from "@/hooks/useSettings";
import { Settings2, Eye, EyeOff, Globe, Package, User } from "lucide-react";

export default function GeneralSettingsPage() {
  const { settings, updateSettings, isLoaded } = useSettings();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-(--muted)">Loading settings...</div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-(--border) pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Settings2 size={20} className="text-amber-500" />
          General Settings
        </h2>
      </div>

      <div className="space-y-6">
        {/* Portfolio Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-(--muted)">Portfolio View</h3>
          <div className="rounded-2xl border border-(--border) bg-(--accent)/50 p-4 transition-all hover:border-amber-500/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-(--foreground)">Show Zero Balances by Default</p>
                <p className="text-xs text-(--muted) mt-1">
                  Choose whether to hide empty token balances when you first load the portfolio page.
                </p>
              </div>
              <button
                onClick={() => updateSettings({ portfolioShowZeroBalances: !settings.portfolioShowZeroBalances })}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  settings.portfolioShowZeroBalances
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    : "border-(--border) bg-(--card) text-(--muted) hover:text-(--foreground)"
                }`}
              >
                {settings.portfolioShowZeroBalances ? <Eye size={16} /> : <EyeOff size={16} />}
                {settings.portfolioShowZeroBalances ? "Showing" : "Hidden"}
              </button>
            </div>
          </div>
        </div>

        {/* Defaults Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-(--muted)">Default Data Sources</h3>
          
          {/* Token Selector Default */}
          <div className="rounded-2xl border border-(--border) bg-(--accent)/50 p-4 transition-all hover:border-amber-500/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-(--foreground)">Default Token Filter</p>
                <p className="text-xs text-(--muted) mt-1">
                  Select which tokens to show first when opening the token selection modal.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <FilterButton
                  active={settings.defaultTokenSourceFilter === "all"}
                  onClick={() => updateSettings({ defaultTokenSourceFilter: "all" })}
                  icon={Globe}
                  label="All"
                />
                <FilterButton
                  active={settings.defaultTokenSourceFilter === "popular"}
                  onClick={() => updateSettings({ defaultTokenSourceFilter: "popular" })}
                  icon={Package}
                  label="Popular"
                />
                <FilterButton
                  active={settings.defaultTokenSourceFilter === "personal"}
                  onClick={() => updateSettings({ defaultTokenSourceFilter: "personal" })}
                  icon={User}
                  label="Personal"
                />
              </div>
            </div>
          </div>

          {/* Address Selector Default */}
          <div className="rounded-2xl border border-(--border) bg-(--accent)/50 p-4 transition-all hover:border-amber-500/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-(--foreground)">Default Address Filter</p>
                <p className="text-xs text-(--muted) mt-1">
                  Select which contacts to show first when opening the address selection modal.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <FilterButton
                  active={settings.defaultAddressSourceFilter === "all"}
                  onClick={() => updateSettings({ defaultAddressSourceFilter: "all" })}
                  icon={Globe}
                  label="All"
                />
                <FilterButton
                  active={settings.defaultAddressSourceFilter === "popular"}
                  onClick={() => updateSettings({ defaultAddressSourceFilter: "popular" })}
                  icon={Package}
                  label="Popular"
                />
                <FilterButton
                  active={settings.defaultAddressSourceFilter === "personal"}
                  onClick={() => updateSettings({ defaultAddressSourceFilter: "personal" })}
                  icon={User}
                  label="Personal"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function FilterButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
        active
          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
          : "bg-(--card) border border-(--border) text-(--muted) hover:text-(--foreground)"
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
