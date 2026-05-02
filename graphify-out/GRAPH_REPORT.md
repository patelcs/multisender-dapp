# Graph Report - .  (2026-05-02)

## Corpus Check
- Corpus is ~25,475 words - fits in a single context window. You may not need a graph.

## Summary
- 191 nodes · 153 edges · 35 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Storage Layer (IndexedDB)|Storage Layer (IndexedDB)]]
- [[_COMMUNITY_Architectural Mandates|Architectural Mandates]]
- [[_COMMUNITY_Address Input & Search|Address Input & Search]]
- [[_COMMUNITY_Address Book Management|Address Book Management]]
- [[_COMMUNITY_Graphify Skill & Rules|Graphify Skill & Rules]]
- [[_COMMUNITY_Recipient List Handling|Recipient List Handling]]
- [[_COMMUNITY_Data ImportExport UI|Data Import/Export UI]]
- [[_COMMUNITY_Multi-send Workflow|Multi-send Workflow]]
- [[_COMMUNITY_Project Metadata (README)|Project Metadata (README)]]
- [[_COMMUNITY_Theme Management|Theme Management]]
- [[_COMMUNITY_Address Input UI Logic|Address Input UI Logic]]
- [[_COMMUNITY_RPC Config Hook|RPC Config Hook]]
- [[_COMMUNITY_UI Assets & Icons|UI Assets & Icons]]
- [[_COMMUNITY_Documentation Page|Documentation Page]]
- [[_COMMUNITY_Security Info Page|Security Info Page]]
- [[_COMMUNITY_Token Detail Page|Token Detail Page]]
- [[_COMMUNITY_Getting Started Page|Getting Started Page]]
- [[_COMMUNITY_Constant Definitions|Constant Definitions]]
- [[_COMMUNITY_Gas Efficiency (Feature)|Gas Efficiency (Feature)]]
- [[_COMMUNITY_Non-Custodial (Feature)|Non-Custodial (Feature)]]
- [[_COMMUNITY_Atomic Execution (Feature)|Atomic Execution (Feature)]]
- [[_COMMUNITY_Auto-Refund (Feature)|Auto-Refund (Feature)]]
- [[_COMMUNITY_Approval Logic (Feature)|Approval Logic (Feature)]]
- [[_COMMUNITY_Globe SVG Asset|Globe SVG Asset]]
- [[_COMMUNITY_Next.js SVG Asset|Next.js SVG Asset]]
- [[_COMMUNITY_Vercel SVG Asset|Vercel SVG Asset]]
- [[_COMMUNITY_Next.js Types Reference|Next.js Types Reference]]
- [[_COMMUNITY_ERC20 Standard ABI|ERC20 Standard ABI]]
- [[_COMMUNITY_Tag Defaults Config|Tag Defaults Config]]
- [[_COMMUNITY_Footer Component Logic|Footer Component Logic]]
- [[_COMMUNITY_Amount Tools Logic|Amount Tools Logic]]
- [[_COMMUNITY_Data Export Logic|Data Export Logic]]
- [[_COMMUNITY_Data Import Logic|Data Import Logic]]
- [[_COMMUNITY_Approvals Page Logic|Approvals Page Logic]]
- [[_COMMUNITY_Address Book Page Logic|Address Book Page Logic]]

