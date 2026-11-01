// ============================================================
// Service — Pure Analytics & Sales Metrics (Zero side-effects)
// ============================================================
import type { Order, OrderStatus } from '../types/order';
import type { User } from '../types/auth';
import type { Property } from '../types/properti';
import type { CateringInquiry } from '../types/katering';
import type { Product } from '../types/busana';

export type AnalyticsPeriod = '7d' | '30d' | 'this_month' | '90d';

export interface PeriodDateRange {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
  daysCount: number;
}

export interface MetricComparison {
  current: number;
  previous: number;
  percentageChange: number; // e.g. 18.5 for +18.5%
  direction: 'up' | 'down' | 'same';
}

export interface DailySalesPoint {
  dateKey: string; // e.g. "12 Okt"
  fullDate: string;
  currentRevenue: number;
  previousRevenue: number;
}

export interface BestSellingProductItem {
  id: string;
  name: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface CategorySalesSlice {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

export interface OrderStatusBreakdown {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface BusinessLineMetric {
  line: 'Busana' | 'Katering' | 'Properti';
  label: string;
  value: number; // revenue or bid potential
  isPotential?: boolean;
}

export interface ActionRequiredItem {
  id: string;
  type: 'unpaid_order' | 'pending_catering' | 'auction_ending' | 'low_stock';
  title: string;
  subtitle: string;
  link: string;
  urgency: 'high' | 'medium';
}

export interface SalesDashboardMetrics {
  totalRevenue: MetricComparison;
  orderCount: MetricComparison;
  averageOrderValue: MetricComparison;
  newCustomersCount: MetricComparison;
  plainSummary: string;
  dailyTrend: DailySalesPoint[];
  topProducts: BestSellingProductItem[];
  categorySales: CategorySalesSlice[];
  statusBreakdown: OrderStatusBreakdown[];
  actionRequiredList: ActionRequiredItem[];
  businessLines: BusinessLineMetric[];
}

/**
 * Valid revenue status filter:
 * Include: 'Dibayar', 'Diproses', 'Dikirim', 'Selesai', 'Diantar', 'Dikonfirmasi'
 * Exclude: 'Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Dibatalkan'
 */
export function isRevenueOrder(order: { status: string }): boolean {
  const invalidStatuses = ['Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Dibatalkan'];
  return !invalidStatuses.includes(order.status);
}

/**
 * Format currency in Indonesian Rupiah
 */
export function formatRupiahCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(1).replace('.0', '');
    return `${val.replace('.', ',')} M`;
  }
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace('.0', '');
    return `${val.replace('.', ',')} jt`;
  }
  if (amount >= 1_000) {
    const val = (amount / 1_000).toFixed(0);
    return `${val} rb`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatRupiahFull(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

/**
 * Calculate Date Ranges for periods
 */
export function getPeriodDateRanges(period: AnalyticsPeriod, referenceDate = new Date()): PeriodDateRange {
  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  let start = new Date(referenceDate);
  let daysCount = 7;

  if (period === '7d') {
    daysCount = 7;
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (period === '30d') {
    daysCount = 30;
    start.setDate(end.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'this_month') {
    start = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0, 0);
    daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  } else if (period === '90d') {
    daysCount = 90;
    start.setDate(end.getDate() - 89);
    start.setHours(0, 0, 0, 0);
  }

  // Previous equal period
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - (daysCount - 1));
  prevStart.setHours(0, 0, 0, 0);

  return {
    currentStart: start,
    currentEnd: end,
    previousStart: prevStart,
    previousEnd: prevEnd,
    daysCount,
  };
}

/**
 * Calculate comparison metric
 */
export function computeMetricComparison(current: number, previous: number): MetricComparison {
  if (previous === 0) {
    return {
      current,
      previous,
      percentageChange: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' : 'same',
    };
  }

  const diff = current - previous;
  const pct = Math.round((diff / previous) * 1000) / 10; // 1 decimal place

  let direction: MetricComparison['direction'] = 'same';
  if (pct > 0.1) direction = 'up';
  else if (pct < -0.1) direction = 'down';

  return {
    current,
    previous,
    percentageChange: Math.abs(pct),
    direction,
  };
}

/**
 * Primary pure function to calculate entire dashboard data
 */
export function calculateDashboardMetrics(params: {
  orders: Order[];
  customers: User[];
  products: Product[];
  properties: Property[];
  cateringInquiries: CateringInquiry[];
  period: AnalyticsPeriod;
  referenceDate?: Date;
}): SalesDashboardMetrics {
  const { orders, customers, products, properties, cateringInquiries, period } = params;
  const referenceDate = params.referenceDate || new Date();
  const ranges = getPeriodDateRanges(period, referenceDate);

  // Filter orders in current and previous periods
  const currentOrders = orders.filter((o) => {
    const d = new Date(o.date);
    return d >= ranges.currentStart && d <= ranges.currentEnd;
  });

  const previousOrders = orders.filter((o) => {
    const d = new Date(o.date);
    return d >= ranges.previousStart && d <= ranges.previousEnd;
  });

  // Valid revenue orders
  const currentRevenueOrders = currentOrders.filter(isRevenueOrder);
  const previousRevenueOrders = previousOrders.filter(isRevenueOrder);

  // 1. Total Revenue
  const currentTotalRev = currentRevenueOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const prevTotalRev = previousRevenueOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = computeMetricComparison(currentTotalRev, prevTotalRev);

  // 2. Order Count
  const orderCount = computeMetricComparison(currentRevenueOrders.length, previousRevenueOrders.length);

  // 3. Average Order Value (AOV)
  const currentAov = currentRevenueOrders.length > 0 ? currentTotalRev / currentRevenueOrders.length : 0;
  const prevAov = previousRevenueOrders.length > 0 ? prevTotalRev / previousRevenueOrders.length : 0;
  const averageOrderValue = computeMetricComparison(currentAov, prevAov);

  // 4. New Customers Count
  const currentNewCust = customers.filter((c) => {
    const cd = new Date(c.createdAt);
    return cd >= ranges.currentStart && cd <= ranges.currentEnd;
  }).length;
  const prevNewCust = customers.filter((c) => {
    const cd = new Date(c.createdAt);
    return cd >= ranges.previousStart && cd <= ranges.previousEnd;
  }).length;
  const newCustomersCount = computeMetricComparison(currentNewCust, prevNewCust);

  // 5. Daily Trend (Chart 1)
  const dailyMap = new Map<string, { current: number; previous: number; label: string; fullDate: string }>();

  for (let i = 0; i < ranges.daysCount; i++) {
    const cDate = new Date(ranges.currentStart);
    cDate.setDate(cDate.getDate() + i);
    const dayName = cDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const fullDate = cDate.toISOString().slice(0, 10);
    dailyMap.set(fullDate, { current: 0, previous: 0, label: dayName, fullDate });
  }

  // Populate current orders into daily trend
  for (const o of currentRevenueOrders) {
    const key = o.date.slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.get(key)!.current += o.total || 0;
    }
  }

  // Populate previous orders by day index offset
  for (const o of previousRevenueOrders) {
    const oDate = new Date(o.date);
    const daysFromStart = Math.floor((oDate.getTime() - ranges.previousStart.getTime()) / (1000 * 3600 * 24));
    if (daysFromStart >= 0 && daysFromStart < ranges.daysCount) {
      const cDate = new Date(ranges.currentStart);
      cDate.setDate(cDate.getDate() + daysFromStart);
      const cKey = cDate.toISOString().slice(0, 10);
      if (dailyMap.has(cKey)) {
        dailyMap.get(cKey)!.previous += o.total || 0;
      }
    }
  }

  const dailyTrend: DailySalesPoint[] = Array.from(dailyMap.values()).map((v) => ({
    dateKey: v.label,
    fullDate: v.fullDate,
    currentRevenue: v.current,
    previousRevenue: v.previous,
  }));

  // 6. Top Selling Products (Chart 2)
  const productSalesMap = new Map<string, { name: string; units: number; revenue: number }>();

  for (const o of currentRevenueOrders) {
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        const pId = 'productId' in item ? item.productId : item.product?.id || 'unknown';
        const pName = 'productName' in item ? item.productName : item.product?.name || 'Produk';
        const qty = item.quantity || 1;
        const rev = (item.price || 0) * qty;

        const existing = productSalesMap.get(pId) || { name: pName, units: 0, revenue: 0 };
        existing.units += qty;
        existing.revenue += rev;
        productSalesMap.set(pId, existing);
      }
    }
  }

