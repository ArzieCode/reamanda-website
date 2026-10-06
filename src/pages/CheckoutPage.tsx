// ============================================================
// Page — Checkout (/checkout)
// Address form, shipping method, payment choice, voucher, order submission
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useRewards } from '../context/RewardsContext';
import { createOrder, COURIER_OPTIONS } from '../services/order';
import { vouchers as mockVouchers } from '../data/busana';
import { Truck, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'qris', name: 'QRIS (Gopay, OVO, Dana, ShopeePay)', desc: 'Pindai kode QR instan dari semua aplikasi e-wallet & perbankan' },
  { id: 'bca_va', name: 'BCA Virtual Account', desc: 'Verifikasi instan otomatis 24 jam' },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', desc: 'Verifikasi instan otomatis 24 jam' },
  { id: 'cc', name: 'Kartu Kredit / Debit (Visa & Mastercard)', desc: 'Dilengkapi perlindungan 3D Secure' },
];

export default function CheckoutPage() {
  const { state, subtotal, dispatch } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const { addPoints } = useRewards();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState(user?.address?.street ?? '');
  const [city, setCity] = useState(user?.address?.city ?? '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode ?? '');
  const [notes, setNotes] = useState('');

  // Shipping & Payment selection
  const [selectedCourierId, setSelectedCourierId] = useState(COURIER_OPTIONS[0].id);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0].id);

  // Voucher
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone) setPhone(user.phone);
      if (!email) setEmail(user.email);
      if (!address && user.address?.street) setAddress(user.address.street);
      if (!city && user.address?.city) setCity(user.address.city);
      if (!postalCode && user.address?.postalCode) setPostalCode(user.address.postalCode);
    }
  }, [user]);

  const selectedCourier = COURIER_OPTIONS.find((c) => c.id === selectedCourierId) ?? COURIER_OPTIONS[0];

  // Shipping cost: free if subtotal >= 500.000 or using RIAFIRST voucher
  const isFreeShipping = subtotal >= 500000 || appliedVoucher?.code === 'RIAFIRST';
  const shippingCost = isFreeShipping ? 0 : selectedCourier.price;

  // Calculate discount
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'RIAFIRST') {
      setAppliedVoucher({ code, discount: 20000 });
      showToast('Voucher RIAFIRST berhasil digunakan (Potongan ongkos kirim)!', 'success');
      setVoucherCodeInput('');
      return;
    }

    const matched = mockVouchers.find((v) => v.code === code);
    if (!matched) {
      setVoucherError('Kode voucher tidak ditemukan atau sudah kedaluwarsa.');
      return;
    }

    if (subtotal < matched.minPurchase) {
      setVoucherError(`Minimal belanja untuk voucher ini adalah ${format(matched.minPurchase)}.`);
      return;
    }

    const calculatedDiscount = matched.type === 'percent'
      ? Math.round((subtotal * matched.discount) / 100)
      : matched.discount;

    setAppliedVoucher({ code, discount: calculatedDiscount });
    showToast(`Voucher ${code} berhasil dipasang (Hemat ${format(calculatedDiscount)})!`, 'success');
    setVoucherCodeInput('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher berhasil dilepas.', 'info');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.items.length === 0) {
      showToast('Keranjang belanja Anda masih kosong.', 'error');
      navigate('/busana');
      return;
    }

    if (!name || !phone || !address || !city || !postalCode) {
      showToast('Mohon lengkapi alamat pengiriman.', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderItems = state.items.map((item) => ({
        product: item.product,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: (item.product.salePrice ?? item.product.price),
      }));

      const newOrder = await createOrder({
        userId: user?.id,
        items: orderItems,
        shippingAddress: {
          name,
          phone,
          street: address,
          city,
          postalCode,
        },
        courier: selectedCourier,
        paymentMethod: selectedPaymentMethod,
        subtotal,
        discount: discountAmount,
        shippingCost,
        total: grandTotal,
      });

      // Award rewards points (1 pt per Rp 10.000)
      const earned = Math.floor(grandTotal / 10000);
      if (earned > 0) {
        addPoints(earned, `Pembelian ${newOrder.orderNumber}`);
      }

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });

      showToast(`Pesanan ${newOrder.orderNumber} berhasil dibuat!`, 'success');
      navigate(`/order/${newOrder.id}`);
    } catch {
      showToast('Gagal memproses pesanan. Silakan coba kembali.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-20 text-center pb-28 md:pb-36">
        <h1 className="font-cormorant text-3xl font-light text-charcoal mb-4">
          Keranjang Belanja Anda Kosong
        </h1>
        <p className="text-sm font-light text-muted mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>
          Silakan memilih busana atau produk favorit Anda sebelum menuju proses pembayaran.
        </p>
        <Link
          to="/busana"
          className="nav-label inline-block px-8 py-3.5 bg-charcoal text-white hover:opacity-85 transition-opacity"
          style={{ fontSize: '11px', letterSpacing: '0.16em' }}
        >
          KEMBALI KE KOLEKSI BUSANA
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16 pb-28 md:pb-36">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 py-3 border-b border-line mb-8 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
        <Link to="/busana" className="hover:text-charcoal transition-colors">Busana</Link>
        <ChevronRight size={12} />
        <span className="text-charcoal">Checkout Pembayaran</span>
      </div>

      <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal mb-10">
        Konfirmasi & Pembayaran
      </h1>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Form: Address, Courier, Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Section 1: Shipping Address */}
            <div className="border border-line p-6 bg-bg">
              <p className="nav-label text-charcoal mb-5 pb-3 border-b border-line" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                1. ALAMAT PENGIRIMAN
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                      NAMA PENERIMA *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap penerima"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                    ALAMAT EMAIL (UNTUK NOTIFIKASI RESI)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-underline min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                    ALAMAT LENGKAP RUMAH / KANTOR *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    rows={2}
                    className="input-underline resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                      KOTA / KABUPATEN *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                      KODE POS *
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="12345"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                    CATATAN PENGIRIMAN (OPSIONAL)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titipkan di satpam, paket mudah basah"
                    className="input-underline min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Courier Selection */}
            <div className="border border-line p-6 bg-bg">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-line">
                <p className="nav-label text-charcoal flex items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                  <Truck size={16} strokeWidth={1.5} color="var(--charcoal)" />
                  2. METODE PENGIRIMAN
                </p>
                {isFreeShipping && (
                  <span className="nav-label text-white px-2 py-0.5 rounded-full" style={{ fontSize: '9px', backgroundColor: 'var(--available)' }}>
                    GRATIS ONGKIR AKTIF
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {COURIER_OPTIONS.map((c) => {
                  const isSelected = selectedCourierId === c.id;
                  const priceToDisplay = isFreeShipping ? 0 : c.price;

                  return (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                        isSelected ? 'border-charcoal bg-surface' : 'border-line hover:border-charcoal'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="courier"
                          checked={isSelected}
                          onChange={() => setSelectedCourierId(c.id)}
                          className="accent-charcoal"
                        />
                        <div>
                          <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                            {c.name} — {c.service}
                          </p>
                          <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                            Estimasi tiba: {c.estimatedDays}
                          </p>
                        </div>
                      </div>
                      <span className="font-light text-sm text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {priceToDisplay === 0 ? 'GRATIS' : format(priceToDisplay)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="border border-line p-6 bg-bg">
              <p className="nav-label text-charcoal mb-5 pb-3 border-b border-line flex items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                <CreditCard size={16} strokeWidth={1.5} color="var(--charcoal)" />
                3. METODE PEMBAYARAN
              </p>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPaymentMethod === pm.id;
                  return (
                    <label
                      key={pm.id}
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                        isSelected ? 'border-charcoal bg-surface' : 'border-line hover:border-charcoal'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={isSelected}
                        onChange={() => setSelectedPaymentMethod(pm.id)}
                        className="accent-charcoal mt-1"
                      />
                      <div>
                        <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          {pm.name}
                        </p>
                        <p className="text-xs font-light text-muted mt-0.5 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {pm.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary: Items, Voucher, Grand Total (5 cols) */}
          <div className="lg:col-span-5">
            <div className="border border-line p-6 bg-surface sticky top-36">
              <p className="nav-label text-charcoal mb-5 pb-3 border-b border-line" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                RINGKASAN PESANAN ({state.items.reduce((acc, i) => acc + i.quantity, 0)} ITEM)
              </p>

              {/* Items List */}
              <ul className="divide-y divide-line mb-6 max-h-60 overflow-y-auto pr-1">
                {state.items.map((item) => (
                  <li key={`${item.product.id}-${item.size}-${item.color}`} className="py-3 flex justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="nav-label text-charcoal truncate" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                        {item.product.name}
                      </p>
                      <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Ukuran: {item.size} · {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-light text-xs text-charcoal flex-shrink-0" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {format((item.product.salePrice ?? item.product.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Voucher Input */}
              <div className="mb-6 pt-4 border-t border-line">
                <p className="nav-label text-muted mb-2" style={{ fontSize: '9px', letterSpacing: '0.14em' }}>
                  KODE VOUCHER / PROMO
                </p>

                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 border border-caramel-deep bg-bg text-xs">
                    <div>
                      <p className="nav-label text-caramel-deep font-medium" style={{ fontSize: '10px' }}>
                        {appliedVoucher.code} TERPASANG
                      </p>
                      <p className="text-muted font-light" style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px' }}>
                        Hemat {format(appliedVoucher.discount)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="nav-label text-xs text-occupied hover:opacity-75 focus-visible:outline-none"
                      style={{ fontSize: '9px' }}
                    >
                      HAPUS
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCodeInput}
                        onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                        placeholder="KODE VOUCHER (misal: RIAFIRST)"
                        className="flex-1 border border-line px-3 py-2 text-xs uppercase font-light bg-bg outline-none focus:border-charcoal"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="nav-label px-4 py-2 border border-charcoal bg-charcoal text-white hover:opacity-85 text-xs transition-opacity focus-visible:outline-none"
                        style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                      >
                        PAKAI
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-[11px] text-occupied font-light mt-1.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {voucherError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Calculation Rows */}
              <div className="space-y-2.5 text-xs font-light border-t border-line pt-4 mb-6" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
                <div className="flex justify-between text-muted">
                  <span>Subtotal Produk</span>
                  <span>{format(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-caramel-deep">
                    <span>Diskon Voucher</span>
                    <span>- {format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Ongkos Kirim ({selectedCourier.name})</span>
                  <span>{shippingCost === 0 ? 'GRATIS' : format(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-charcoal font-medium text-base pt-3 border-t border-line">
                  <span className="font-cormorant text-xl">Total Pembayaran</span>
                  <span className="text-charcoal">{format(grandTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-white hover:opacity-90 disabled:opacity-50"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                }}
              >
                {loading ? 'MEMPROSES PESANAN...' : 'BUAT PESANAN SEKARANG'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-light text-muted text-center" style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px' }}>
                <ShieldCheck size={14} color="var(--available)" />
                <span>Transaksi dijamin aman & terlindungi enkripsi 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
