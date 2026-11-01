// ============================================================
// Component — Order Management View (List, Status Flow, Timeline, CSV)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { orderService } from '../../services/orders';
import type { Order, OrderStatus } from '../../types/order';
import { Drawer } from '../ui/Drawer';
import {
  Search,
  Download,
  Filter,
  Eye,
  Printer,
  CheckCircle,
  Truck,
  RotateCcw,
  MessageCircle,
  Clock,
  Send,
  FileText,
} from 'lucide-react';

export const OrderManagementView: React.FC = () => {
  const { orders, refreshOrders } = useAdmin();
  const { currentUser } = useAuth();
  const { showToast } = useOverlay();

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'busana' | 'katering'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Detail drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [courierInput, setCourierInput] = useState('JNE Express');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (typeFilter !== 'all') {
      list = list.filter((o) => o.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, typeFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber || '');
    setCourierInput(order.courierName || 'JNE Express');
    setInternalNoteInput(order.internalNote || '');
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    try {
      const updated = await orderService.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        currentUser?.name || 'Admin',
        trackingInput || undefined,
        courierInput || undefined,
        internalNoteInput || undefined
      );
      setSelectedOrder(updated);
      await refreshOrders();
      showToast(`Status pesanan ${updated.id} diubah ke "${newStatus}".`);
    } catch {
      showToast('Gagal mengubah status pesanan.');
    }
  };

  const handleSaveInternalNote = async () => {
    if (!selectedOrder) return;
    try {
      const updated = await orderService.updateInternalNote(
        selectedOrder.id,
        internalNoteInput,
        currentUser?.name || 'Admin'
      );
      setSelectedOrder(updated);
      await refreshOrders();
      showToast('Catatan internal disimpan.');
    } catch {
      showToast('Gagal menyimpan catatan.');
    }
  };

  const handleExportCSV = () => {
    const csvContent = orderService.exportOrdersToCSV(filteredOrders);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pesanan-reamanda-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Berkas CSV pesanan berhasil diekspor.');
  };

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

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const busanaStatuses: OrderStatus[] = [
    'Menunggu Pembayaran',
    'Dibayar',
    'Diproses',
    'Dikirim',
    'Selesai',
    'Dibatalkan',
  ];

  const kateringStatuses: OrderStatus[] = [
    'Menunggu Konfirmasi',
    'Dikonfirmasi',
    'Diproses',
    'Diantar',
    'Selesai',
    'Dibatalkan',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Manajemen Pesanan</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Pantau pembayaran, resi pengiriman, linimasa status, dan cetak faktur pesanan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 border border-line hover:border-charcoal bg-white text-charcoal text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download size={14} /> Ekspor CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-line rounded-[2px] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kode, nama, HP, atau resi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 border border-line rounded-[2px] text-xs bg-white focus:outline-none focus:border-charcoal"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-muted" />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
        >
          <option value="all">Semua Lini Usaha</option>
          <option value="busana">Busana Muslimah</option>
          <option value="katering">Katering & Jamuan</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
        >
          <option value="all">Semua Status</option>
          <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
          <option value="Dibayar">Dibayar / Dikonfirmasi</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim / Diantar</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="border border-line bg-white rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-3 px-3">Kode Pesanan</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">WhatsApp / HP</th>
                <th className="py-3 px-3">Total Transaksi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    Tidak ada pesanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-charcoal">
                      <span>{o.id}</span>
                      <span className="block text-[10px] text-muted uppercase font-sans">{o.type}</span>
                    </td>

                    <td className="py-3 px-3 text-muted">
                      {new Date(o.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-charcoal">{o.customerName}</div>
                      <div className="text-muted text-[10px]">{o.shippingAddress?.city || '-'}</div>
                    </td>

                    <td className="py-3 px-3 text-muted">{o.customerPhone}</td>

                    <td className="py-3 px-3 font-serif text-charcoal text-sm font-medium">
                      {formatRupiah(o.total)}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-[2px] ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(o)}
                        className="px-2.5 py-1 bg-surface border border-line hover:border-charcoal text-xs uppercase tracking-wider font-sans rounded-[2px] transition-colors"
                      >
                        Buka
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 bg-surface border-t border-line flex items-center justify-between text-xs font-sans text-muted">
          <span>Menampilkan {paginatedOrders.length} dari {filteredOrders.length} pesanan</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-2.5 py-1 border border-line bg-white hover:border-charcoal disabled:opacity-40 rounded-[2px]"
            >
              Sebelumnya
            </button>
            <span>Halaman {currentPage} dari {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2.5 py-1 border border-line bg-white hover:border-charcoal disabled:opacity-40 rounded-[2px]"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer with Status Flow & Timeline */}
      {selectedOrder && (
        <Drawer
          id="order-detail-drawer"
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Pesanan ${selectedOrder.id}`}
          side="right"
          maxWidth="w-full sm:max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 bg-surface/40 border border-line rounded-[2px]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block font-sans">Status Saat Ini:</span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs uppercase font-sans tracking-wider rounded-[2px] ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-muted block font-sans">Total Pembayaran:</span>
                <span className="font-serif text-charcoal text-lg font-medium">
                  {formatRupiah(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Status Flow Buttons */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted font-sans block">
                Ubah Alur Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedOrder.type === 'katering' ? kateringStatuses : busanaStatuses).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(st)}
                    className={`px-3 py-1.5 text-xs font-sans rounded-[2px] transition-colors border ${
                      selectedOrder.status === st
                        ? 'bg-charcoal text-white border-charcoal font-medium'
                        : 'bg-white text-ink border-line hover:border-charcoal'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Courier & Tracking Resi */}
            <div className="p-4 bg-white border border-line rounded-[2px] space-y-3 text-xs font-sans">
              <span className="label-editorial text-muted block">Pengiriman & Resi</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted block mb-1">Kurir / Ekspedisi</label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-line rounded-[2px]"
                  />
                </div>
                <div>
                  <label className="text-muted block mb-1">Nomor Resi</label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Misal: JNE12345678"
                    className="w-full px-2.5 py-1.5 border border-line rounded-[2px] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Internal Note */}
            <div className="p-4 bg-white border border-line rounded-[2px] space-y-2 text-xs font-sans">
              <span className="label-editorial text-muted block">Catatan Internal Staf</span>
              <textarea
                rows={2}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Catatan rahasia staf (tidak terlihat oleh pembeli)..."
                className="w-full px-2.5 py-1.5 border border-line rounded-[2px]"
              />
              <button
                type="button"
                onClick={handleSaveInternalNote}
                className="px-3 py-1 bg-surface border border-line hover:border-charcoal rounded-[2px] text-xs"
              >
                Simpan Catatan
              </button>
            </div>

            {/* Items Summary */}
            <div className="space-y-2 text-xs font-sans">
              <span className="label-editorial text-muted block">Rincian Barang</span>
              <div className="divide-y divide-line border border-line rounded-[2px] bg-white">
                {selectedOrder.items?.map((item: any, idx) => {
                  const name = item.productName || item.product?.name || 'Item';
                  const price = item.price || 0;
                  const qty = item.quantity || 1;
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-charcoal">{name}</div>
                        <span className="text-muted text-[11px]">
                          {item.size ? `Ukuran: ${item.size} · ` : ''}
                          {item.color ? `Warna: ${item.color} · ` : ''}
                          {qty} buah
                        </span>
                      </div>
                      <span className="font-serif text-charcoal text-sm">{formatRupiah(price * qty)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-2 text-xs font-sans">
              <span className="label-editorial text-muted block">Linimasa & Audit Jejak Pesanan</span>
              <div className="pl-3 border-l-2 border-line space-y-3">
                {selectedOrder.timeline?.map((evt) => (
                  <div key={evt.id} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-caramel-deep border-2 border-white" />
                    <span className="font-medium text-charcoal block">{evt.title}</span>
                    <span className="text-muted block text-[11px]">{evt.description}</span>
                    <span className="text-[10px] text-muted">
                      {new Date(evt.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} · {evt.actor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Button */}
            <div className="pt-4 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => window.open(`/admin/pesanan/${selectedOrder.id}/invoice`, '_blank')}
                className="px-4 py-2 border border-line hover:border-charcoal bg-white rounded-[2px] text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
              >
                <Printer size={14} /> Cetak Faktur (PDF)
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
