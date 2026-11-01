// ============================================================
// Component — Customer Management View (List, Spend, Status, CSV, Drawer)
// ============================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { authService } from '../../services/auth';
import type { User } from '../../types/auth';
import type { Order } from '../../types/order';
import { Drawer } from '../ui/Drawer';
import {
  Users,
  Search,
  Download,
  Eye,
  ShieldAlert,
  CheckCircle,
  FileText,
  ShoppingBag,
} from 'lucide-react';

export const CustomerManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders } = useAdmin();
  const { showToast } = useOverlay();

  const [customers, setCustomers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  const loadCustomers = async () => {
    const list = await authService.getCustomers(searchQuery);
    setCustomers(list);
  };

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  // Aggregate stats per customer (order count, total spend)
  const customerStatsMap = useMemo(() => {
    const map = new Map<string, { count: number; spend: number; lastDate: string }>();
    for (const o of orders) {
      if (o.customerId) {
        const existing = map.get(o.customerId) || { count: 0, spend: 0, lastDate: o.date };
        existing.count += 1;
        if (o.status !== 'Menunggu Pembayaran' && o.status !== 'Dibatalkan') {
          existing.spend += o.total || 0;
        }
        if (new Date(o.date).getTime() > new Date(existing.lastDate).getTime()) {
          existing.lastDate = o.date;
        }
        map.set(o.customerId, existing);
      }
    }
    return map;
  }, [orders]);

  const handleOpenDetail = (c: User) => {
    setSelectedCustomer(c);
    setCustomerNotes(c.notes || '');
    setIsDetailOpen(true);
  };

  const handleToggleStatus = async (customer: User) => {
    if (!currentUser) return;
    try {
      const nextActive = !customer.isActive;
      await authService.setCustomerStatus(customer.id, nextActive, currentUser);
      showToast(`Akun pelanggan ${customer.name} berhasil ${nextActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
      await loadCustomers();
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer((prev) => prev ? { ...prev, isActive: nextActive } : null);
      }
    } catch {
      showToast('Gagal mengubah status pelanggan.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer || !currentUser) return;
    try {
      await authService.updateCustomerNotes(selectedCustomer.id, customerNotes, currentUser);
      showToast('Catatan internal pelanggan berhasil disimpan.');
      await loadCustomers();
    } catch {
      showToast('Gagal menyimpan catatan.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID Pelanggan', 'Nama Lengkap', 'Surel', 'Telepon', 'Jumlah Pesanan', 'Total Belanja (Rp)', 'Status', 'Tanggal Daftar'];
    const rows = customers.map((c) => {
      const stats = customerStatsMap.get(c.id) || { count: 0, spend: 0 };
      return [
        `"${c.id}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        stats.count,
        stats.spend,
        c.isActive ? 'Aktif' : 'Nonaktif',
        `"${new Date(c.createdAt).toLocaleDateString('id-ID')}"`,
      ];
    });

    const csvStr = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pelanggan-reamanda-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data pelanggan berhasil diekspor ke CSV.');
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerId === selectedCustomer.id);
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Basis Data Pelanggan</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Daftar pelanggan terdaftar, riwayat transaksi, buku alamat, dan catatan profil.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 border border-line hover:border-charcoal bg-white text-charcoal text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download size={14} /> Ekspor Pelanggan CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Cari nama, email, atau no HP pelanggan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px] focus:outline-none focus:border-charcoal font-sans"
        />
        <Search size={15} className="absolute left-3 top-2.5 text-muted" />
      </div>

      {/* Customers Table */}
      <div className="border border-line bg-white rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Total Pesanan</th>
                <th className="py-3 px-4">Total Belanja</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    Tidak ada pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const stats = customerStatsMap.get(c.id) || { count: 0, spend: 0 };
                  return (
                    <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-charcoal">{c.name}</div>
                        <span className="text-[10px] text-muted font-mono">{c.id}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-ink">{c.email}</div>
                        <div className="text-muted text-[11px]">{c.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-charcoal">
                        {stats.count} pesanan
                      </td>

                      <td className="py-3.5 px-4 font-serif text-charcoal text-sm font-medium">
                        {formatRupiah(stats.spend)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-[2px] ${c.isActive ? 'bg-status-available/15 text-status-available border border-status-available/30' : 'bg-status-occupied/15 text-status-occupied border border-status-occupied/30'}`}>
                          {c.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(c)}
                            className="px-2.5 py-1 bg-surface border border-line hover:border-charcoal text-xs uppercase tracking-wider rounded-[2px]"
                          >
                            Rincian
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            className={`p-1 text-xs rounded-[2px] ${c.isActive ? 'text-muted hover:text-status-occupied' : 'text-status-available'}`}
                            title={c.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            {c.isActive ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <Drawer
          id="customer-detail-drawer"
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Profil Pelanggan — ${selectedCustomer.name}`}
          side="right"
          maxWidth="w-full sm:max-w-2xl"
        >
          <div className="space-y-6 text-xs font-sans">
            {/* Header Card */}
            <div className="p-4 bg-surface/50 border border-line rounded-[2px] flex items-center justify-between">
              <div>
                <h4 className="font-serif text-charcoal text-lg font-normal m-0">{selectedCustomer.name}</h4>
                <span className="text-muted text-[11px] block">{selectedCustomer.email} · {selectedCustomer.phone}</span>
                <span className="text-muted text-[10px] block mt-0.5">
                  Terdaftar sejak: {new Date(selectedCustomer.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedCustomer)}
                  className={`px-3 py-1.5 text-xs font-sans rounded-[2px] border ${selectedCustomer.isActive ? 'border-status-occupied text-status-occupied hover:bg-status-occupied/10' : 'border-status-available text-status-available hover:bg-status-available/10'}`}
                >
                  {selectedCustomer.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                </button>
              </div>
            </div>

            {/* Internal Admin Note */}
            <div className="p-4 bg-white border border-line rounded-[2px] space-y-2">
              <span className="label-editorial text-muted block">Catatan Internal Staf Mengenai Pelanggan</span>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Preferensi ukuran, kebiasaan belanja, atau catatan penting..."
                className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-surface/30"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 bg-charcoal text-white rounded-[2px] text-xs hover:bg-caramel-deep"
              >
                Simpan Catatan
              </button>
            </div>

            {/* Addresses */}
            <div className="space-y-2">
              <span className="label-editorial text-muted block">Buku Alamat Tersimpan</span>
              {(!selectedCustomer.addresses || selectedCustomer.addresses.length === 0) ? (
                <div className="p-4 text-center text-muted bg-surface/30 border border-line">
                  Belum ada alamat tersimpan.
                </div>
              ) : (
                selectedCustomer.addresses.map((a) => (
                  <div key={a.id} className="p-3 border border-line bg-white rounded-[2px]">
                    <div className="font-medium text-charcoal">{a.label} — {a.recipientName} ({a.phone})</div>
                    <div className="text-muted">{a.street}, {a.city} {a.postalCode}</div>
                  </div>
                ))
              )}
            </div>

            {/* Orders History */}
            <div className="space-y-2">
              <span className="label-editorial text-muted block">Riwayat Transaksi Pelanggan ({customerOrders.length})</span>
              {customerOrders.length === 0 ? (
                <div className="p-4 text-center text-muted bg-surface/30 border border-line">
                  Belum ada pesanan yang tercatat.
                </div>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="p-3 border border-line bg-white rounded-[2px] flex items-center justify-between">
                      <div>
                        <div className="font-medium text-charcoal">{o.id} ({o.status})</div>
                        <div className="text-muted text-[11px]">{new Date(o.date).toLocaleDateString('id-ID')} · {o.items?.length || 0} barang</div>
                      </div>
                      <div className="font-serif text-charcoal text-sm font-medium">
                        {formatRupiah(o.total)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