  const topProducts: BestSellingProductItem[] = Array.from(productSalesMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      unitsSold: data.units,
      totalRevenue: data.revenue,
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  // 7. Category Sales (Chart 3)
  const categoryMap = new Map<string, number>();
  const productCategoryLookup = new Map<string, string>();
  for (const p of products) {
    productCategoryLookup.set(p.id, p.category || 'Lainnya');
  }

  for (const o of currentRevenueOrders) {
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        const pId = 'productId' in item ? item.productId : item.product?.id;
        const cat = (pId && productCategoryLookup.get(pId)) || (o.type === 'katering' ? 'Katering' : 'Busana');
        const rev = (item.price || 0) * (item.quantity || 1);
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + rev);
      }
    }
  }

  // Token palette colors for charts
  const tokenColors = [
    'var(--charcoal)',
    'var(--caramel-deep)',
    'var(--indigo)',
    'var(--status-available)',
    'var(--sand)',
    'var(--muted)',
  ];

  const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
  const topCategories = sortedCategories.slice(0, 5);
  const otherRevenue = sortedCategories.slice(5).reduce((sum, item) => sum + item[1], 0);

  const categorySlices: CategorySalesSlice[] = topCategories.map(([cat, rev], idx) => ({
    category: cat,
    revenue: rev,
    percentage: currentTotalRev > 0 ? Math.round((rev / currentTotalRev) * 1000) / 10 : 0,
    color: tokenColors[idx % tokenColors.length],
  }));

  if (otherRevenue > 0) {
    categorySlices.push({
      category: 'Lainnya',
      revenue: otherRevenue,
      percentage: currentTotalRev > 0 ? Math.round((otherRevenue / currentTotalRev) * 1000) / 10 : 0,
      color: tokenColors[5],
    });
  }

  // 8. Order Status Breakdown (Chart 4)
  const statusCounts = new Map<OrderStatus, number>();
  for (const o of currentOrders) {
    statusCounts.set(o.status, (statusCounts.get(o.status) || 0) + 1);
  }

  const statusBreakdown: OrderStatusBreakdown[] = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: currentOrders.length > 0 ? Math.round((count / currentOrders.length) * 100) : 0,
  }));

  // 9. Action Required List
  const actionRequiredList: ActionRequiredItem[] = [];

  // a. Belum dibayar > 24 jam
  const now = referenceDate.getTime();
  const ONE_DAY_MS = 24 * 3600 * 1000;

  for (const o of orders) {
    if (o.status === 'Menunggu Pembayaran') {
      const orderAge = now - new Date(o.date).getTime();
      if (orderAge > ONE_DAY_MS) {
        actionRequiredList.push({
          id: `unpaid-${o.id}`,
          type: 'unpaid_order',
          title: `Pesanan ${o.id} belum dibayar`,
          subtitle: `${o.customerName} · ${formatRupiahCompact(o.total)}`,
          link: `/admin/pesanan?id=${o.id}`,
          urgency: 'high',
        });
      }
    }
  }

  // b. Permintaan katering belum dibalas
  for (const ci of cateringInquiries) {
    if (ci.status === 'Menunggu Konfirmasi') {
      actionRequiredList.push({
        id: `catering-${ci.id}`,
        type: 'pending_catering',
        title: `Permintaan katering: ${ci.nama}`,
        subtitle: `${ci.jumlahPorsi} porsi · Acara: ${ci.tanggalAcara}`,
        link: `/admin/katering?id=${ci.id}`,
        urgency: 'high',
      });
    }
  }

  // c. Lelang properti berakhir dalam 24 jam
  for (const p of properties) {
    if (p.auctionEnd) {
      const endMs = new Date(p.auctionEnd).getTime();
      const timeLeft = endMs - now;
      if (timeLeft > 0 && timeLeft <= ONE_DAY_MS) {
        const hoursLeft = Math.ceil(timeLeft / (3600 * 1000));
        actionRequiredList.push({
          id: `auction-${p.id}`,
          type: 'auction_ending',
          title: `Lelang ${p.name} segera berakhir`,
          subtitle: `Sisa waktu: ${hoursLeft} jam · Penawaran tertinggi: ${formatRupiahCompact(p.currentBid)}`,
          link: `/admin/properti?id=${p.id}`,
          urgency: 'medium',
        });
      }
    }
  }

  // d. Stok menipis (<= 5)
  for (const p of products) {
    const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? p.stock ?? 0;
    if (totalStock <= 5 && totalStock > 0) {
      actionRequiredList.push({
        id: `low-stock-${p.id}`,
        type: 'low_stock',
        title: `Stok menipis: ${p.name}`,
        subtitle: `Sisa ${totalStock} unit di gudang`,
        link: `/admin/produk?id=${p.id}`,
        urgency: 'medium',
      });
    }
  }

  // 10. Business Line Comparison (Chart 5)
  const busanaRevenue = currentRevenueOrders
    .filter((o) => o.type === 'busana')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const cateringRevenue = currentRevenueOrders
    .filter((o) => o.type === 'katering')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const propertiBidSum = properties.reduce((sum, p) => sum + (p.currentBid || 0), 0);

  const businessLines: BusinessLineMetric[] = [
    { line: 'Busana', label: 'Busana Muslimah', value: busanaRevenue },
    { line: 'Katering', label: 'Jamuan & Katering', value: cateringRevenue },
    { line: 'Properti', label: 'Properti (Nilai Penawaran)', value: propertiBidSum, isPotential: true },
  ];

  // 11. Plain-language summary sentence
  const periodLabels = {
    '7d': '7 hari ini',
    '30d': '30 hari ini',
    this_month: 'bulan ini',
    '90d': '90 hari ini',
  };
  const prevLabels = {
    '7d': '7 hari sebelumnya',
    '30d': '30 hari sebelumnya',
    this_month: 'bulan sebelumnya',
    '90d': '90 hari sebelumnya',
  };

  const periodName = periodLabels[period];
  const prevName = prevLabels[period];
  const formattedRev = formatRupiahCompact(totalRevenue.current);
  const diffWord =
    totalRevenue.direction === 'up'
      ? `naik ${totalRevenue.percentageChange}%`
      : totalRevenue.direction === 'down'
      ? `turun ${totalRevenue.percentageChange}%`
      : 'sama';

  const bestProductText = topProducts[0] ? `Produk terlaris: ${topProducts[0].name.toUpperCase()}.` : '';

  const plainSummary = `Penjualan ${periodName} ${formattedRev}, ${diffWord} dari ${prevName}. ${bestProductText}`.trim();

  return {
    totalRevenue,
    orderCount,
    averageOrderValue,
    newCustomersCount,
    plainSummary,
    dailyTrend,
    topProducts,
    categorySales: categorySlices,
    statusBreakdown,
    actionRequiredList: actionRequiredList.slice(0, 6),
    businessLines,
  };
}
