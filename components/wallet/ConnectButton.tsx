"use client";

import { useConnect, useDisconnect, useAccount, useChainId, useSwitchChain } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { SUPPORTED_CHAINS, EXPLORER_URLS } from "@/config/chains";

export default function ConnectButton() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showChainMenu, setShowChainMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
      if (chainRef.current && !chainRef.current.contains(e.target as Node)) {
        setShowChainMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const truncatedAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <>
        <button
          onClick={() => setShowWalletModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Wallet size={16} />
          Connect Wallet
        </button>

        {/* Wallet selection modal */}
        {showWalletModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--foreground)]">Connect Wallet</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {connectors.map((c) => (
                  <button
                    key={c.uid}
                    onClick={() => {
                      connect({ connector: c });
                      setShowWalletModal(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
                  >
                    <Wallet size={18} className="text-blue-500" />
                    {c.name}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-[var(--muted)]">
                By connecting, you agree to the terms of service.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Chain switcher */}
      <div ref={chainRef} className="relative">
        <button
          onClick={() => setShowChainMenu((p) => !p)}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50"
        >
          <span className="hidden sm:inline">{currentChain?.name ?? "Unknown"}</span>
          <span className="sm:hidden">{currentChain?.nativeCurrency.symbol ?? "?"}</span>
          <ChevronDown size={14} />
        </button>
        {showChainMenu && (
          <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  switchChain({ chainId: chain.id });
                  setShowChainMenu(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  chain.id === chainId
                    ? "bg-blue-500/10 text-blue-500 font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Account dropdown */}
      <div ref={accountRef} className="relative">
        <button
          onClick={() => setShowAccountMenu((p) => !p)}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:border-blue-500/50"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {truncatedAddress}
          <ChevronDown size={14} />
        </button>
        {showAccountMenu && (
          <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
            <div className="mb-2 px-3 py-2">
              <p className="text-xs text-[var(--muted)]">Connected with {connector?.name}</p>
              <p className="mt-1 font-mono text-sm text-[var(--foreground)]">{truncatedAddress}</p>
            </div>
            <button
              onClick={copyAddress}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
            {currentChain && (
              <a
                href={`${EXPLORER_URLS[chainId] ?? "#"}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
              >
                <ExternalLink size={14} />
                View on Explorer
              </a>
            )}
            <button
              onClick={() => {
                disconnect();
                setShowAccountMenu(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
