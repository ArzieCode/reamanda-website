// ============================================================
// Service — Products, Variants, Stock Movements & Categories
// ============================================================
import type {
  Product,
  ProductVariant,
  StockMovement,
  ProductCategory,
  Collection,
} from '../types/busana';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
} from './seed';
import { logActivity } from './activity';

const STORAGE_KEY_PRODUCTS = 'reamanda:products_db';
const STORAGE_KEY_STOCK_MOVEMENTS = 'reamanda:stock_movements';
const STORAGE_KEY_CATEGORIES = 'reamanda:categories_db';
const STORAGE_KEY_COLLECTIONS = 'reamanda:collections_db';

export class ProductService {
  // 1. Categories
  public getCategories(): ProductCategory[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public saveCategory(cat: ProductCategory): ProductCategory {
    const list = this.getCategories();
    const idx = list.findIndex((c) => c.id === cat.id);
    if (idx !== -1) {
      list[idx] = cat;
    } else {
      list.push(cat);
    }
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
    return cat;
  }

  public deleteCategory(id: string): void {
    const list = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
  }

  // 2. Collections
  public getCollections(): Collection[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
      return raw ? JSON.parse(raw) : INITIAL_COLLECTIONS;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  }

  public saveCollection(col: Collection): Collection {
    const list = this.getCollections();
    const idx = list.findIndex((c) => c.id === col.id);
    if (idx !== -1) {
      list[idx] = col;
    } else {
      list.push(col);
    }
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(list));
    return col;
  }

  // 3. Products CRUD
  public getProducts(options?: {
    publishedOnly?: boolean;
    category?: string;
    collection?: string;
    query?: string;
    status?: 'all' | 'published' | 'draft';
    stockFilter?: 'all' | 'low' | 'out_of_stock' | 'in_stock';
  }): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      let list: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;

      if (options?.publishedOnly) {
        list = list.filter((p) => p.isPublished);
      }
      if (options?.status === 'published') {
        list = list.filter((p) => p.isPublished);
      } else if (options?.status === 'draft') {
        list = list.filter((p) => !p.isPublished);
      }

