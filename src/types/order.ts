// ============================================================
// Types — Orders, Invoices & Timelines
// ============================================================
import type { CartItem } from './busana';

export type BusanaOrderStatus =
  | 'Menunggu Pembayaran'
  | 'Dibayar'
  | 'Diproses'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan';

export type KateringOrderStatus =
  | 'Menunggu Konfirmasi'
  | 'Dikonfirmasi'
  | 'Diproses'
  | 'Diantar'
  | 'Selesai'
  | 'Dibatalkan';

export type OrderStatus = BusanaOrderStatus | KateringOrderStatus;

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

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string; // "Sistem", "Admin", etc.
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  size: string;
  color: string;
  sku?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string; // e.g. RM-8921 or RM-CTR-102
  orderNumber: string;
  type: 'busana' | 'katering' | 'properti';
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  date: string; // ISO date
  items: Array<CartItem | OrderItem>;
  shippingAddress: ShippingAddress;
  courier?: CourierOption;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  trackingNumber?: string; // nomor resi pengiriman
  courierName?: string;
  internalNote?: string;
  isPaid: boolean;
  paidAt?: string;
  pointsEarned?: number;
}
