"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { createWagmiConfig } from "@/config/wagmi";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    // Dynamically create config to include custom RPCs from IndexedDB
    createWagmiConfig().then((c) => setConfig(c));
  }, []);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p className="text-sm font-medium text-[var(--muted)]">Initializing Web3...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
