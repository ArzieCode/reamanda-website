// ============================================================
// Component — Customer Account Drawer (Profile, Address, Orders, Bids)
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { Drawer } from '../ui/Drawer';
import { authService } from '../../services/auth';
import { orderService } from '../../services/orders';
import { cateringService } from '../../services/katering';
import { propertyService } from '../../services/properti';
import type { UserAddress } from '../../types/auth';
import type { Order } from '../../types/order';
import type { CateringInquiry } from '../../types/katering';
import type { Bid, VisitRequest } from '../../types/properti';
import {
  User,
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
  Home,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Printer,
  ChevronRight,
  LogOut,
  Calendar,
  Clock,
} from 'lucide-react';

interface CustomerAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'addresses' | 'orders' | 'catering' | 'properties';
}

export const CustomerAccountDrawer: React.FC<CustomerAccountDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { currentUser, refreshUser, logout } = useAuth();
  const { showToast } = useOverlay();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Rumah');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostal, setAddrPostal] = useState('');

  // Order history & selected detail
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Catering inquiries
  const [inquiries, setInquiries] = useState<CateringInquiry[]>([]);

  // Property bids & visits
  const [bids, setBids] = useState<Bid[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');

      // Load customer orders
      orderService.getOrders({ customerId: currentUser.id }).then(setOrders);

      // Load catering requests
      const inq = cateringService.getInquiries(currentUser.id);
      setInquiries(inq);

      // Load bids & visits
      const userBids = propertyService.getBids(undefined, currentUser.id);
      setBids(userBids);
      const userVisits = propertyService.getVisitRequests(currentUser.id);
      setVisits(userVisits);
    }
  }, [currentUser, isOpen]);

  if (!currentUser) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(currentUser.id, { name, phone });
      await refreshUser();
      showToast('Profil berhasil diperbarui.');
    } catch {
      showToast('Gagal memperbarui profil.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      showToast('Kata sandi baru minimal 8 karakter.');
      return;
    }
    const res = await authService.changePassword(currentUser.id, oldPass, newPass);
    if (res.success) {
      setOldPass('');
      setNewPass('');
      showToast('Kata sandi berhasil diubah.');
    } else {
      showToast(res.errorMessage || 'Gagal mengubah kata sandi.');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await authService.updateAddress(currentUser.id, {
          id: editingAddressId,
          label: addrLabel,
          recipientName: addrRecipient,
          phone: addrPhone,
          street: addrStreet,
          city: addrCity,
          postalCode: addrPostal,
          isDefault: false,
        });
        showToast('Alamat berhasil diperbarui.');
      } else {
        await authService.addAddress(currentUser.id, {
          label: addrLabel,
          recipientName: addrRecipient,
          phone: addrPhone,
          street: addrStreet,
          city: addrCity,
          postalCode: addrPostal,
          isDefault: !currentUser.addresses || currentUser.addresses.length === 0,
        });
        showToast('Alamat baru berhasil ditambahkan.');
      }
      await refreshUser();
      setIsAddingAddress(false);
      setEditingAddressId(null);
    } catch {
      showToast('Gagal menyimpan alamat.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Hapus alamat ini dari buku alamat?')) {
      await authService.deleteAddress(currentUser.id, id);
      await refreshUser();
      showToast('Alamat dihapus.');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    await authService.setDefaultAddress(currentUser.id, id);
    await refreshUser();
    showToast('Alamat utama berhasil diubah.');
  };

  const handlePrintInvoice = (order: Order) => {
    window.open(`/admin/pesanan/${order.id}/invoice`, '_blank');
  };

  const formatRupiah = (amt: number) => `Rp ${amt.toLocaleString('id-ID')}`;

  return (
    <Drawer
      id="customer-account-drawer"
      isOpen={isOpen}
      onClose={onClose}
      title={`Akun Saya — ${currentUser.name}`}
      side="right"
      maxWidth="w-full sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-line overflow-x-auto no-scrollbar gap-1 text-xs font-sans">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'addresses', label: `Alamat (${currentUser.addresses?.length || 0})`, icon: MapPin },
            { id: 'orders', label: `Pesanan (${orders.length})`, icon: ShoppingBag },
            { id: 'catering', label: `Katering (${inquiries.length})`, icon: UtensilsCrossed },
            { id: 'properties', label: `Properti (${bids.length + visits.length})`, icon: Home },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedOrder(null);
                }}
                className={`py-2 px-3 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-charcoal text-charcoal font-medium'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Tab Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <span className="label-editorial text-muted block">Informasi Akun</span>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Alamat Surel (Tetap)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 border border-line text-sm text-muted bg-surface/50 rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors"
              >
                Simpan Perubahan
              </button>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-6 border-t border-line">
              <span className="label-editorial text-muted block">Ubah Kata Sandi</span>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Kata Sandi Baru (Minimal 8 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-surface text-charcoal border border-line hover:bg-surface-2 text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors"
              >
                Perbarui Kata Sandi
              </button>
            </form>

            <div className="pt-6 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                  showToast('Anda telah keluar.');
                }}
                className="text-xs text-status-occupied hover:underline flex items-center gap-1 font-sans"
              >
                <LogOut size={13} /> Keluar dari Akun
              </button>
            </div>
          </div>
        )}

        {/* 2. Tab Buku Alamat */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-editorial text-muted">Daftar Alamat Pengiriman</span>
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddrLabel('Rumah');
                    setAddrRecipient(currentUser.name);
                    setAddrPhone(currentUser.phone);
                    setAddrStreet('');
                    setAddrCity('Jakarta Selatan');
                    setAddrPostal('12190');
                    setIsAddingAddress(true);
                  }}
                  className="px-3 py-1.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1 transition-colors"
                >
                  <Plus size={13} /> Tambah Alamat
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleSaveAddress} className="p-4 bg-surface border border-line rounded-[2px] space-y-3">
                <span className="text-xs font-medium text-charcoal font-sans block">
                  {editingAddressId ? 'Sunting Alamat' : 'Tambah Alamat Baru'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Label (Misal: Kantor / Rumah)</label>
                    <input
                      type="text"
                      required
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Nama Penerima</label>
                    <input
                      type="text"
                      required
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Nomor HP Penerima</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Kota / Kabupaten</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-muted mb-1 font-sans">Kode Pos</label>
                    <input
                      type="text"
                      required
                      value={addrPostal}
                      onChange={(e) => setAddrPostal(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-line text-xs bg-white rounded-[2px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px]"
                  >
                    Simpan Alamat
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-1.5 border border-line text-xs uppercase tracking-wider font-sans rounded-[2px]"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
                  <div className="p-8 text-center text-muted font-sans text-xs bg-surface/40 border border-line">
                    Belum ada alamat tersimpan. Tambahkan alamat untuk mempermudah pemesanan.
                  </div>
                ) : (
                  currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 border rounded-[2px] transition-colors ${
                        addr.isDefault ? 'border-charcoal bg-surface/30' : 'border-line bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-charcoal font-sans uppercase tracking-wider">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-charcoal text-white text-[9px] uppercase font-sans tracking-widest rounded-[2px]">
                              Utama
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-sans">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-caramel-deep hover:underline"
                            >
                              Jadikan Utama
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddressId(addr.id);
                              setAddrLabel(addr.label);
                              setAddrRecipient(addr.recipientName);
                              setAddrPhone(addr.phone);
                              setAddrStreet(addr.street);
                              setAddrCity(addr.city);
                              setAddrPostal(addr.postalCode);
                              setIsAddingAddress(true);
                            }}
                            className="text-muted hover:text-charcoal"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-muted hover:text-status-occupied"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-charcoal font-medium font-sans m-0">{addr.recipientName} ({addr.phone})</p>
                      <p className="text-xs text-muted font-sans m-0 mt-0.5">{addr.street}, {addr.city} {addr.postalCode}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. Tab Riwayat Pesanan */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {selectedOrder ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs text-caramel-deep hover:underline flex items-center gap-1 font-sans"
                >
                  ← Kembali ke Daftar Pesanan
                </button>

                <div className="p-4 border border-line bg-surface/30 rounded-[2px] space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div>
                      <h4 className="font-serif text-lg text-charcoal m-0">{selectedOrder.id}</h4>
                      <span className="text-[11px] text-muted font-sans">
                        {new Date(selectedOrder.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 text-xs font-sans uppercase tracking-wider bg-charcoal text-white rounded-[2px]">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Resi if available */}
                  {selectedOrder.trackingNumber && (
                    <div className="p-3 bg-white border border-line text-xs font-sans rounded-[2px] flex items-center justify-between">
                      <div>
                        <span className="text-muted block text-[10px] uppercase">Nomor Resi Pengiriman:</span>
                        <span className="font-mono font-medium text-charcoal text-sm">{selectedOrder.trackingNumber}</span>
                        <span className="text-muted ml-2">({selectedOrder.courierName || 'Ekspedisi'})</span>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-muted font-sans block">Daftar Barang</span>
                    {selectedOrder.items?.map((item: any, idx: number) => {
                      const name = item.productName || item.product?.name || 'Item';
                      const price = item.price || 0;
                      const qty = item.quantity || 1;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-line text-xs font-sans rounded-[2px]">
                          <div>
                            <span className="font-medium text-charcoal block">{name}</span>
                            <span className="text-muted text-[11px]">
                              {item.size ? `Ukuran: ${item.size} · ` : ''}
                              {item.color ? `Warna: ${item.color} · ` : ''}
                              {qty} buah
                            </span>
                          </div>
                          <span className="font-medium text-charcoal">{formatRupiah(price * qty)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="pt-2 border-t border-line text-xs font-sans space-y-1 text-right">
                    <div className="text-charcoal font-medium text-sm">
                      Total Pembayaran: {formatRupiah(selectedOrder.total)}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="pt-4 border-t border-line space-y-3">
                    <span className="label-editorial text-muted block">Linimasa Pesanan</span>
                    <div className="space-y-3 pl-2 border-l-2 border-line">
                      {selectedOrder.timeline?.map((evt) => (
                        <div key={evt.id} className="relative pl-4 text-xs font-sans">
                          <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-caramel-deep border-2 border-white" />
                          <span className="font-medium text-charcoal block">{evt.title}</span>
                          <span className="text-muted text-[11px] block">{evt.description}</span>
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

                  {/* Print Invoice Button */}
                  <div className="pt-3 border-t border-line flex justify-end">
                    <button
                      type="button"
                      onClick={() => handlePrintInvoice(selectedOrder)}
                      className="px-4 py-2 border border-line hover:border-charcoal text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors"
                    >
                      <Printer size={13} /> Cetak / Simpan Faktur (PDF)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-muted font-sans text-xs bg-surface/40 border border-line">
                    Belum ada riwayat pesanan.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="p-4 border border-line bg-white hover:border-charcoal cursor-pointer rounded-[2px] transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-charcoal font-medium text-base">{order.id}</span>
                        <span className="px-2 py-0.5 bg-surface text-ink border border-line text-[10px] uppercase font-sans tracking-wider rounded-[2px]">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans text-muted">
                        <span>
                          {new Date(order.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="font-medium text-charcoal text-sm">{formatRupiah(order.total)}</span>
                      </div>
                      <div className="text-[11px] text-muted font-sans truncate">
                        {order.items?.length || 0} barang pesanan
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Tab Permintaan Katering */}
        {activeTab === 'catering' && (
          <div className="space-y-3">
            <span className="label-editorial text-muted block">Konsultasi & Permintaan Katering</span>
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-muted font-sans text-xs bg-surface/40 border border-line">
                Belum ada pengajuan permintaan katering.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 border border-line bg-white rounded-[2px] space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal">{inq.paketName || 'Konsultasi Menu Khusus'}</span>
                    <span className="px-2 py-0.5 bg-surface border border-line text-[10px] uppercase tracking-wider text-ink rounded-[2px]">
                      {inq.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-muted text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Acara: {inq.tanggalAcara}
                    </span>
                    <span>Jumlah: {inq.jumlahPorsi} porsi</span>
                  </div>
                  {inq.catatan && (
                    <p className="m-0 text-muted italic bg-surface/50 p-2 rounded-[2px]">
                      "{inq.catatan}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. Tab Properti & Penawaran */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Penawaran Lelang */}
            <div className="space-y-3">
              <span className="label-editorial text-muted block">Penawaran Lelang Hunian Saya</span>
              {bids.length === 0 ? (
                <div className="p-4 text-center text-muted font-sans text-xs bg-surface/40 border border-line">
                  Belum ada penawaran lelang yang diajukan.
                </div>
              ) : (
                bids.map((b) => (
                  <div key={b.id} className="p-3 border border-line bg-white rounded-[2px] flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="font-medium text-charcoal block">Unit #{b.propertyId}</span>
                      <span className="text-[11px] text-muted">
                        {new Date(b.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-charcoal text-sm font-medium block">{formatRupiah(b.amount)}</span>
                      <span className={`text-[10px] uppercase font-sans tracking-wider ${b.status === 'accepted' ? 'text-status-available font-medium' : 'text-muted'}`}>
                        {b.status === 'accepted' ? 'Tertinggi Saat Ini' : 'Terlewati (Outbid)'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Jadwal Survei / Kunjungan */}
            <div className="space-y-3">
              <span className="label-editorial text-muted block">Permintaan Jadwal Kunjungan Kost</span>
              {visits.length === 0 ? (
                <div className="p-4 text-center text-muted font-sans text-xs bg-surface/40 border border-line">
                  Belum ada jadwal survei yang diajukan.
                </div>
              ) : (
                visits.map((v) => (
                  <div key={v.id} className="p-3 border border-line bg-white rounded-[2px] space-y-1 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-charcoal">{v.propertyName}</span>
                      <span className="px-2 py-0.5 bg-surface text-ink text-[10px] uppercase rounded-[2px]">
                        {v.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted text-[11px]">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {v.requestedDate}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {v.requestedTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
