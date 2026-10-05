// ============================================================
// Types — Orders & Checkout
// ============================================================
import type { CartItem } from './busana';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
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

export type PaymentMethodType = 'qris' | 'bca_va' | 'mandiri_va' | 'credit_card';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  date: string;
  items: CartItem[];
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
