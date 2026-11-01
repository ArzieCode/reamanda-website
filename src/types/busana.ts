// ============================================================
// Busana Muslimah & Product Management — TypeScript Types
// ============================================================

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  type: 'in' | 'out' | 'adjustment' | 'order' | 'cancel_return';
  delta: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string; // orderId if applicable
  timestamp: string;
  performedBy: string; // user name
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: string;
  price: number;
  salePrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  images: string[];
  isNewArrival: boolean;
  isSale: boolean;
  isPublished: boolean; // false = Draf
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  material: string;
  care: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  stock?: number; // total computed stock
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: string[];
  sortOrder: number;
  isVisible: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface Voucher {
  code: string;
  description: string;
  minPurchase: number;
  expiry: string;
  discount: number;
  isPercentage?: boolean;
  type?: 'percent' | 'fixed';
}
