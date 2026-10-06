// ============================================================
// Types — Orders & Checkout
// ============================================================
import type { CartItem } from './busana';

export interface ShippingAddress {
  fullName?: string;
  name?: string;
  phone: string;
  address?: string;
  street?: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface CourierOption {
  id: string;
  name: string;
  service: string;
  price: number;
  estimatedDays: string;
}

export type PaymentMethodType = 'qris' | 'bca_va' | 'mandiri_va' | 'credit_card' | string;

export interface OrderItem {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    salePrice?: number;
    images?: string[];
  };
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  date: string;
  items: Array<CartItem | OrderItem>;
  shippingAddress: ShippingAddress;
  courier: CourierOption;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai';
  pointsEarned: number;
}
