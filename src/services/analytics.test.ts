// ============================================================
// Unit Tests — Pure Analytics & Revenue Exclusions
// ============================================================
import {
  isRevenueOrder,
  computeMetricComparison,
  getPeriodDateRanges,
  calculateDashboardMetrics,
  formatRupiahCompact,
} from './analytics';
import type { Order } from '../types/order';
import type { User } from '../types/auth';
import type { Product } from '../types/busana';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

export function runAnalyticsUnitTests(): { passed: boolean; results: TestResult[] } {
  const results: TestResult[] = [];

  function test(suite: string, name: string, fn: () => void) {
    try {
      fn();
      results.push({ suite, name, passed: true });
    } catch (err: any) {
      results.push({ suite, name, passed: false, error: err.message || String(err) });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // Suite 1: Revenue Exclusions Test
  test('Revenue Exclusions', 'should include Dibayar, Diproses, Dikirim, Selesai, Diantar, Dikonfirmasi', () => {
    assert(isRevenueOrder({ status: 'Dibayar' }), 'Dibayar must be included in revenue');
    assert(isRevenueOrder({ status: 'Diproses' }), 'Diproses must be included in revenue');
    assert(isRevenueOrder({ status: 'Dikirim' }), 'Dikirim must be included in revenue');
    assert(isRevenueOrder({ status: 'Selesai' }), 'Selesai must be included in revenue');
    assert(isRevenueOrder({ status: 'Diantar' }), 'Diantar must be included in revenue');
    assert(isRevenueOrder({ status: 'Dikonfirmasi' }), 'Dikonfirmasi must be included in revenue');
  });

  test('Revenue Exclusions', 'should exclude Menunggu Pembayaran, Menunggu Konfirmasi, and Dibatalkan', () => {
    assert(!isRevenueOrder({ status: 'Menunggu Pembayaran' }), 'Menunggu Pembayaran must be excluded from revenue');
    assert(!isRevenueOrder({ status: 'Menunggu Konfirmasi' }), 'Menunggu Konfirmasi must be excluded from revenue');
    assert(!isRevenueOrder({ status: 'Dibatalkan' }), 'Dibatalkan must be excluded from revenue');
  });

  // Suite 2: Metric Comparisons Test
  test('Metric Comparisons', 'should calculate positive percentage changes correctly', () => {
    const res = computeMetricComparison(118, 100);
    assert(res.current === 118, 'Current should be 118');
    assert(res.previous === 100, 'Previous should be 100');
    assert(res.percentageChange === 18, `Expected 18%, got ${res.percentageChange}`);
    assert(res.direction === 'up', `Expected 'up', got ${res.direction}`);
  });

  test('Metric Comparisons', 'should calculate negative percentage changes correctly', () => {
    const res = computeMetricComparison(80, 100);
    assert(res.percentageChange === 20, `Expected 20%, got ${res.percentageChange}`);
    assert(res.direction === 'down', `Expected 'down', got ${res.direction}`);
  });

  test('Metric Comparisons', 'should handle zero previous period safely', () => {
    const res = computeMetricComparison(50, 0);
    assert(res.percentageChange === 100, `Expected 100%, got ${res.percentageChange}`);
    assert(res.direction === 'up', 'Expected up');

    const res2 = computeMetricComparison(0, 0);
    assert(res2.percentageChange === 0, 'Expected 0%');
    assert(res2.direction === 'same', 'Expected same');
  });

  // Suite 3: Date Ranges Test
  test('Date Ranges', 'should compute 7d window and equal previous 7d window', () => {
    const refDate = new Date('2025-06-15T12:00:00Z');
    const ranges = getPeriodDateRanges('7d', refDate);
    assert(ranges.daysCount === 7, 'Days count should be 7');
    const curDiff = Math.round((ranges.currentEnd.getTime() - ranges.currentStart.getTime()) / (1000 * 3600 * 24));
    assert(curDiff === 7, `Current span should be 7 days, got ${curDiff}`);
    const prevDiff = Math.round((ranges.previousEnd.getTime() - ranges.previousStart.getTime()) / (1000 * 3600 * 24));
    assert(prevDiff === 7, `Previous span should be 7 days, got ${prevDiff}`);
  });

  // Suite 4: End-to-end Dashboard Calculation Test
  test('Dashboard Calculation', 'should compute KPIs and plain summary without error', () => {
    const refDate = new Date('2025-06-15T12:00:00Z');
    const mockOrders: Order[] = [
      {
        id: 'RM-1',
        orderNumber: 'RM-1',
        type: 'busana',
        customerName: 'Aisyah',
        customerPhone: '0812345678',
        date: '2025-06-14T10:00:00Z',
        items: [
          {
            productId: 'p-1',
            productName: 'Gaun Lara',
            size: 'M',
            color: 'Sage',
            quantity: 2,
            price: 500000,
          },
        ],
        shippingAddress: { city: 'Jakarta', postalCode: '12190', phone: '081234' },
        paymentMethod: 'bca_va',
        subtotal: 1000000,
        discount: 0,
        shippingCost: 0,
        total: 1000000,
        status: 'Dibayar',
        timeline: [],
        isPaid: true,
      },
      {
        id: 'RM-2',
        orderNumber: 'RM-2',
        type: 'busana',
        customerName: 'Fatimah',
        customerPhone: '0812345679',
        date: '2025-06-13T10:00:00Z',
        items: [],
        shippingAddress: { city: 'Bandung', postalCode: '40111', phone: '081234' },
        paymentMethod: 'qris',
        subtotal: 300000,
        discount: 0,
        shippingCost: 0,
        total: 300000,
        status: 'Menunggu Pembayaran', // MUST BE EXCLUDED FROM REVENUE
        timeline: [],
        isPaid: false,
      },
    ];

    const mockCustomers: User[] = [
      {
        id: 'c-1',
        name: 'Aisyah',
        email: 'aisyah@example.com',
        phone: '0812',
        role: 'customer',
        isActive: true,
        passwordHash: '',
        salt: '',
        failedLoginAttempts: 0,
        createdAt: '2025-06-14T09:00:00Z',
      },
    ];

    const mockProducts: Product[] = [
      {
        id: 'p-1',
        name: 'Gaun Lara',
        slug: 'gaun-lara',
        collection: 'Raya',
        category: 'Abaya',
        price: 500000,
        images: [],
        isNewArrival: false,
        isSale: false,
        isPublished: true,
        sizes: ['M'],
        colors: ['Sage'],
        variants: [{ id: 'v1', size: 'M', color: 'Sage', sku: 'GL-M', stock: 10 }],
        material: 'Silk',
        care: 'Dry clean',
        description: 'Gaun indah',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const metrics = calculateDashboardMetrics({
      orders: mockOrders,
      customers: mockCustomers,
      products: mockProducts,
      properties: [],
      cateringInquiries: [],
      period: '7d',
      referenceDate: refDate,
    });

    // Verify RM-2 was excluded and only RM-1 counted (1,000,000)
    assert(metrics.totalRevenue.current === 1000000, `Expected revenue 1,000,000, got ${metrics.totalRevenue.current}`);
    assert(metrics.orderCount.current === 1, `Expected order count 1, got ${metrics.orderCount.current}`);
    assert(metrics.newCustomersCount.current === 1, 'Expected new customer count 1');
    assert(metrics.plainSummary.includes('GAUN LARA'), 'Plain summary should mention top product GAUN LARA');
  });

  test('Format Utilities', 'compact currency formatting works properly', () => {
    assert(formatRupiahCompact(2850000).includes('2,8 jt') || formatRupiahCompact(2850000).includes('2.8 jt') || formatRupiahCompact(2850000).includes('2,9 jt'), 'Format compact 2.8 jt');
    assert(formatRupiahCompact(1500000000).includes('1,5 M'), 'Format compact 1.5 M');
  });

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results };
}
