// ============================================================
// Service — IndexedDB Storage for Image Assets & Blobs
// ============================================================
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'reamanda-cms-db';
const DB_VERSION = 1;
const STORE_IMAGES = 'image_blobs';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_IMAGES)) {
          db.createObjectStore(STORE_IMAGES);
        }
      },
    });
  }
  return dbPromise;
}

const memoryObjectUrlCache = new Map<string, string>();

/**
 * Save image Blob/File to IndexedDB
 */
export async function saveImageBlob(id: string, blob: Blob): Promise<string> {
  try {
    const db = await getDb();
    await db.put(STORE_IMAGES, blob, id);
    // Create and cache object URL
    const url = URL.createObjectURL(blob);
    memoryObjectUrlCache.set(id, url);
    return url;
  } catch (err) {
    console.error('Failed to save image blob to IndexedDB:', err);
    throw err; // A temporary object URL is not durable; let the upload UI report failure.
  }
}

/**
 * Get Image Blob from IndexedDB
 */
export async function getImageBlob(id: string): Promise<Blob | null> {
  try {
    const db = await getDb();
    const blob = await db.get(STORE_IMAGES, id);
    return blob || null;
  } catch (err) {
    console.error('Failed to get image blob from IndexedDB:', err);
    return null;
  }
}

/**
 * Get displayable URL for image ID
 */
export async function getImageUrl(id: string): Promise<string | null> {
  if (memoryObjectUrlCache.has(id)) {
    return memoryObjectUrlCache.get(id)!;
  }
  const blob = await getImageBlob(id);
  if (blob) {
    const url = URL.createObjectURL(blob);
    memoryObjectUrlCache.set(id, url);
    return url;
  }
  return null;
}

/**
 * Delete image from IndexedDB
 */
export async function deleteImageBlob(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.delete(STORE_IMAGES, id);
    if (memoryObjectUrlCache.has(id)) {
      URL.revokeObjectURL(memoryObjectUrlCache.get(id)!);
      memoryObjectUrlCache.delete(id);
    }
  } catch (err) {
    console.error('Failed to delete image blob:', err);
  }
}

/**
 * Convert Blob to Base64 data string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert Base64 data string to Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Export all stored image blobs as a Base64 map for JSON backup
 */
export async function exportAllImageBlobs(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const store = tx.objectStore(STORE_IMAGES);
    const keys = await store.getAllKeys();
    const result: Record<string, string> = {};

    for (const key of keys) {
      const blob = await store.get(key);
      if (blob) {
        result[key.toString()] = await blobToBase64(blob);
      }
    }
    return result;
  } catch (err) {
    console.error('Export all image blobs failed:', err);
    return {};
  }
}

/**
 * Import a Base64 map into IndexedDB
 */
export async function importAllImageBlobs(images: Record<string, string>): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    for (const [id, base64] of Object.entries(images)) {
      const blob = base64ToBlob(base64);
      await store.put(blob, id);
    }
    await tx.done;
  } catch (err) {
    console.error('Import all image blobs failed:', err);
  }
}
