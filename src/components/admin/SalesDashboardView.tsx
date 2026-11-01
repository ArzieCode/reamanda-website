// ============================================================
// Component — Sales Dashboard (Ringkasan Penjualan & Visualisasi)
// ============================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import {
  calculateDashboardMetrics,
  formatRupiahFull,
  formatRupiahCompact,
  type AnalyticsPeriod,
  type SalesDashboardMetrics,
} from '../../services/analytics';
import { authService } from '../../services/auth';
import { cateringService } from '../../services/katering';
import type { User } from '../../types/auth';
import type { CateringInquiry } from '../../types/katering';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingBag,
  Users,
  CreditCard,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

interface SalesDashboardViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({ onNavigateTab }) => {
  const { isOwner, isAdmin } = useAuth();
  const { orders, products, properties } = useAdmin();

  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  const [customers, setCustomers] = useState<User[]>([]);
  const [cateringInquiries, setCateringInquiries] = useState<CateringInquiry[]>([]);

  useEffect(() => {
    authService.getCustomers().then(setCustomers);
    const inq = cateringService.getInquiries();
    setCateringInquiries(inq);
  }, []);

  // Compute all metrics via pure analytics function
  const metrics: SalesDashboardMetrics = useMemo(() => {
    return calculateDashboardMetrics({
      orders,
      customers,
      products,
      properties,
      cateringInquiries,
      period,
    });
  }, [orders, customers, products, properties, cateringInquiries, period]);