      if (options?.category && options.category !== 'all') {
        list = list.filter((p) => p.category.toLowerCase().includes(options.category!.toLowerCase()));
      }
      if (options?.collection && options.collection !== 'all') {
        list = list.filter((p) => p.collection.toLowerCase().includes(options.collection!.toLowerCase()));
      }
      if (options?.query && options.query.trim()) {
        const q = options.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q) ||
            p.variants?.some((v) => v.sku.toLowerCase().includes(q))
        );
      }

      if (options?.stockFilter) {
        if (options.stockFilter === 'low') {
          list = list.filter((p) => {
            const stock = this.getProductTotalStock(p);
            return stock <= 5 && stock > 0;
          });
        } else if (options.stockFilter === 'out_of_stock') {
          list = list.filter((p) => this.getProductTotalStock(p) === 0);
        } else if (options.stockFilter === 'in_stock') {
          list = list.filter((p) => this.getProductTotalStock(p) > 5);
        }
      }

      return list;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public getProductById(id: string): Product | null {
    const list = this.getProducts();
    return list.find((p) => p.id === id) || null;
  }

  public getProductBySlug(slug: string): Product | null {
    const list = this.getProducts();
    return list.find((p) => p.slug === slug) || null;
  }

  public getProductTotalStock(product: Product): number {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
    return product.stock || 0;
  }

  public saveProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { id?: string; slug?: string }, performedBy = 'Admin'): Product {
    const list = this.getProducts();
    const now = new Date().toISOString();

    // Auto-generate slug if missing
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0;

    if (product.id) {
      const idx = list.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const updated: Product = {
          ...list[idx],
          ...product,
          id: product.id,
          slug,
          stock: totalStock,
          updatedAt: now,
        };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));

        logActivity({
          userId: 'staff',
          userName: performedBy,
          userRole: 'admin',
          action: 'UPDATE_PRODUCT',
          entityType: 'product',
          entityId: updated.id,
          entityName: updated.name,
          details: `Memperbarui produk ${updated.name} (stok total: ${totalStock}).`,
        });

        return updated;
      }
    }

    const created: Product = {
      ...product,
      id: `p-${Date.now()}`,
      slug,
      stock: totalStock,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'CREATE_PRODUCT',
      entityType: 'product',
      entityId: created.id,
      entityName: created.name,
      details: `Menambahkan produk baru: ${created.name}.`,
    });

    return created;
  }

  public duplicateProduct(id: string, performedBy = 'Admin'): Product {
    const prod = this.getProductById(id);
    if (!prod) throw new Error('Produk tidak ditemukan.');

    const copy: Product = {
      ...prod,
      id: `p-${Date.now()}`,
      name: `${prod.name} (Salinan)`,
      slug: `${prod.slug}-salinan-${Date.now()}`,
      isPublished: false, // Draf by default
      variants: prod.variants?.map((v, i) => ({
        ...v,
        id: `v-${Date.now()}-${i}`,
        sku: `${v.sku}-CPY`,
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const list = this.getProducts();
    list.unshift(copy);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'DUPLICATE_PRODUCT',
      entityType: 'product',
      entityId: copy.id,
      entityName: copy.name,
      details: `Menduplikasi produk ${prod.name} menjadi draf.`,
    });

    return copy;
  }

  public deleteProduct(id: string, performedBy = 'Admin'): Product {
    const list = this.getProducts();
    const prod = list.find((p) => p.id === id);
    if (!prod) throw new Error('Produk tidak ditemukan.');

    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(filtered));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'DELETE_PRODUCT',
      entityType: 'product',
      entityId: prod.id,
      entityName: prod.name,
      details: `Menghapus produk ${prod.name}.`,
    });

    return prod;
  }

  public restoreProduct(prod: Product): void {
    const list = this.getProducts();
    list.unshift(prod);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }

  public bulkToggleVisibility(ids: string[], isPublished: boolean): void {
    const list = this.getProducts();
    for (const p of list) {
      if (ids.includes(p.id)) {
        p.isPublished = isPublished;
      }
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }

  public bulkDelete(ids: string[]): Product[] {
    const list = this.getProducts();
    const deleted = list.filter((p) => ids.includes(p.id));
    const kept = list.filter((p) => !ids.includes(p.id));
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(kept));
    return deleted;
  }

  // 4. Stock Adjustments & Movements
  public getStockMovements(productId?: string): StockMovement[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STOCK_MOVEMENTS);
      const list: StockMovement[] = raw ? JSON.parse(raw) : [];
      if (productId) {
        return list.filter((m) => m.productId === productId);
      }
      return list;
    } catch {
      return [];
    }
  }

  public adjustStock(params: {
    productId: string;
    variantId?: string;
    delta: number;
    reason: string;
    type: StockMovement['type'];
    referenceId?: string;
    performedBy?: string;
  }): void {
    const { productId, variantId, delta, reason, type, referenceId, performedBy = 'Sistem' } = params;
    const list = this.getProducts();
    const product = list.find((p) => p.id === productId);
    if (!product) return;

    let previousStock = 0;
    let newStock = 0;
    let variantLabel = '';

    if (variantId && product.variants) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        previousStock = variant.stock || 0;
        newStock = Math.max(0, previousStock + delta);
        variant.stock = newStock;
        variantLabel = `${variant.size} / ${variant.color}`;
      }
    } else {
      previousStock = product.stock || 0;
      newStock = Math.max(0, previousStock + delta);
      product.stock = newStock;
    }

    product.stock = this.getProductTotalStock(product);
    product.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));

    // Record movement
    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName: product.name,
      variantId,
      variantLabel,
      type,
      delta,
      previousStock,
      newStock,
      reason,
      referenceId,
      timestamp: new Date().toISOString(),
      performedBy,
    };

    const movements = this.getStockMovements();
    movements.unshift(movement);
    localStorage.setItem(STORAGE_KEY_STOCK_MOVEMENTS, JSON.stringify(movements.slice(0, 500)));
  }

  /**
   * Automatic decrement upon placing order
   */
  public decrementStockForOrder(orderId: string, items: Array<{ productId: string; variantId?: string; quantity: number }>): void {
    for (const item of items) {
      this.adjustStock({
        productId: item.productId,
        variantId: item.variantId,
        delta: -Math.abs(item.quantity),
        reason: `Pengurangan otomatis pesanan ${orderId}`,
        type: 'order',
        referenceId: orderId,
        performedBy: 'Sistem Pesanan',
      });
    }
  }

  /**
   * Automatic stock return upon cancelling order
   */
  public returnStockForCancelledOrder(orderId: string, items: Array<{ productId: string; variantId?: string; quantity: number }>): void {
    for (const item of items) {
      this.adjustStock({
        productId: item.productId,
        variantId: item.variantId,
        delta: Math.abs(item.quantity),
        reason: `Pengembalian stok pembatalan pesanan ${orderId}`,
        type: 'cancel_return',
        referenceId: orderId,
        performedBy: 'Sistem Pembatalan',
      });
    }
  }
}

export const productService = new ProductService();
