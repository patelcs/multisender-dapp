"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Settings, 
  BookUser, 
  Coins, 
  Database,
  Network
} from "lucide-react";
import InfoBanner from "@/components/ui/InfoBanner";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Address Book",
      href: "/settings/address-book",
      icon: BookUser,
      color: "text-blue-500",
    },
    {
      label: "Saved Tokens",
      href: "/settings/tokens",
      icon: Coins,
      color: "text-purple-500",
    },
    {
      label: "Networks",
      href: "/settings/networks",
      icon: Network,
      color: "text-blue-600",
    },
    {
      label: "Data Management",
      href: "/settings/data",
      icon: Database,
      color: "text-green-500",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
          <Settings size={28} className="text-blue-500" />
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Manage your address book, saved tokens, and data.
        </p>
      </div>

      {/* Storage notice */}
      <InfoBanner variant="info" title="Local storage only">
        All your data (address book, saved tokens) is stored locally in your
        browser&apos;s localStorage. Nothing is sent to any server. Use Export to back up
        your data, and Import to restore it on a new device or browser.
      </InfoBanner>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <div className="flex w-full flex-col gap-2 md:w-64 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all border ${
                  isActive
                    ? `bg-[var(--accent)] ${item.color} border-[var(--border)] shadow-sm`
                    : "text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] border-transparent"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content area */}
        <div className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm min-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
