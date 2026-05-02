## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"` or `graphify path "<A>" "<B>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Architecture Mandates

### Custom RPC Configuration
- The application supports user-defined RPC overrides for all supported chains.
- All blockchain-related features (fetching metadata, balances, simulations, etc.) MUST use the dynamic wagmi configuration provided by `createWagmiConfig()` in `@/config/wagmi.ts`.
- NEVER use hardcoded or default public RPCs for new features without ensuring they are integrated into the fallback transport system that respects user overrides.
- Custom RPC settings are stored in IndexedDB (`rpc_config` store) and are included in the Import/Export feature.

### Token Customization
- The application allows users to override the default on-chain name of any token.
- ALL components and hooks (e.g., `useTokenInfo`, `useTokenList`) MUST prioritize these user-defined custom names over official on-chain data.
- Ensure that feature-specific pages (Portfolio, Send, Multi-send, etc.) always display the resolved name from these hooks to maintain consistency.

### Modern Standards & Deprecation Policy
- NEVER use deprecated React, Next.js, Wagmi, or Viem features or functions.
- ALWAYS use the most modern and stable patterns available (e.g., Tailwind v4 syntax, Wagmi v2/v3 hooks, TanStack Query v5 patterns).
- Prioritize type safety and avoid `any` or non-specific types.
- Maintain consistency with existing architecture (App Router, Client/Server component separation).
- If a dependency update introduces a better or more efficient version of an existing pattern, refactor to use it during the next relevant task.

## Branding
- The application is branded as **Sandwich**.
- The main focus is providing multi-chain utility tools, starting with the multi-token sender.
- Ensure all new features follow the Sandwich design system (blue-to-purple gradients, modern typography, glassmorphism).
