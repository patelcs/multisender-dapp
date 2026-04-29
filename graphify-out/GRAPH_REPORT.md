# Graph Report - multisender-dapp  (2026-05-01)

## Corpus Check
- 39 files · ~19,139 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 120 nodes · 103 edges · 16 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]

## God Nodes (most connected - your core abstractions)
1. `writeItem()` - 8 edges
2. `getAllAddressBook()` - 6 edges
3. `getAllTokenList()` - 6 edges
4. `importUserData()` - 6 edges
5. `getDB()` - 5 edges
6. `readAll()` - 5 edges
7. `deleteItem()` - 5 edges
8. `exportUserData()` - 5 edges
9. `getCustomRPCs()` - 4 edges
10. `clearStore()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `handleExport()` --calls--> `exportUserData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts
- `confirmImport()` --calls--> `importUserData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts
- `Graphify Knowledge Graph` --semantically_similar_to--> `Agent Guidelines`  [INFERRED] [semantically similar]
  GEMINI.md → CLAUDE.md
- `createWagmiConfig()` --calls--> `getCustomRPCs()`  [INFERRED]
  config/wagmi.ts → lib/storage.ts
- `handleClear()` --calls--> `clearAllData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts

## Hyperedges (group relationships)
- **Multi-Send Transaction Workflow** — usemultisend_usemultisend, sendstepper_sendstepper, abi_multisender_abi, chains_multisender_addresses [EXTRACTED 1.00]
- **Application Context Wrappers** — themeprovider_themeprovider, web3provider_web3provider, layout_rootlayout [EXTRACTED 0.95]
- **App Navigation Structure** — page_homepage, page_guidepage, page_donatepage, page_docspage, page_securitypage, page_sendpage [EXTRACTED 1.00]
- **Graphify Workflow** — agents_graphify, agents_graphify_query, agents_graphify_path, agents_graphify_explain, agents_graphify_update [INFERRED 0.90]
- **Next.js App Routing Structure** — layout_donatelayout, layout_sendlayout, next_env_nextjs_types [INFERRED 0.85]
- **Project Documentation and Agent Guidelines** — readme_multisender_dapp, gemini_graphify_knowledge_graph, claude_agent_guidelines [INFERRED 0.80]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (21): addAddressBookEntry(), addSavedToken(), clearStore(), deleteItem(), exportUserData(), filterByScope(), getAddressBook(), getAllAddressBook() (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (4): confirmImport(), handleClear(), handleExport(), clearAllData()

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (2): handleReviewAndSend(), validate()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): Geist Font, MultiSender DApp, Next.js Framework, Vercel Deployment

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (1): createWagmiConfig()

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (2): Graphify Project Rules, Next.js Agent Rules

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (2): Agent Guidelines, Graphify Knowledge Graph

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (2): File Document Icon, Browser Window Icon

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): Gas Efficiency

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): Non-Custodial Design

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): Atomic Execution

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Automatic ETH Refund

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Exact Approval Strategy

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): Globe Icon

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Next.js Logo

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Vercel Logo

## Knowledge Gaps
- **17 isolated node(s):** `Gas Efficiency`, `Non-Custodial Design`, `Atomic Execution`, `Automatic ETH Refund`, `Exact Approval Strategy` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 2`** (5 nodes): `page.tsx`, `buildSendData()`, `createEmptyGroup()`, `handleReviewAndSend()`, `validate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `createWagmiConfig()`, `wagmi.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Graphify Project Rules`, `Next.js Agent Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `Agent Guidelines`, `Graphify Knowledge Graph`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `File Document Icon`, `Browser Window Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `Gas Efficiency`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `Non-Custodial Design`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `Atomic Execution`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Automatic ETH Refund`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Exact Approval Strategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `Globe Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Next.js Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getCustomRPCs()` connect `Community 0` to `Community 15`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `exportUserData()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `importUserData()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `Gas Efficiency`, `Non-Custodial Design`, `Atomic Execution` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._