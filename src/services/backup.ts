// ============================================================
// Service — Backup (Export / Import JSON with Images) & Demo Reset
// ============================================================
import { exportAllImageBlobs, importAllImageBlobs } from './idb';
import { createDemoUsers } from './seed';

const REAMANDA_PREFIX = 'reamanda:';

export interface SystemBackupData {
  version: string;
  exportedAt: string;
  storage: Record<string, string>;
  images: Record<string, string>; // base64 map
}

/**
 * Export full application data including IndexedDB images into a single JSON object
 */
export async function createFullBackup(): Promise<SystemBackupData> {
  const storageData: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(REAMANDA_PREFIX)) {
      storageData[key] = localStorage.getItem(key) || '';
    }
  }

  const images = await exportAllImageBlobs();

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    storage: storageData,
    images,
  };
}

/**
 * Download backup JSON file to browser
 */
export async function downloadBackupFile(): Promise<void> {
  const backup = await createFullBackup();
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reamanda-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Restore system state from backup JSON data
 */
export async function restoreFromBackup(backup: SystemBackupData): Promise<void> {
  if (!backup.storage) {
    throw new Error('Format berkas cadangan tidak valid.');
  }

  // 1. Restore localStorage
  for (const [key, value] of Object.entries(backup.storage)) {
    if (key.startsWith(REAMANDA_PREFIX)) {
      localStorage.setItem(key, value);
    }
  }

  // 2. Restore images to IndexedDB
  if (backup.images) {
    await importAllImageBlobs(backup.images);
  }
}

/**
 * Reset all demo data to pristine default state
 */
export async function resetAllDemoData(): Promise<void> {
  // Clear all reamanda localStorage items
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(REAMANDA_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  sessionStorage.clear();

  // Re-seed demo users
  await createDemoUsers();
}
