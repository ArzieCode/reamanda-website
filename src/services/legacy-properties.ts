import type { Property } from '../types/properti';

// Remove only the untouched sample units from the old demo. Keep any admin
// changes and honour an intentionally empty saved collection.
const legacySamples = new Map([
  ['prop-1', ['D’Rhea Syariah Guest House — Kamar Suite Marwah', 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan']],
  ['prop-2', ['Kost Eksklusif Safa — Paviliun Lantai 2', 'Jl. Gandaria Tengah IV No. 12, Jakarta Selatan']],
  ['prop-3', ['D’Rhea Deluxe Room 102 — Akses Taman', 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan']],
  ['prop-4', ['Studio Syariah Annisa — View Kota', 'Jl. Cikajang No. 8, Kebayoran Baru']],
  ['prop-5', ['Paviliun Melati Khusus Karyawati', 'Jl. Wijaya IX No. 3, Jakarta Selatan']],
  ['prop-6', ['Ruang Serbaguna & Butik Rea Manda', 'Jl. Senopati No. 45, Kebayoran Baru']],
]);

export function migrateLegacyProperties<T extends Pick<Property, 'id' | 'name' | 'location' | 'images'>>(
  stored: T[],
  defaults: T[],
): T[] {
  const retained = stored.filter((property) => {
    const legacy = legacySamples.get(property.id);
    return !legacy || property.name !== legacy[0] || property.location !== legacy[1]
      || !property.images[0]?.startsWith('https://images.unsplash.com/');
  });
  if (retained.length === stored.length) return stored;
  return [...defaults.filter((property) => !retained.some((item) => item.id === property.id)), ...retained];
}
