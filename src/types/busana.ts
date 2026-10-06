// ============================================================
// Busana Muslimah — TypeScript Types
// ============================================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  isNewArrival: boolean;
  isSale: boolean;
  sizes: string[];
  colors: string[];
  material: string;
  care: string;
  description: string;
  stock?: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price?: number;
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
