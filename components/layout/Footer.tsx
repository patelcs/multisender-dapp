import Link from "next/link";
import { PORTFOLIO_URL, GITHUB_URL } from "@/lib/constants";
import { Zap, Code, ExternalLink } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/send", label: "Send" },
  { href: "/multisend", label: "Multi Send" },
  { href: "/approvals", label: "Approvals" },
  { href: "/security", label: "Security" },
  { href: "/docs", label: "Docs" },
  { href: "/settings/address-book", label: "Settings" },
  { href: "/guide", label: "Guide" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
              <Zap size={20} className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                SandWitch
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              Send ERC20 tokens and native currency to multiple addresses in a single, gas-efficient transaction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              External
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  <Code size={14} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  <ExternalLink size={14} />
                  Developer Portfolio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} SandWitch. Open-source &amp; non-custodial.
          </p>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--muted)] transition-colors hover:text-blue-500"
          >
            Built by the developer →
          </a>
        </div>
      </div>
    </footer>
  );
}