## God Nodes (most connected - your core abstractions)
1. `writeItem()` - 8 edges
2. `getAllAddressBook()` - 6 edges
3. `getAllTokenList()` - 6 edges
4. `importUserData()` - 6 edges
5. `getDB()` - 5 edges
6. `readAll()` - 5 edges
7. `deleteItem()` - 5 edges
8. `exportUserData()` - 5 edges
9. `IndexedDB Storage Engine` - 5 edges
10. `getCustomRPCs()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `handleExport()` --calls--> `exportUserData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts
- `confirmImport()` --calls--> `importUserData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts
- `Navbar Component` --uses_logo--> `Sandwich Logo (Asset)`  [INFERRED]
  components/layout/Navbar.tsx → public/favicon.svg
- `createWagmiConfig()` --calls--> `getCustomRPCs()`  [INFERRED]
  config/wagmi.ts → lib/storage.ts
- `handleClear()` --calls--> `clearAllData()`  [INFERRED]
  app/settings/data/page.tsx → lib/storage.ts

## Hyperedges (group relationships)
- **Web3 Core Infrastructure** — config_wagmi, config_chains, provider_web3 [EXTRACTED 1.00]
- **Settings Modules** — page_settings_address_book, page_settings_tokens, page_settings_networks, page_settings_data [EXTRACTED 1.00]
- **Token Sending Tools** — page_send, page_multisend, page_approvals [INFERRED 0.90]
- **Application Settings System** — hook_usesettings, page_generalsettings, concept_localstorage [INFERRED 0.90]

## Communities

### Community 0 - "Storage Layer (IndexedDB)"
Cohesion: 0.19
Nodes (22): addAddressBookEntry(), addSavedToken(), clearAllData(), clearStore(), deleteItem(), exportUserData(), filterByScope(), getAddressBook() (+14 more)

### Community 1 - "Architectural Mandates"
Cohesion: 0.22
Nodes (10): Portfolio Page, Root Layout, Contract ABIs, Chain Configuration, Wagmi Config Factory, useMultiSend, ThemeProvider, Web3Provider (+2 more)

### Community 2 - "Address Input & Search"
Cohesion: 0.2
Nodes (10): Navbar Component, Non-Custodial Architecture, Sandwich Branding, Stateless Forwarder Contract, Approvals Page, Getting Started Page, Multi Send Page, Security Overview (+2 more)

### Community 3 - "Address Book Management"
Cohesion: 0.22
Nodes (9): AddressInput Component, LocalStorage Persistence, Custom RPC Configuration, useSettings Hook, Settings Layout, General Settings Page, Networks Page, Portfolio Page (+1 more)

### Community 4 - "Graphify Skill & Rules"
Cohesion: 0.29
Nodes (7): Popular Addresses, Address Book Tags, useAddressBook, RecipientList, AddressInput, FilterDropdown, SearchModal

### Community 5 - "Recipient List Handling"
Cohesion: 0.29
Nodes (3): Delegated Sending, Transfer From Tool, Utility Tools Hub

### Community 6 - "Data Import/Export UI"
Cohesion: 0.4
Nodes (4): handleReset(), handleSave(), RPC Validation Logic, Sandwich Branding

### Community 8 - "Multi-send Workflow"
Cohesion: 0.33
Nodes (6): Application Constants, IndexedDB Storage Engine, Address Book Settings, Data Management Settings, Network Configuration Settings, Saved Tokens Settings

### Community 9 - "Project Metadata (README)"
Cohesion: 0.4
Nodes (3): confirmImport(), handleClear(), handleExport()

### Community 11 - "Theme Management"
Cohesion: 0.67
Nodes (2): handleReviewAndSend(), validate()

### Community 12 - "Address Input UI Logic"
Cohesion: 0.5
Nodes (4): Sandwich Logo (Asset), Usage Guide Page, Navbar Component, Utility Tools Page

### Community 22 - "RPC Config Hook"
Cohesion: 1.0
Nodes (1): createWagmiConfig()

### Community 36 - "UI Assets & Icons"
Cohesion: 1.0
Nodes (2): IndexedDB Privacy Storage, Usage Guide Page

### Community 51 - "Documentation Page"
Cohesion: 1.0
Nodes (1): useRPCConfig

### Community 52 - "Security Info Page"
Cohesion: 1.0
Nodes (1): Footer

### Community 53 - "Token Detail Page"
Cohesion: 1.0
Nodes (1): ConnectButton

### Community 54 - "Getting Started Page"
Cohesion: 1.0
Nodes (1): AmountTools

### Community 55 - "Constant Definitions"
Cohesion: 1.0
Nodes (1): Settings Layout

### Community 56 - "Gas Efficiency (Feature)"
Cohesion: 1.0
Nodes (1): Donation Page

### Community 57 - "Non-Custodial (Feature)"
Cohesion: 1.0
Nodes (1): Technical Documentation

### Community 58 - "Atomic Execution (Feature)"
Cohesion: 1.0
Nodes (1): Gemini Instructions

### Community 59 - "Auto-Refund (Feature)"
Cohesion: 1.0
Nodes (1): Project README

### Community 60 - "Approval Logic (Feature)"
Cohesion: 1.0
Nodes (1): Settings Redirect

### Community 61 - "Globe SVG Asset"
Cohesion: 1.0
Nodes (1): Donate Layout

### Community 62 - "Next.js SVG Asset"
Cohesion: 1.0
Nodes (1): Agent Rules (AGENTS.md)

### Community 63 - "Vercel SVG Asset"
Cohesion: 1.0
Nodes (1): Agent Rules (CLAUDE.md)

### Community 64 - "Next.js Types Reference"
Cohesion: 1.0
Nodes (1): Next.js Configuration

### Community 65 - "ERC20 Standard ABI"
Cohesion: 1.0
Nodes (1): ESLint Configuration

### Community 66 - "Tag Defaults Config"
Cohesion: 1.0
Nodes (1): PostCSS Configuration

### Community 67 - "Footer Component Logic"
Cohesion: 1.0
Nodes (1): Globe Icon (Asset)

### Community 68 - "Amount Tools Logic"
Cohesion: 1.0
Nodes (1): Next.js Logo (Asset)

### Community 69 - "Data Export Logic"
Cohesion: 1.0
Nodes (1): Vercel Logo (Asset)

### Community 70 - "Data Import Logic"
Cohesion: 1.0
Nodes (1): Window Icon (Asset)

### Community 71 - "Approvals Page Logic"
Cohesion: 1.0
Nodes (1): File Icon (Asset)

### Community 73 - "Address Book Page Logic"
Cohesion: 1.0
Nodes (1): Utility Tools Page

## Knowledge Gaps
- **47 isolated node(s):** `useRPCConfig`, `ThemeProvider`, `Popular Addresses`, `Address Book Tags`, `FilterDropdown` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Theme Management`** (4 nodes): `page.tsx`, `createEmptyGroup()`, `handleReviewAndSend()`, `validate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RPC Config Hook`** (2 nodes): `createWagmiConfig()`, `wagmi.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Assets & Icons`** (2 nodes): `IndexedDB Privacy Storage`, `Usage Guide Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Documentation Page`** (1 nodes): `useRPCConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Security Info Page`** (1 nodes): `Footer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Token Detail Page`** (1 nodes): `ConnectButton`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Getting Started Page`** (1 nodes): `AmountTools`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Constant Definitions`** (1 nodes): `Settings Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gas Efficiency (Feature)`** (1 nodes): `Donation Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Non-Custodial (Feature)`** (1 nodes): `Technical Documentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Atomic Execution (Feature)`** (1 nodes): `Gemini Instructions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auto-Refund (Feature)`** (1 nodes): `Project README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Approval Logic (Feature)`** (1 nodes): `Settings Redirect`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe SVG Asset`** (1 nodes): `Donate Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js SVG Asset`** (1 nodes): `Agent Rules (AGENTS.md)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel SVG Asset`** (1 nodes): `Agent Rules (CLAUDE.md)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Types Reference`** (1 nodes): `Next.js Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ERC20 Standard ABI`** (1 nodes): `ESLint Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tag Defaults Config`** (1 nodes): `PostCSS Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer Component Logic`** (1 nodes): `Globe Icon (Asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Amount Tools Logic`** (1 nodes): `Next.js Logo (Asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Export Logic`** (1 nodes): `Vercel Logo (Asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Import Logic`** (1 nodes): `Window Icon (Asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Approvals Page Logic`** (1 nodes): `File Icon (Asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Address Book Page Logic`** (1 nodes): `Utility Tools Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getCustomRPCs()` connect `Storage Layer (IndexedDB)` to `RPC Config Hook`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `exportUserData()` connect `Storage Layer (IndexedDB)` to `Project Metadata (README)`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `importUserData()` connect `Storage Layer (IndexedDB)` to `Project Metadata (README)`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `useRPCConfig`, `ThemeProvider`, `Popular Addresses` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._