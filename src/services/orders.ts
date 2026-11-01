// ============================================================
// Service — Orders, Status Transitions, Timeline & Invoices
// ============================================================
import type {
  Order,
  OrderStatus,
  OrderTimelineEvent,
  BusanaOrderStatus,
  KateringOrderStatus,
} from '../types/order';
import { generateRealisticOrders } from './seed';
import { productService } from './products';
import { logActivity } from './activity';
import { authService } from './auth';

const STORAGE_KEY_ORDERS = 'reamanda:orders_db';

export class OrderService {
  private ordersCache: Order[] | null = null;

  public async getOrders(filters?: {
    type?: 'all' | 'busana' | 'katering' | 'properti';
    status?: string;
    query?: string;
    customerId?: string;
  }): Promise<Order[]> {
    if (!this.ordersCache) {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (raw) {
        try {
          this.ordersCache = JSON.parse(raw);
        } catch {
          // Fall back to seed
        }
      }
      if (!this.ordersCache) {
        const users = await authService.getCustomers();
        const products = productService.getProducts();
        this.ordersCache = generateRealisticOrders(users, products);
        this.saveOrders(this.ordersCache);
      }
    }

    let result = [...this.ordersCache];

    if (filters?.customerId) {
      result = result.filter((o) => o.customerId === filters.customerId);
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((o) => o.type === filters.type);
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters?.query && filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const list = await this.getOrders();
    return list.find((o) => o.id === id) || null;
  }

  public saveOrders(orders: Order[]): void {
    this.ordersCache = orders;
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }

  public async createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'timeline'> & { id?: string }): Promise<Order> {
    const orders = await this.getOrders();
    const orderId = orderInput.id || `RM-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialTimeline: OrderTimelineEvent = {
      id: `tl-${orderId}-create`,
      status: orderInput.status,
      title: 'Pesanan Berhasil Dibuat',
      description: 'Menunggu konfirmasi pembayaran oleh pelanggan.',
      timestamp: new Date().toISOString(),
      actor: orderInput.customerName || 'Pelanggan',
    };

    const newOrder: Order = {
      ...orderInput,
      id: orderId,
      orderNumber: orderId,
      timeline: [initialTimeline],
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Decrement stock if busana items exist
    if (newOrder.type === 'busana' && Array.isArray(newOrder.items)) {
      const itemsToDecrement = newOrder.items.map((item: any) => ({
        productId: item.productId || item.product?.id,
        variantId: item.variantId,
        quantity: item.quantity || 1,
      })).filter((i: any) => Boolean(i.productId));

      productService.decrementStockForOrder(newOrder.id, itemsToDecrement);
    }

    logActivity({
      userId: newOrder.customerId || 'guest',
      userName: newOrder.customerName,
      userRole: 'customer',
      action: 'CREATE_ORDER',
      entityType: 'order',
      entityId: newOrder.id,
      entityName: newOrder.id,
      details: `Pesanan baru dibuat senilai Rp ${newOrder.total.toLocaleString('id-ID')}.`,
    });

    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    performedBy = 'Admin',
    trackingNumber?: string,
    courierName?: string,
    note?: string
  ): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Pesanan tidak ditemukan.');

    const currentOrder = orders[idx];
    const prevStatus = currentOrder.status;

    // Check cancellation -> return stock
    if (newStatus === 'Dibatalkan' && prevStatus !== 'Dibatalkan') {
      if (currentOrder.type === 'busana' && Array.isArray(currentOrder.items)) {
        const itemsToReturn = currentOrder.items.map((item: any) => ({
          productId: item.productId || item.product?.id,
          variantId: item.variantId,
          quantity: item.quantity || 1,
        })).filter((i: any) => Boolean(i.productId));

        productService.returnStockForCancelledOrder(currentOrder.id, itemsToReturn);
      }
    }

    // Append timeline event
    const newTimelineEvent: OrderTimelineEvent = {
      id: `tl-${orderId}-${Date.now()}`,
      status: newStatus,
      title: `Status diubah ke ${newStatus}`,
      description: note || `Pesanan dipindahkan statusnya ke tahap ${newStatus}.`,
      timestamp: new Date().toISOString(),
      actor: performedBy,
    };

    const isPaid = newStatus !== 'Menunggu Pembayaran' && newStatus !== 'Menunggu Konfirmasi' && newStatus !== 'Dibatalkan';

    const updatedOrder: Order = {
      ...currentOrder,
      status: newStatus,
      isPaid,
      paidAt: isPaid && !currentOrder.paidAt ? new Date().toISOString() : currentOrder.paidAt,
      trackingNumber: trackingNumber !== undefined ? trackingNumber : currentOrder.trackingNumber,
      courierName: courierName !== undefined ? courierName : currentOrder.courierName,
      internalNote: note !== undefined ? note : currentOrder.internalNote,
      timeline: [newTimelineEvent, ...(currentOrder.timeline || [])],
    };

    orders[idx] = updatedOrder;
    this.saveOrders(orders);

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'order',
      entityId: currentOrder.id,
      entityName: currentOrder.id,
      details: `Mengubah status pesanan ${currentOrder.id} dari "${prevStatus}" menjadi "${newStatus}".`,
      beforeState: { status: prevStatus },
      afterState: { status: newStatus },
    });

    return updatedOrder;
  }

  public async updateInternalNote(orderId: string, note: string, performedBy = 'Admin'): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Pesanan tidak ditemukan.');

    orders[idx].internalNote = note;
    this.saveOrders(orders);
    return orders[idx];
  }

  /**
   * Export orders list to CSV
   */
  public exportOrdersToCSV(orders: Order[]): string {
    const headers = [
      'Nomor Pesanan',
      'Tanggal',
      'Tipe',
      'Nama Pemesan',
      'WhatsApp / HP',
      'Kota Pengiriman',
      'Metode Pembayaran',
      'Status',
      'Total (Rp)',
      'Nomor Resi',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.date).toLocaleDateString('id-ID')}"`,
      `"${o.type}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.shippingAddress?.city || '-'}"`,
      `"${o.paymentMethod || '-'}"`,
      `"${o.status}"`,
      o.total,
      `"${o.trackingNumber || '-'}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const orderService = new OrderService();
