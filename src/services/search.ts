// ============================================================
// Services — Global Search
// Searches across Busana, Properti, and Katering
// ============================================================
import type { SearchResultItem } from '../types/search';
import { products } from '../data/busana';
import { properties } from '../data/properti';
import { packages } from '../data/katering';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const RECENT_SEARCHES_KEY = 'riamiranda_recent_searches';

export async function searchAll(query: string): Promise<SearchResultItem[]> {
  await delay(200);
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // 1. Search busana products
  products.forEach((p) => {
    if (
      p.name.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colors.some((c) => c.toLowerCase().includes(q))
    ) {
      results.push({
        id: `busana-${p.id}`,
        title: p.name,
        category: 'busana',
        subtitle: `${p.collection.toUpperCase()} · ${p.category}`,
        path: `/busana/produk/${p.slug}`,
        price: p.salePrice ?? p.price,
        imageLabel: p.name,
      });
    }
  });

  // 2. Search properties
  properties.forEach((prop) => {
    if (
      prop.name.toLowerCase().includes(q) ||
      prop.location.toLowerCase().includes(q) ||
      prop.type.toLowerCase().includes(q) ||
      prop.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: `properti-${prop.id}`,
        title: prop.name,
        category: 'properti',
        subtitle: `${prop.type} · ${prop.location}`,
        path: `/properti/${prop.id}`,
        price: prop.currentBid || prop.startingPrice,
        imageLabel: prop.name,
      });
    }
  });

  // 3. Search catering packages
  packages.forEach((pkg, index) => {
    if (
      pkg.name.toLowerCase().includes(q) ||
      pkg.description.toLowerCase().includes(q) ||
      pkg.inclusions.some((inc) => inc.toLowerCase().includes(q))
    ) {
      results.push({
        id: `katering-${index}`,
        title: pkg.name,
        category: 'katering',
        subtitle: `Paket Katering Mulai dari Rp ${pkg.price.toLocaleString('id-ID')}/${pkg.unit}`,
        path: `/katering`,
        price: pkg.price,
        imageLabel: pkg.name,
      });
    }
  });

  return results;
}

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return ['Luminara', 'Scarves', 'Ubud', 'Nasi Box'];
    return JSON.parse(raw);
  } catch {
    return ['Luminara', 'Scarves', 'Ubud', 'Nasi Box'];
  }
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();
  try {
    const existing = getRecentSearches().filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...existing].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [trimmed];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // ignore
  }
}
