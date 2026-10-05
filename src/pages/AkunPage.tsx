// ============================================================
// Page — Akun Pengguna (/akun, /akun/:tab)
// Profil, Pesanan, Wishlist, Penawaran Saya, Poin Loyalitas
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useRewards } from '../context/RewardsContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { getOrders } from '../services/order';
import type { Order } from '../types/order';
import {
  User as UserIcon,
  Package,
  Heart,
  Gavel,
  Award,
  LogOut,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

const TABS = [
  { id: 'profil', label: 'Profil Saya', icon: UserIcon },
  { id: 'pesanan', label: 'Riwayat Pesanan', icon: Package },
  { id: 'wishlist', label: 'Wishlist Favorit', icon: Heart },
  { id: 'penawaran', label: 'Penawaran Properti', icon: Gavel },
  { id: 'poin', label: 'Poin & Hadiah', icon: Award },
];

export default function AkunPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, updateProfile, openAuthModal } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { points, tier, vouchers, redeemVoucher } = useRewards();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const { addItem, toggleCart } = useCart();

  const activeTab = tab && ['profil', 'pesanan', 'wishlist', 'penawaran', 'poin'].includes(tab)
    ? tab
    : 'profil';

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileStreet, setProfileStreet] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profilePostal, setProfilePostal] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync profile form
  useEffect(() => {
    if (user) {
      setProfileName(user.name ?? '');
      setProfilePhone(user.phone ?? '');
      setProfileStreet(user.address?.street ?? '');
      setProfileCity(user.address?.city ?? '');
      setProfilePostal(user.address?.postalCode ?? '');
    }
  }, [user]);

  // Load orders
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      getOrders(user.id).then((ord) => {
        setOrders(ord);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfile({
      name: profileName,
      phone: profilePhone,
      address: {
        street: profileStreet,
        city: profileCity,
        postalCode: profilePostal,
      },
    });
    setSavingProfile(false);
    if (res.success) {
      showToast('Profil Anda berhasil diperbarui.', 'success');
    } else {
      showToast(res.error ?? 'Gagal memperbarui profil.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Anda telah keluar dari akun.', 'info');
    navigate('/');
  };

  const handleMoveWishlistToCart = (product: any) => {
    const size = product.sizes?.[0] ?? 'All Size';
    const color = product.colors?.[0] ?? 'Default';
    addItem(product, size, color, 1);
    removeFromWishlist(product.id);
    toggleCart(true);
  };

  if (authLoading) {
    return (
      <div className="max-w-screen-md mx-auto px-5 py-24 text-center font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
        Memeriksa sesi akun...
      </div>
    );
  }

  // Protected: redirect / prompt login if logged out
  if (!user) {
    return (
      <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-20 text-center pb-28 md:pb-36">
        <div className="w-16 h-16 rounded-full bg-surface border border-line text-muted mx-auto flex items-center justify-center mb-6">
          <UserIcon size={28} strokeWidth={1.25} />
        </div>
        <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal mb-4">
          Akses Akun RiaMiranda
        </h1>
        <p className="text-sm font-light text-muted max-w-md mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
          Silakan masuk atau buat akun baru untuk melihat riwayat pesanan, wishlist, penawaran properti, dan poin penghargaan Anda.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => openAuthModal('login')}
            className="nav-label px-8 py-3.5 bg-charcoal text-white hover:opacity-85 transition-opacity focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.16em' }}
          >
            MASUK KE AKUN
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="nav-label px-8 py-3.5 border border-charcoal text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.16em' }}
          >
            DAFTAR BARU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16 pb-28 md:pb-36">
      {/* Header Banner */}
      <div className="border border-line bg-surface p-6 sm:p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="nav-label text-caramel-deep mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            SELAMAT DATANG
          </p>
          <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal">
            {user.name}
          </h1>
          <p className="text-xs font-light text-muted mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
            {user.email} · Member RiaMiranda sejak 2024
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="border border-line bg-bg px-4 py-2 text-center">
            <span className="nav-label text-[9px] text-muted block" style={{ letterSpacing: '0.1em' }}>TINGKAT MEMBER</span>
            <span className="nav-label text-sm text-charcoal font-medium">{tier.toUpperCase()}</span>
          </div>
          <div className="border border-line bg-bg px-4 py-2 text-center">
            <span className="nav-label text-[9px] text-muted block" style={{ letterSpacing: '0.1em' }}>TOTAL POIN</span>
            <span className="nav-label text-sm text-caramel-deep font-medium">{points.toLocaleString('id-ID')}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 nav-label px-4 py-2.5 border border-line text-occupied hover:bg-bg transition-colors focus-visible:outline-none"
            style={{ fontSize: '10px', letterSpacing: '0.12em' }}
          >
            <LogOut size={13} strokeWidth={1.5} />
            KELUAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3">
          <nav className="border border-line bg-bg divide-y divide-line" aria-label="Menu Akun">
            {TABS.map((t) => {
              const isCurrent = activeTab === t.id;
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  to={`/akun/${t.id}`}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                    isCurrent
                      ? 'bg-surface font-medium text-charcoal border-l-4 border-l-charcoal'
                      : 'text-muted hover:text-charcoal hover:bg-surface'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.25} />
                  <span className="nav-label" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                    {t.label.toUpperCase()}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content Area (9 cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: PROFIL */}
          {activeTab === 'profil' && (
            <div className="border border-line bg-bg p-6 sm:p-8">
              <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line">
                Data Pribadi & Alamat Utama
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                      NAMA LENGKAP *
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                      NOMOR TELEPON / WA *
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                    ALAMAT EMAIL (TERDAFTAR)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-underline min-h-[44px] opacity-60 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted mt-1 font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Untuk keamanan akun, penggantian email dapat dilakukan melalui layanan pelanggan kami.
                  </p>
                </div>

                <div className="pt-4 border-t border-line">
                  <p className="nav-label text-charcoal mb-4" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                    ALAMAT PENGIRIMAN STANDAR
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                        JALAN & NOMOR RUMAH
                      </label>
                      <input
                        type="text"
                        value={profileStreet}
                        onChange={(e) => setProfileStreet(e.target.value)}
                        placeholder="Contoh: Jl. Senopati No. 12"
                        className="input-underline min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                          KOTA
                        </label>
                        <input
                          type="text"
                          value={profileCity}
                          onChange={(e) => setProfileCity(e.target.value)}
                          placeholder="Jakarta Selatan"
                          className="input-underline min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                          KODE POS
                        </label>
                        <input
                          type="text"
                          value={profilePostal}
                          onChange={(e) => setProfilePostal(e.target.value)}
                          placeholder="12190"
                          className="input-underline min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="nav-label px-8 py-3.5 bg-charcoal text-white hover:opacity-85 transition-opacity disabled:opacity-50 focus-visible:outline-none"
                  style={{ fontSize: '11px', letterSpacing: '0.16em' }}
                >
                  {savingProfile ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: PESANAN */}
          {activeTab === 'pesanan' && (
            <div className="border border-line bg-bg p-6 sm:p-8">
              <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line">
                Riwayat Pesanan Saya
              </h2>

              {loadingOrders ? (
                <p className="text-sm font-light text-muted py-8 text-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Memuat riwayat transaksi...
                </p>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-light text-muted mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Anda belum memiliki riwayat pesanan busana atau properti.
                  </p>
                  <Link
                    to="/busana"
                    className="nav-label px-6 py-3 border border-charcoal text-charcoal hover:bg-surface transition-colors"
                    style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                  >
                    MULAI BELANJA
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-line p-5 bg-surface space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
                        <div>
                          <p className="nav-label text-charcoal font-medium" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                            {ord.orderNumber}
                          </p>
                          <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                            {ord.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="nav-label px-3 py-1 rounded-full text-white text-[9px]"
                            style={{ backgroundColor: 'var(--charcoal)', letterSpacing: '0.12em' }}
                          >
                            {ord.status.toUpperCase()}
                          </span>
                          <span className="font-light text-sm text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                            {format(ord.total)}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                            <span>
                              {item.product.name} ({item.size}, {item.color}) × {item.quantity}
                            </span>
                            <span className="text-charcoal">{format(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 text-right">
                        <Link
                          to={`/order/${ord.id}`}
                          className="nav-label text-xs text-caramel-deep hover:opacity-75 inline-block"
                          style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                        >
                          LIHAT RINCIAN PESANAN →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="border border-line bg-bg p-6 sm:p-8">
              <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line">
                Wishlist Favorit ({wishlistItems.length})
              </h2>

              {wishlistItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-light text-muted mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Daftar wishlist Anda masih kosong. Simpan produk favorit dengan menekan tombol hati.
                  </p>
                  <Link
                    to="/busana"
                    className="nav-label px-6 py-3 border border-charcoal text-charcoal hover:bg-surface transition-colors"
                    style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                  >
                    JELAJAHI PRODUK TERBARU
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((prod) => (
                    <div key={prod.id} className="border border-line p-4 flex flex-col justify-between bg-surface">
                      <div>
                        <div className="aspect-[3/4] bg-line mb-3 flex items-center justify-center text-[10px] text-muted uppercase font-light">
                          {prod.name}
                        </div>
                        <p className="nav-label text-charcoal truncate" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
                          {prod.name}
                        </p>
                        <p className="text-xs font-light text-muted mt-0.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {prod.collection}
                        </p>
                        <p className="text-sm font-light text-charcoal mt-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {format(prod.salePrice ?? prod.price)}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-line flex gap-2">
                        <button
                          onClick={() => handleMoveWishlistToCart(prod)}
                          className="flex-1 flex items-center justify-center gap-1.5 nav-label py-2 bg-charcoal text-white hover:opacity-85 text-xs transition-opacity focus-visible:outline-none"
                          style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                        >
                          <ShoppingBag size={13} />
                          BELI
                        </button>
                        <button
                          onClick={() => removeFromWishlist(prod.id)}
                          className="p-2 border border-line text-muted hover:text-occupied hover:border-occupied transition-colors focus-visible:outline-none"
                          aria-label={`Hapus ${prod.name} dari wishlist`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PENAWARAN (MY BIDS) */}
          {activeTab === 'penawaran' && (
            <div className="border border-line bg-bg p-6 sm:p-8">
              <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line">
                Penawaran Lelang Properti Saya
              </h2>

              <div className="space-y-4">
                <div className="p-5 border border-line bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="nav-label px-2 py-0.5 text-white text-[9px] mb-2 inline-block" style={{ backgroundColor: 'var(--indigo-brand)' }}>
                      PENAWARAN AKTIF
                    </span>
                    <h3 className="font-cormorant font-light text-xl text-charcoal">
                      Vila Amaryllis — Cisarua
                    </h3>
                    <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Penawaran Terakhir Anda: <strong>Rp 4.875.000.000</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <Link
                      to="/properti/prop_1"
                      className="nav-label px-5 py-2.5 border border-indigo-brand text-indigo-brand hover:bg-bg inline-block transition-colors"
                      style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                    >
                      LIHAT STATUS LELANG
                    </Link>
                  </div>
                </div>

                <div className="p-4 border border-line text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <p><strong>Ketentuan Lelang:</strong> Jika penawaran Anda merupakan penawaran tertinggi saat batas waktu lelang berakhir, konsultan legal RiaMiranda Properti akan menghubungi Anda dalam waktu 1x24 jam untuk proses penandatanganan PPJB dan pembayaran uang muka (DP).</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POIN (REWARDS) */}
          {activeTab === 'poin' && (
            <div className="border border-line bg-bg p-6 sm:p-8">
              <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line">
                Poin & Hak Istimewa Member
              </h2>

              <div className="p-6 bg-surface border border-line mb-8">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="nav-label text-muted" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>SALDO POIN ANDA</span>
                  <span className="nav-label text-white px-2.5 py-0.5 rounded-full text-[9px]" style={{ backgroundColor: 'var(--caramel)' }}>
                    MEMBER {tier.toUpperCase()}
                  </span>
                </div>
                <div className="font-cormorant font-light text-4xl text-charcoal">
                  {points.toLocaleString('id-ID')} Poin
                </div>
                <p className="text-xs font-light text-muted mt-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Kumpulkan 1 poin setiap kelipatan Rp 10.000 transaksi busana atau katering.
                </p>
              </div>

              <p className="nav-label text-charcoal mb-4" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                VOUCHER HADIAH YANG DAPAT DITUKAR
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vouchers.map((v) => {
                  const canAfford = points >= v.pointsCost;
                  return (
                    <div key={v.id} className="border border-line p-4 flex flex-col justify-between bg-bg">
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                            {v.title}
                          </p>
                          <span className="nav-label text-caramel-deep" style={{ fontSize: '10px' }}>
                            {v.pointsCost} Poin
                          </span>
                        </div>
                        <p className="text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {v.description}
                        </p>
                      </div>

                      <button
                        onClick={() => redeemVoucher(v)}
                        disabled={!canAfford}
                        className="nav-label w-full py-2.5 border transition-all text-xs focus-visible:outline-none disabled:opacity-40"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          borderColor: canAfford ? 'var(--charcoal)' : 'var(--line)',
                          backgroundColor: canAfford ? 'var(--charcoal)' : 'transparent',
                          color: canAfford ? '#ffffff' : 'var(--muted)',
                        }}
                      >
                        {canAfford ? 'TUKAR VOUCHER' : 'POIN BELUM CUKUP'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
