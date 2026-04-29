# SandWitch 🥪

A modern, multi-chain utility platform for Ethereum and EVM-compatible networks.

## Core Features

- **Multi-Sender**: Send tokens to multiple addresses in one transaction. Supports both Native (ETH, MATIC, etc.) and ERC20 tokens.
- **Address Book**: Save frequently used addresses with custom labels, stored locally in your browser.
- **Custom Tokens**: Import and track any ERC20 token across multiple chains.
- **Network Configuration**: Override public RPCs with your own private nodes for better privacy and reliability.
- **Local Data Control**: Your data never leaves your browser. Export and import your configuration as JSON anytime.

## Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, TypeScript)
- **Web3**: [wagmi](https://wagmi.sh) & [viem](https://viem.sh)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (Modern design system, dark mode support)
- **Icons**: [Lucide React](https://lucide.dev)
- **Database**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via a custom wrapper for local persistence.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Privacy & Security

SandWitch is designed with privacy as a core principle:
- **Zero Server Side**: No databases, no tracking, no analytics.
- **Non-Custodial**: The multi-sender contract never holds or controls your funds; it simply forwards them.
- **Exact Approvals**: Token approvals are only requested for the exact amount needed for the transaction.

## License

MIT
