import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { BRAND } from '../../config/brand';
import { Modal } from '../ui/Modal';
import { ShieldCheck, ShoppingBag, Settings, RotateCcw, Check, MessageCircle } from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    closeDashboard,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    resetAllData,
  } = useAdmin();
  const { showToast } = useOverlay();

  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [filterType, setFilterType] = useState<'all' | 'busana' | 'properti' | 'katering'>('all');

  // Form states for settings
  const [announcement, setAnnouncement] = useState(settings.announcement);
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.companyEmail);
  const [address, setAddress] = useState(settings.officeAddress);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!isDashboardOpen) return null;

  const filteredOrders =
    filterType === 'all' ? orders : orders.filter((o) => o.type === filterType);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcement,
      whatsappNumber: whatsapp,
      companyEmail: email,
      officeAddress: address,
    });
    setSettingsSaved(true);
    showToast('Pengaturan situs berhasil disimpan.');
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data produk, katering, dan pesanan ke bawaan? Data lama properti yang tersimpan juga akan direset.')) {
      resetAllData();
      showToast('Seluruh data berhasil dikembalikan ke bawaan.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dikonfirmasi':
        return 'bg-status-deposit/15 text-status-deposit border border-status-deposit/30';
      case 'Selesai':
        return 'bg-status-available/15 text-status-available border border-status-available/30';
      case 'Dibatalkan':
        return 'bg-status-occupied/15 text-status-occupied border border-status-occupied/30';
      default:
        return 'bg-charcoal/10 text-charcoal border border-line';
    }
  };

  return (
    <Modal
      id="admin-dashboard-modal"
      isOpen={isDashboardOpen}
      onClose={closeDashboard}
      maxWidth="4xl"
      hideHeader
    >
      <div className="-m-5 sm:-m-8">
        {/* Header */}
        <div className="pl-4 pr-14 sm:pl-6 sm:pr-16 py-4 sm:py-5 border-b border-line bg-surface/50">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-indigo text-white flex items-center justify-center shrink-0" style={{ borderRadius: '2px' }}>
              <ShieldCheck size={18} className="stroke-[1.25]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-charcoal text-lg sm:text-xl font-normal leading-tight">
                Dasbor Manajemen {BRAND.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-muted font-sans uppercase tracking-wider sm:tracking-widest block mt-1">
                Pesanan, Reservasi & Pengaturan Sistem
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="px-4 sm:px-6 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white gap-0 sm:gap-3">
          <div className="grid grid-cols-2 sm:flex sm:gap-6 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`min-w-0 min-h-11 py-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.16em] font-sans border-b-2 transition-colors flex items-center justify-center sm:justify-start gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-indigo text-indigo font-medium'
                  : 'border-transparent text-muted hover:text-charcoal'
              }`}
            >
              <ShoppingBag size={14} className="shrink-0" />
              <span className="sm:hidden">Pesanan ({orders.length})</span>
              <span className="hidden sm:inline">Daftar Pesanan & Permintaan ({orders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`min-w-0 min-h-11 py-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.16em] font-sans border-b-2 transition-colors flex items-center justify-center sm:justify-start gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-indigo text-indigo font-medium'
                  : 'border-transparent text-muted hover:text-charcoal'
              }`}
            >
              <Settings size={14} className="shrink-0" />
              <span className="sm:hidden">Pengaturan</span>
              <span className="hidden sm:inline">Setelan Situs & Kontak</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="min-h-10 text-[11px] sm:text-xs text-muted hover:text-status-occupied font-sans flex items-center gap-1.5 transition-colors border-t border-line sm:border-0"
            title="Kembalikan semua data ke bawaan"
          >
            <RotateCcw size={13} />
            <span>Reset Data Bawaan</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 max-h-none sm:max-h-[60vh] overflow-visible sm:overflow-y-auto min-w-0">
          {activeTab === 'orders' && (
            <div>
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                {[
                  { id: 'all', label: 'Semua Lini' },
                  { id: 'busana', label: 'Busana Muslimah' },
                  { id: 'properti', label: 'Kost Wanita / Arsip Properti' },
                  { id: 'katering', label: 'Katering & Perjamuan' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterType(f.id as any)}
                    className={`px-3 min-h-9 py-1 text-[11px] sm:text-xs font-sans uppercase tracking-wide sm:tracking-wider border transition-colors text-left ${
                      filterType === f.id
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-surface text-ink border-line hover:border-charcoal'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-muted font-sans text-sm">
                  Belum ada pesanan atau permintaan yang masuk pada kategori ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const waLink = `https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Ibu/Bpk ${order.customerName}, kami dari ${BRAND.name} ingin menindaklanjuti pesanan Anda: ${order.id}.`
                    )}`;

                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 border border-line bg-surface/30 space-y-3 min-w-0"
                        style={{ borderRadius: '2px' }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
                            <span className="font-serif text-charcoal text-base font-normal break-all">
                              {order.id}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider font-sans text-muted">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-sans uppercase tracking-widest ${getStatusBadge(
                                order.status
                              )}`}
                              style={{ borderRadius: '2px' }}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="sm:text-right">
                            <span className="font-serif text-charcoal text-base">
                              {order.totalAmountFormatted}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          <div>
                            <p className="m-0 text-muted">Pemesan:</p>
                            <p className="m-0 font-medium text-charcoal break-words">{order.customerName}</p>
                            <p className="m-0 text-ink break-all">WhatsApp: {order.whatsapp}</p>
                          </div>

                          <div>
                            <p className="m-0 text-muted">Rincian:</p>
                            <p className="m-0 text-ink break-words">{order.summary}</p>
                          </div>
                        </div>

                        {/* Status update actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60">
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto">
                            <span className="col-span-2 sm:col-auto text-xs text-muted font-sans">Ubah Status:</span>
                            {(['Menunggu', 'Dikonfirmasi', 'Selesai', 'Dibatalkan'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => updateOrderStatus(order.id, st)}
                                className={`min-h-9 px-2.5 py-1 text-[11px] font-sans tracking-wide border transition-colors ${
                                  order.status === st
                                    ? 'bg-charcoal text-white border-charcoal font-medium'
                                    : 'bg-white text-ink border-line hover:border-charcoal'
                                }`}
                                style={{ borderRadius: '2px' }}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 items-center gap-1.5 px-3 py-1 text-xs text-charcoal hover:text-caramel-deep border border-line bg-white transition-colors"
                            style={{ borderRadius: '2px' }}
                          >
                            <MessageCircle size={13} className="stroke-[1.25]" />
                            <span>Hubungi Pemesan di WA</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Teks Announcement Bar (Bilah Pengumuman)
                </label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nomor WhatsApp Pusat (Format: 628...)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
                <span className="text-[11px] text-muted block mt-1 font-sans">
                  Nomor ini digunakan untuk semua tombol 'Hubungi via WhatsApp' dan tautan konfirmasi pesanan.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Surel Resmi Perusahaan
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Alamat Butik & Studio Galeri
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-11 px-6 py-2.5 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.16em] font-sans transition-opacity font-medium"
                  style={{ borderRadius: '2px' }}
                >
                  Simpan Perubahan Setelan
                </button>
                {settingsSaved && (
                  <span className="text-xs text-status-available flex items-center gap-1 font-sans">
                    <Check size={14} /> Tersimpan
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
