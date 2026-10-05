// ============================================================
// Services — Orders & Checkout
// ============================================================
import type { Order, CourierOption } from '../types/order';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ORDERS_STORAGE_KEY = 'riamiranda_orders';

export const COURIER_OPTIONS: CourierOption[] = [
  { id: 'jne_reg', name: 'JNE Express', service: 'Reguler (2-3 Hari)', price: 18000, estimatedDays: '2-3 hari' },
  { id: 'sicepat_best', name: 'SiCepat', service: 'BEST (1-2 Hari)', price: 24000, estimatedDays: '1-2 hari' },
  { id: 'paxel_same', name: 'Paxel', service: 'Sameday Delivery', price: 32000, estimatedDays: 'Hari ini' },
];

export async function getOrders(userId?: string): Promise<Order[]> {
  await delay(200);
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const orders: Order[] = JSON.parse(raw);
    if (userId) {
      return orders.filter((o) => o.userId === userId);
    }
    return orders;
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay(150);
  try {
    const orders = await getOrders();
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) ?? null;
  } catch {
    return null;
  }
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'pointsEarned'>): Promise<Order> {
  await delay(600);
  const now = new Date();
  const orderNumber = `RM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Calculate points earned (1 point per Rp 10.000 spent)
  const pointsEarned = Math.floor(orderInput.total / 10000);

  const newOrder: Order = {
    ...orderInput,
    id: `ord_${Date.now()}`,
    orderNumber,
    date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'Diproses',
    pointsEarned,
  };

  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([newOrder, ...existing]));
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
  }

  return newOrder;
}
