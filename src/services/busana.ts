// ============================================================
// Services — Busana Muslimah
// ============================================================
import type { Product } from '../types/busana';
import { products as mockProducts, collections as mockCollections } from '../data/busana';
import type { Collection } from '../types/busana';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ProductFilters {
  collection?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  isSale?: boolean;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(300);
  let results = [...mockProducts];
  if (filters?.collection) {
    results = results.filter((p) => p.collection === filters.collection);
  }
  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.isSale) {
    results = results.filter((p) => p.isSale);
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((p) => (p.salePrice ?? p.price) >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((p) => (p.salePrice ?? p.price) <= filters.maxPrice!);
  }
  return results;
}

export async function getProduct(slug: string): Promise<Product | null> {
  await delay(200);
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

export async function getCollections(): Promise<Collection[]> {
  await delay(200);
  return mockCollections;
}
