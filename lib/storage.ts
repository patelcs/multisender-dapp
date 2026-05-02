/**
 * ============================================
 *  INDEXEDDB — Address Book & Token List
 * ============================================
 *
 * All data is stored in the browser's IndexedDB.
 *
 * Scoping:
 *   - "global" entries are visible to everyone (no wallet needed)
 *   - "user"   entries are visible only when the ownerAddress matches
 *              the currently connected wallet
 */

// ─── Types ──────────────────────────────────────────────────────

export interface AddressBookEntry {
  id: string;
  label: string;
  address: string;
  scope: "global" | "user";
  ownerAddress?: string;
  chainId?: number; // If undefined, applies to all chains
  tags: string[];
  createdAt: number;
}

export interface SavedToken {
  id: string;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  scope: "global" | "user";
  ownerAddress?: string;
  createdAt: number;
}

export interface CustomRPC {
  chainId: number;
  url: string;
  updatedAt: number;
}

export interface AppSettings {
  portfolioShowZeroBalances: boolean;
  defaultTokenSourceFilter: "all" | "popular" | "personal";
  defaultAddressSourceFilter: "all" | "popular" | "personal";
}

export interface ExportData {
  version: 1 | 2 | 3;
  exportedAt: number;
  addressBook?: AddressBookEntry[];
  tokenList?: SavedToken[];
  rpcConfig?: CustomRPC[];
  settings?: AppSettings;
}

// ─── DB Config ──────────────────────────────────────────────────

