// Persistent Storage & Backup Engine for SIAKAL V2
// Politeknik Transportasi SDP Palembang
// Two-tier persistence: Synchronous LocalStorage + Asynchronous IndexedDB + JSON Backup/Restore

import { initialProdiList, initialAccounts, ProdiItem, UserAccount } from './mockStore';
import { DEFAULT_POLTEKTRANS_LOGO, DEFAULT_BACKGROUND_SLIDES } from './defaultBranding';

export const STORAGE_KEYS = {
  PRODIS: 'siakal_prodi_list',
  USERS: 'siakal_user_list',
  PERIODES: 'siakal_periode_list',
  MAGANG_GROUPS: 'siakal_magang_groups',
  MAGANG_LOGS: 'siakal_magang_activity_logs',
  PRALA_DATA: 'siakal_prala_student_data',
  CUSTOM_LOGO: 'siakal_custom_logo',
  CUSTOM_BGS: 'siakal_custom_backgrounds',
  GOOGLE_DRIVE: 'siakal_google_drive_config',
} as const;

// ----------------------------------------------------
// IndexedDB Engine (Survives typical cache wipes)
// ----------------------------------------------------
const IDB_NAME = 'SIAKAL_V2_DB';
const IDB_STORE = 'collections';
const IDB_VERSION = 1;

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function idbSet(key: string, value: any): Promise<boolean> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

// ----------------------------------------------------
// Synchronous LocalStorage Helpers with IDB Background Sync
// ----------------------------------------------------
export function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      const parsed = JSON.parse(item);
      return parsed;
    }
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key} from localStorage`, err);
  }
  return fallback;
}

export function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[Storage] LocalStorage quota error for ${key}:`, err);
  }
  // Asynchronously mirror to IndexedDB for safety
  idbSet(key, value).catch(() => {});
}

// ----------------------------------------------------
// Domain Specific Accessors
// ----------------------------------------------------

export function getProdiList(): ProdiItem[] {
  return getStoredItem<ProdiItem[]>(STORAGE_KEYS.PRODIS, initialProdiList);
}

export function saveProdiList(list: ProdiItem[]): void {
  setStoredItem(STORAGE_KEYS.PRODIS, list);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('siakal_prodis_updated'));
  }
}

export function getUserList(): UserAccount[] {
  return getStoredItem<UserAccount[]>(STORAGE_KEYS.USERS, initialAccounts);
}

export function saveUserList(list: UserAccount[]): void {
  setStoredItem(STORAGE_KEYS.USERS, list);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('siakal_users_updated'));
  }
}

export function getAppLogo(): string {
  if (typeof window === 'undefined') return DEFAULT_POLTEKTRANS_LOGO;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_LOGO);
    if (stored && stored.trim().length > 0) return stored;
  } catch (e) {}
  return DEFAULT_POLTEKTRANS_LOGO;
}

export function saveAppLogo(logoUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (logoUrl && logoUrl.trim().length > 0 && logoUrl !== DEFAULT_POLTEKTRANS_LOGO) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LOGO, logoUrl);
      idbSet(STORAGE_KEYS.CUSTOM_LOGO, logoUrl).catch(() => {});
    } else {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_LOGO);
      idbSet(STORAGE_KEYS.CUSTOM_LOGO, '').catch(() => {});
    }
    window.dispatchEvent(new Event('siakal_branding_updated'));
  } catch (e) {
    console.error('[Storage] Error saving logo:', e);
  }
}

export function getAppBackgrounds(): string[] {
  return getStoredItem<string[]>(STORAGE_KEYS.CUSTOM_BGS, DEFAULT_BACKGROUND_SLIDES);
}

export function saveAppBackgrounds(slides: string[]): void {
  setStoredItem(STORAGE_KEYS.CUSTOM_BGS, slides);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('siakal_branding_updated'));
  }
}

// ----------------------------------------------------
// Database Backup & Restore (.json)
// ----------------------------------------------------

export interface DatabaseBackupPayload {
  system: 'SIAKAL_V2';
  campus: 'Politeknik Transportasi SDP Palembang';
  version: string;
  exportedAt: string;
  collections: {
    prodis: ProdiItem[];
    users: UserAccount[];
    periodes?: any[];
    magangGroups?: any[];
    magangLogs?: any[];
    pralaData?: any;
    customLogo?: string;
    customBackgrounds?: string[];
  };
}

export function exportDatabaseBackup(): void {
  if (typeof window === 'undefined') return;

  const payload: DatabaseBackupPayload = {
    system: 'SIAKAL_V2',
    campus: 'Politeknik Transportasi SDP Palembang',
    version: '2.1.0',
    exportedAt: new Date().toISOString(),
    collections: {
      prodis: getProdiList(),
      users: getUserList(),
      periodes: getStoredItem(STORAGE_KEYS.PERIODES, []),
      magangGroups: getStoredItem(STORAGE_KEYS.MAGANG_GROUPS, []),
      magangLogs: getStoredItem(STORAGE_KEYS.MAGANG_LOGS, []),
      pralaData: getStoredItem(STORAGE_KEYS.PRALA_DATA, null),
      customLogo: getAppLogo(),
      customBackgrounds: getAppBackgrounds(),
    },
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const nowStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = url;
  a.download = `SIAKAL_V2_BACKUP_${nowStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreDatabaseBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.system || data.system !== 'SIAKAL_V2' || !data.collections) {
      return { success: false, message: 'Format berkas cadangan tidak valid untuk SIAKAL V2.' };
    }

    const cols = data.collections;
    if (Array.isArray(cols.prodis)) saveProdiList(cols.prodis);
    if (Array.isArray(cols.users)) saveUserList(cols.users);
    if (Array.isArray(cols.periodes)) setStoredItem(STORAGE_KEYS.PERIODES, cols.periodes);
    if (Array.isArray(cols.magangGroups)) setStoredItem(STORAGE_KEYS.MAGANG_GROUPS, cols.magangGroups);
    if (Array.isArray(cols.magangLogs)) setStoredItem(STORAGE_KEYS.MAGANG_LOGS, cols.magangLogs);
    if (cols.pralaData) setStoredItem(STORAGE_KEYS.PRALA_DATA, cols.pralaData);
    if (cols.customLogo) saveAppLogo(cols.customLogo);
    if (Array.isArray(cols.customBackgrounds)) saveAppBackgrounds(cols.customBackgrounds);

    return {
      success: true,
      message: `Database berhasil dipulihkan! Total: ${cols.prodis?.length ?? 0} Prodi, ${cols.users?.length ?? 0} Pengguna.`,
    };
  } catch (err: any) {
    return { success: false, message: `Gagal memulihkan cadangan: ${err.message}` };
  }
}
