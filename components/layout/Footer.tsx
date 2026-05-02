import Link from "next/link";
import { PORTFOLIO_URL, GITHUB_URL, DISCORD_URL } from "@/lib/constants";
import { Zap, Code, ExternalLink, MessageCircle } from "lucide-react";

const CORE_LINKS = [
  { href: "/send", label: "Send" },
  { href: "/multisend", label: "Multi Send" },
  { href: "/approvals", label: "Approvals" },
];

const RESOURCE_LINKS = [
  { href: "/guide", label: "Guide" },
  { href: "/docs", label: "Documentation" },
  { href: "/security", label: "Security & Safety" },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--card)">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-(--foreground)">
              <Zap size={20} className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Sandwich
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-(--muted)">
              The ultimate multi-chain utility hub. Send tokens efficiently across all major networks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-(--muted)">
              Core Tools
            </h4>
            <ul className="flex flex-col gap-2.5">
              {CORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-(--muted) transition-colors hover:text-blue-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-(--muted)">
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-(--muted) transition-colors hover:text-blue-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-(--muted)">
              Community
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-blue-500"
                >
                  <Code size={14} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-blue-500"
                >
                  <MessageCircle size={14} />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-blue-500"
                >
                  <ExternalLink size={14} />
                  Developer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-(--border) pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-(--muted)">
            © {new Date().getFullYear()} Sandwich. Open-source &amp; non-custodial.
          </p>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-(--muted) transition-colors hover:text-blue-500"
          >
            Built by the developer →
          </a>
        </div>
      </div>
    </footer>
  );
}
