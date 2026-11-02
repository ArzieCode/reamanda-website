import { CLIENT_PHOTOS, type ClientPhoto } from '../data/client-photos';

export type ClientGalleryKind = 'kost' | 'lunchBox' | 'snackBox';

// Browser-local CMS storage. An explicit empty array is intentional (do not restore defaults).
const keyFor = (kind: ClientGalleryKind) => `reamanda:client-gallery:${kind}`;
const polishedSources = new Set(Object.values(CLIENT_PHOTOS).flat().map((photo) => photo.src));

export function polishedClientPhotoSrc(src: string): string {
  const polished = src.replace(/^\/client-photos\//, '/client-photos/polished/');
  return polishedSources.has(polished) ? polished : src;
}

export const clientGalleryService = {
  getPhotos(kind: ClientGalleryKind): ClientPhoto[] {
    try {
      const raw = localStorage.getItem(keyFor(kind));
      if (raw === null) return [...CLIENT_PHOTOS[kind]];
      const photos: unknown = JSON.parse(raw);
      if (!Array.isArray(photos)) return [...CLIENT_PHOTOS[kind]];
      return photos.filter((photo): photo is ClientPhoto =>
        photo !== null && typeof photo === 'object' &&
        typeof photo.src === 'string' && photo.src.length > 0 &&
        typeof photo.alt === 'string'
      ).map((photo) => {
        // Upgrade only the known Drive photos; keep admin uploads, descriptions,
        // order, deletions, and intentionally empty galleries untouched.
        return { ...photo, src: polishedClientPhotoSrc(photo.src) };
      });
    } catch {
      return [...CLIENT_PHOTOS[kind]];
    }
  },
  savePhotos(kind: ClientGalleryKind, photos: ClientPhoto[]): void {
    localStorage.setItem(keyFor(kind), JSON.stringify(photos));
  },
};
