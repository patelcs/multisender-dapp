## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Architecture Mandates

### Custom RPC Configuration
- The application supports user-defined RPC overrides for all supported chains.
- All blockchain-related features (fetching metadata, balances, simulations, etc.) MUST use the dynamic wagmi configuration provided by `createWagmiConfig()` in `@/config/wagmi.ts`.
- NEVER use hardcoded or default public RPCs for new features without ensuring they are integrated into the fallback transport system that respects user overrides.
- Custom RPC settings are stored in IndexedDB (`rpc_config` store) and are included in the Import/Export feature.

## Branding
- The application is branded as **SandWitch**.
- The main focus is providing multi-chain utility tools, starting with the multi-token sender.
- Ensure all new features follow the SandWitch design system (blue-to-purple gradients, modern typography, glassmorphism).
