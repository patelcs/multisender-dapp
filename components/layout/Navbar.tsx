"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sun, Moon, Zap, MessageCircle } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import ConnectButton from "@/components/wallet/ConnectButton";
import { usePathname } from "next/navigation";
import { DISCORD_URL } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/getting-started", label: "Getting Started" },
  { href: "/", label: "Portfolio" },
  { href: "/tools", label: "Tools" },
  { href: "/settings", label: "Settings" },
  { href: "/guide", label: "Guide" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-(--border) bg-(--card)/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-(--foreground)">
          <Zap size={22} className="text-blue-500" />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Sandwich
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-blue-500/10 text-blue-500"
                  : "text-(--muted) hover:text-(--foreground) hover:bg-(--accent)"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center justify-center rounded-lg border border-(--border) p-2 text-(--muted) transition-colors hover:text-blue-500 hover:bg-(--accent) sm:flex"
            aria-label="Join Discord"
            title="Join Discord"
          >
            <MessageCircle size={16} />
          </a>

          <button
            onClick={toggle}
            className="rounded-lg border border-(--border) p-2 text-(--muted) transition-colors hover:text-(--foreground) hover:bg-(--accent)"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="hidden sm:block">
            <ConnectButton />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="rounded-lg p-2 text-(--muted) transition-colors hover:text-(--foreground) md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-(--border) bg-(--card) md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-(--muted) hover:text-(--foreground) hover:bg-(--accent)"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-(--muted) transition-colors hover:text-blue-500 hover:bg-(--accent)"
            >
              <MessageCircle size={18} />
              Discord Community
            </a>
            <div className="mt-2 sm:hidden">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