const DB_NAME = "SandwichDB";
const DB_VERSION = 2; // Bumped to 2 for RPC config
const ADDR_STORE = "address_book";
const TOKEN_STORE = "token_list";
const RPC_STORE = "rpc_config";
const SETTINGS_KEY = "sandwich_settings";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("IndexedDB is not available in SSR"));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(ADDR_STORE)) {
        db.createObjectStore(ADDR_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(TOKEN_STORE)) {
        db.createObjectStore(TOKEN_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(RPC_STORE)) {
        db.createObjectStore(RPC_STORE, { keyPath: "chainId" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Generic DB Helpers ─────────────────────────────────────────

async function readAll<T>(storeName: string): Promise<T[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function writeItem<T>(storeName: string, item: T): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function deleteItem(storeName: string, id: string | number): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function clearStore(storeName: string): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** Filter entries to only global + matching user */
function filterByScope<T extends { scope: string; ownerAddress?: string }>(
  entries: T[],
  userAddress?: string
): T[] {
  return entries.filter(
    (e) =>
      e.scope === "global" ||
      (e.scope === "user" && userAddress && e.ownerAddress?.toLowerCase() === userAddress.toLowerCase())
  );
}

// ─── Address Book ───────────────────────────────────────────────

export async function getAllAddressBook(): Promise<AddressBookEntry[]> {
  return readAll<AddressBookEntry>(ADDR_STORE);
}

export async function getAddressBook(userAddress?: string, chainId?: number): Promise<AddressBookEntry[]> {
  const all = await getAllAddressBook();
  return filterByScope(all, userAddress).filter(
    (e) => e.chainId === undefined || e.chainId === chainId
  );
}

export async function addAddressBookEntry(
  entry: Omit<AddressBookEntry, "id" | "createdAt">
): Promise<AddressBookEntry> {
  const newEntry: AddressBookEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    tags: entry.tags || [],
  };
  await writeItem(ADDR_STORE, newEntry);
  return newEntry;
}

export async function updateAddressBookEntry(
  id: string,
  updates: Partial<Pick<AddressBookEntry, "label" | "address" | "scope" | "tags" | "chainId">>
): Promise<void> {
  const all = await getAllAddressBook();
  const existing = all.find((e) => e.id === id);
  if (!existing) return;
  await writeItem(ADDR_STORE, { ...existing, ...updates });
}

export async function removeAddressBookEntry(id: string): Promise<void> {
  await deleteItem(ADDR_STORE, id);
}

// ─── Saved Tokens ───────────────────────────────────────────────

export async function getAllTokenList(): Promise<SavedToken[]> {
  return readAll<SavedToken>(TOKEN_STORE);
}

export async function getTokenList(chainId: number, userAddress?: string): Promise<SavedToken[]> {
  const all = await getAllTokenList();
  return filterByScope(all, userAddress).filter((t) => t.chainId === chainId);
}

export async function addSavedToken(token: Omit<SavedToken, "id" | "createdAt">): Promise<SavedToken> {
  const newToken: SavedToken = {
    ...token,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await writeItem(TOKEN_STORE, newToken);
  return newToken;
}

export async function updateSavedToken(
  id: string,
  updates: Partial<Pick<SavedToken, "name" | "symbol" | "decimals" | "scope">>
): Promise<void> {
  const all = await getAllTokenList();
  const existing = all.find((t) => t.id === id);
  if (!existing) return;
  await writeItem(TOKEN_STORE, { ...existing, ...updates });
}

export async function removeSavedToken(id: string): Promise<void> {
  await deleteItem(TOKEN_STORE, id);
}

// ─── RPC Config ───────────────────────────────────────────────

export async function getCustomRPCs(): Promise<CustomRPC[]> {
  return readAll<CustomRPC>(RPC_STORE);
}

export async function setCustomRPC(chainId: number, url: string): Promise<void> {
  await writeItem(RPC_STORE, {
    chainId,
    url,
    updatedAt: Date.now(),
  });
}

export async function removeCustomRPC(chainId: number): Promise<void> {
  await deleteItem(RPC_STORE, chainId);
}

// ─── Export / Import ────────────────────────────────────────────

/**
 * Export all data as a JSON-serialisable object.
 * Includes global data and user-specific data across all wallets.
 */
export async function exportUserData(): Promise<ExportData> {
  let settings: AppSettings | undefined;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) settings = JSON.parse(stored);
  } catch (e) {
    console.error("Failed to export settings", e);
  }

  return {
    version: 3,
    exportedAt: Date.now(),
    addressBook: await getAllAddressBook(),
    tokenList: await getAllTokenList(),
    rpcConfig: await getCustomRPCs(),
    settings,
  };
}

/**
 * Import data from a JSON blob, merging into existing data.
 * Deduplicates by (address) for address book and (address + chainId) for tokens.
 * Returns counts of imported items.
 */
export async function importUserData(data: ExportData): Promise<{
  addressBookAdded: number;
  tokensAdded: number;
  rpcsAdded: number;
  settingsImported: boolean;
}> {
  let addressBookAdded = 0;
  let tokensAdded = 0;
  let rpcsAdded = 0;
  let settingsImported = false;

  // Address book
  const existingAddrs = await getAllAddressBook();
  const existingAddrSet = new Set(existingAddrs.map((e) => e.address.toLowerCase()));

  for (const entry of data.addressBook ?? []) {
    if (!existingAddrSet.has(entry.address.toLowerCase())) {
      await writeItem(ADDR_STORE, { ...entry, id: crypto.randomUUID(), createdAt: Date.now() });
      existingAddrSet.add(entry.address.toLowerCase());
      addressBookAdded++;
    }
  }

  // Token list
  const existingTokens = await getAllTokenList();
  const existingTokenSet = new Set(existingTokens.map((t) => `${t.chainId}:${t.address.toLowerCase()}`));

  for (const token of data.tokenList ?? []) {
    const key = `${token.chainId}:${token.address.toLowerCase()}`;
    if (!existingTokenSet.has(key)) {
      await writeItem(TOKEN_STORE, { ...token, id: crypto.randomUUID(), createdAt: Date.now() });
      existingTokenSet.add(key);
      tokensAdded++;
    }
  }

  // RPC config
  for (const rpc of data.rpcConfig ?? []) {
    await setCustomRPC(rpc.chainId, rpc.url);
    rpcsAdded++;
  }

  // Settings
  if (data.settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
      settingsImported = true;
    } catch (e) {
      console.error("Failed to import settings", e);
    }
  }

  return { addressBookAdded, tokensAdded, rpcsAdded, settingsImported };
}

/**
 * Validate that a parsed JSON object looks like valid ExportData.
 */
export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1 && d.version !== 2 && d.version !== 3) return false;
  if (!Array.isArray(d.addressBook) && !Array.isArray(d.tokenList) && !d.settings) return false;
  return true;
}

/** Nuke everything. */
export async function clearAllData(): Promise<void> {
  await clearStore(ADDR_STORE);
  await clearStore(TOKEN_STORE);
  await clearStore(RPC_STORE);
}