  // Status badge style helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dibayar':
      case 'Dikonfirmasi':
        return 'bg-status-deposit/15 text-status-deposit border border-status-deposit/30';
      case 'Selesai':
      case 'Diantar':
        return 'bg-status-available/15 text-status-available border border-status-available/30';
      case 'Dibatalkan':
        return 'bg-status-occupied/15 text-status-occupied border border-status-occupied/30';
      case 'Diproses':
      case 'Dikirim':
        return 'bg-indigo/15 text-indigo border border-indigo/30';
      default:
        return 'bg-charcoal/10 text-charcoal border border-line';
    }
  };

  const renderComparisonPill = (direction: 'up' | 'down' | 'same', percentage: number) => {
    if (direction === 'up') {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-sans font-medium text-status-available">
          <TrendingUp size={13} /> +{percentage}%
        </span>
      );
    }
    if (direction === 'down') {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-sans font-medium text-status-occupied">
          <TrendingDown size={13} /> -{percentage}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-sans text-muted">
        <Minus size={13} /> sama
      </span>
    );
  };

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Ringkasan Penjualan</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            {isOwner ? 'Metrik finansial komprehensif seluruh lini usaha.' : 'Dasbor ringkasan aktivitas pesanan & volume.'}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 bg-surface border border-line rounded-[2px] text-xs font-sans self-start sm:self-auto">
          {[
            { id: '7d', label: '7 Hari' },
            { id: '30d', label: '30 Hari' },
            { id: 'this_month', label: 'Bulan Ini' },
            { id: '90d', label: '90 Hari' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id as AnalyticsPeriod)}
              className={`px-3 py-1.5 uppercase tracking-wider font-sans rounded-[2px] transition-colors ${
                period === p.id
                  ? 'bg-charcoal text-white font-medium shadow-sm'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Highlighted Plain-Language Summary Sentence */}
      <div className="p-4 bg-surface border-l-4 border-caramel-deep border-y border-r border-line rounded-[2px] flex items-center gap-3">
        <Sparkles size={18} className="text-caramel-deep shrink-0" />
        <p className="font-sans text-charcoal text-sm leading-relaxed m-0 font-medium">
          {metrics.plainSummary}
        </p>
      </div>

      {/* Row of 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Penjualan */}
        <div className="p-5 bg-white border border-line rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-muted">
              {isOwner ? 'Total Penjualan' : 'Volume Pesanan Sukses'}
            </span>
            <ShoppingBag size={16} className="text-muted" />
          </div>
          <div className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
            {isOwner ? formatRupiahFull(metrics.totalRevenue.current) : `${metrics.orderCount.current} Pesanan`}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs font-sans">
            <span className="text-muted text-[11px]">vs periode lalu:</span>
            {renderComparisonPill(metrics.totalRevenue.direction, metrics.totalRevenue.percentageChange)}
          </div>
        </div>

        {/* KPI 2: Jumlah Pesanan */}
        <div className="p-5 bg-white border border-line rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-muted">Jumlah Pesanan</span>
            <CreditCard size={16} className="text-muted" />
          </div>
          <div className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
            {metrics.orderCount.current}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs font-sans">
            <span className="text-muted text-[11px]">vs periode lalu:</span>
            {renderComparisonPill(metrics.orderCount.direction, metrics.orderCount.percentageChange)}
          </div>
        </div>

        {/* KPI 3: Rata-rata Nilai Pesanan */}
        <div className="p-5 bg-white border border-line rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-muted">Rata-rata Nilai</span>
            <ShoppingBag size={16} className="text-muted" />
          </div>
          <div className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
            {isOwner ? formatRupiahFull(metrics.averageOrderValue.current) : `${metrics.topProducts.length} Produk`}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs font-sans">
            <span className="text-muted text-[11px]">vs periode lalu:</span>
            {renderComparisonPill(metrics.averageOrderValue.direction, metrics.averageOrderValue.percentageChange)}
          </div>
        </div>

        {/* KPI 4: Pelanggan Baru */}
        <div className="p-5 bg-white border border-line rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-muted">Pelanggan Baru</span>
            <Users size={16} className="text-muted" />
          </div>
          <div className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
            {metrics.newCustomersCount.current}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs font-sans">
            <span className="text-muted text-[11px]">vs periode lalu:</span>
            {renderComparisonPill(metrics.newCustomersCount.direction, metrics.newCustomersCount.percentageChange)}
          </div>
        </div>
      </div>

      {/* Chart 1: Penjualan per Hari (Bar for 7d, Line for longer) */}
      <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-charcoal text-lg font-light m-0">Penjualan per Hari</h3>
            <span className="text-xs text-muted font-sans">
              Periode saat ini (garis tegas charcoal) dibandingkan periode sebelumnya (garis putus-putus)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-charcoal inline-block rounded-xs" /> Periode Ini
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-line border-t border-dashed border-charcoal/60 inline-block" /> Periode Lalu
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {period === '7d' ? (
              <BarChart data={metrics.dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#D6CBBA" strokeWidth={1} vertical={false} />
                <XAxis dataKey="dateKey" tick={{ fill: '#5C554C', fontSize: 13, fontFamily: 'Jost' }} axisLine={{ stroke: '#D6CBBA' }} tickLine={false} />
                <YAxis tickFormatter={(val) => formatRupiahCompact(val)} tick={{ fill: '#5C554C', fontSize: 13, fontFamily: 'Jost' }} axisLine={{ stroke: '#D6CBBA' }} tickLine={false} width={70} />
                <Tooltip
                  formatter={(val: any) => [formatRupiahFull(Number(val) || 0), 'Penjualan']}
                  labelFormatter={(lbl) => `Tanggal: ${lbl}`}
                  contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CBBA', borderRadius: '2px', fontSize: '13px', fontFamily: 'Jost' }}
                />
                <Bar dataKey="currentRevenue" name="Penjualan Saat Ini" fill="#1B1713" animationDuration={600} radius={[2, 2, 0, 0]} />
                <Bar dataKey="previousRevenue" name="Periode Lalu" fill="#DFD4C4" animationDuration={600} radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={metrics.dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#D6CBBA" strokeWidth={1} vertical={false} />
                <XAxis dataKey="dateKey" tick={{ fill: '#5C554C', fontSize: 13, fontFamily: 'Jost' }} axisLine={{ stroke: '#D6CBBA' }} tickLine={false} />
                <YAxis tickFormatter={(val) => formatRupiahCompact(val)} tick={{ fill: '#5C554C', fontSize: 13, fontFamily: 'Jost' }} axisLine={{ stroke: '#D6CBBA' }} tickLine={false} width={70} />
                <Tooltip
                  formatter={(val: any) => [formatRupiahFull(Number(val) || 0), 'Penjualan']}
                  contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CBBA', borderRadius: '2px', fontSize: '13px', fontFamily: 'Jost' }}
                />
                <Line type="monotone" dataKey="currentRevenue" name="Periode Ini" stroke="#1B1713" strokeWidth={2} dot={{ r: 3, fill: '#1B1713' }} animationDuration={600} />
                <Line type="monotone" dataKey="previousRevenue" name="Periode Lalu" stroke="#A67C42" strokeDasharray="4 4" strokeWidth={1.5} dot={false} animationDuration={600} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Chart 2 (Produk Terlaris) & Chart 3 (Penjualan per Kategori) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2: Produk Terlaris Horizontal Bars */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <h3 className="font-serif text-charcoal text-lg font-light m-0">Produk Terlaris (Top 5)</h3>
          <span className="text-xs text-muted font-sans block">Jumlah unit terjual pada periode ini</span>

          <div className="space-y-3 pt-2">
            {metrics.topProducts.length === 0 ? (
              <div className="p-8 text-center text-muted font-sans text-xs bg-surface/30">
                Belum ada penjualan di periode ini.
              </div>
            ) : (
              metrics.topProducts.map((p, idx) => {
                const maxUnits = metrics.topProducts[0]?.unitsSold || 1;
                const widthPct = Math.round((p.unitsSold / maxUnits) * 100);
                return (
                  <div key={p.id} className="space-y-1 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-charcoal truncate max-w-[240px]">
                        {idx + 1}. {p.name}
                      </span>
                      <span className="text-muted">{p.unitsSold} unit terjual</span>
                    </div>
                    <div className="w-full bg-surface-2 h-3 rounded-[2px] overflow-hidden">
                      <div
                        className="bg-caramel-deep h-full transition-all duration-600 rounded-[2px]"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chart 3: Penjualan per Kategori Donut */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <h3 className="font-serif text-charcoal text-lg font-light m-0">Penjualan per Kategori</h3>
          <span className="text-xs text-muted font-sans block">Komposisi nilai transaksi produk</span>

          <div className="h-64 flex flex-col sm:flex-row items-center justify-center">
            {metrics.categorySales.length === 0 ? (
              <div className="p-8 text-center text-muted font-sans text-xs bg-surface/30">
                Belum ada data kategori.
              </div>
            ) : (
              <>
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.categorySales}
                        dataKey="revenue"
                        nameKey="category"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        animationDuration={600}
                      >
                        {metrics.categorySales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatRupiahFull(Number(val) || 0), 'Nilai']}
                        contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CBBA', fontSize: '13px', fontFamily: 'Jost' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 pl-4 space-y-1.5 text-xs font-sans">
                  {metrics.categorySales.map((c) => (
                    <div key={c.category} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-ink">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="truncate max-w-[140px]">{c.category}</span>
                      </span>
                      <span className="font-medium text-charcoal">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Chart 4 (Status & Perlu Tindakan) & Chart 5 (Penjualan per Lini) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pesanan & Perlu Tindakan */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-charcoal text-lg font-light m-0">Perlu Tindakan Operasional</h3>
            <span className="text-[11px] font-sans text-muted">
              {metrics.actionRequiredList.length} Hal Mendesak
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.actionRequiredList.length === 0 ? (
              <div className="p-6 text-center text-status-available bg-status-available/10 border border-status-available/30 rounded-[2px] text-xs font-sans">
                Semua pesanan, katering, dan lelang saat ini tertangani dengan baik.
              </div>
            ) : (
              metrics.actionRequiredList.map((act) => (
                <div
                  key={act.id}
                  className={`p-3 border rounded-[2px] flex items-center justify-between text-xs font-sans ${
                    act.urgency === 'high'
                      ? 'border-status-occupied/40 bg-status-occupied/5'
                      : 'border-line bg-surface/30'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-charcoal block">{act.title}</span>
                    <span className="text-muted text-[11px]">{act.subtitle}</span>
                  </div>

                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => {
                        if (act.type === 'unpaid_order') onNavigateTab('pesanan');
                        else if (act.type === 'pending_catering') onNavigateTab('katering');
                        else if (act.type === 'auction_ending') onNavigateTab('properti');
                        else if (act.type === 'low_stock') onNavigateTab('produk');
                      }}
                      className="px-2.5 py-1 text-xs text-charcoal hover:text-caramel-deep flex items-center gap-1 border border-line bg-white rounded-[2px]"
                    >
                      Buka <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart 5: Penjualan per Lini Usaha */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <h3 className="font-serif text-charcoal text-lg font-light m-0">Perbandingan Tiga Lini Usaha</h3>
          <span className="text-xs text-muted font-sans block">
            Busana Muslimah vs Katering vs Properti (berdasarkan total penawaran tertinggi)
          </span>

          <div className="space-y-4 pt-2">
            {metrics.businessLines.map((line) => {
              const maxVal = Math.max(...metrics.businessLines.map((b) => b.value), 1);
              const widthPct = Math.round((line.value / maxVal) * 100);
              return (
                <div key={line.line} className="space-y-1 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal">{line.label}</span>
                    <span className="font-serif text-charcoal text-sm">
                      {formatRupiahCompact(line.value)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-2 h-4 rounded-[2px] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-600 rounded-[2px] ${
                        line.line === 'Busana'
                          ? 'bg-charcoal'
                          : line.line === 'Katering'
                          ? 'bg-caramel-deep'
                          : 'bg-indigo'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  {line.isPotential && (
                    <span className="text-[10px] text-muted italic block">
                      * Properti merefleksikan total nilai penawaran tertinggi aktif
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Table (Last 8) */}
      <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-charcoal text-lg font-light m-0">Pesanan Terbaru</h3>
            <span className="text-xs text-muted font-sans">8 transaksi terakhir yang masuk ke dalam sistem</span>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('pesanan')}
              className="text-xs text-caramel-deep hover:underline font-sans flex items-center gap-1"
            >
              Lihat Semua Pesanan <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-2.5 px-3">Kode</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Pemesan</th>
                <th className="py-2.5 px-3">Kota</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-surface/30">
                  <td className="py-3 px-3 font-medium text-charcoal">{o.id}</td>
                  <td className="py-3 px-3 text-muted">
                    {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 px-3 text-ink">{o.customerName}</td>
                  <td className="py-3 px-3 text-muted">{o.shippingAddress?.city || '-'}</td>
                  <td className="py-3 px-3 font-serif text-charcoal text-sm">{formatRupiahCompact(o.total)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-[2px] ${getStatusBadge(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
