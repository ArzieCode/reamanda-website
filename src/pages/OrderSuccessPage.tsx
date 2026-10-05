// ============================================================
// Page — Order Success (/order/:id)
// Order confirmation, tracking, order summary, points earned
// ============================================================
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/order';
import type { Order } from '../types/order';
import { useCurrency } from '../context/CurrencyContext';
import { CheckCircle2, Package, Award, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();

  useEffect(() => {
    if (id) {
      getOrderById(id).then((ord) => {
        setOrder(ord);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-screen-md mx-auto px-5 py-24 text-center font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
        Memuat detail konfirmasi pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-screen-md mx-auto px-5 py-24 text-center pb-28 md:pb-36">
        <h1 className="font-cormorant font-light text-3xl text-charcoal mb-4">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="text-sm font-light text-muted mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>
          Kami tidak menemukan rincian pesanan dengan ID tersebut.
        </p>
        <Link
          to="/busana"
          className="nav-label px-6 py-3 bg-charcoal text-white hover:opacity-85 transition-opacity"
          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
        >
          KEMBALI KE BERANDA
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      {/* Success Badge */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-surface border border-available text-available mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 size={32} strokeWidth={1.5} color="var(--available)" />
        </div>
        <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          PEMBAYARAN DITERIMA
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal mb-2">
          Terima Kasih atas Pesanan Anda
        </h1>
        <p className="text-sm font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
          Nomor Pesanan: <strong className="text-charcoal font-medium">{order.orderNumber}</strong>
        </p>
      </div>

      {/* Rewards Bonus Banner */}
      {order.pointsEarned && order.pointsEarned > 0 ? (
        <div className="p-4 mb-8 border border-line bg-surface flex items-center gap-3">
          <Award size={20} color="var(--caramel-deep)" strokeWidth={1.5} className="flex-shrink-0" />
          <p className="text-xs font-light text-charcoal leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            Selamat! Anda mendapatkan <strong>+{order.pointsEarned} Poin RiaMiranda Privilege</strong> dari transaksi ini. Poin telah otomatis ditambahkan ke saldo akun Anda.
          </p>
        </div>
      ) : null}

      {/* Order Details Card */}
      <div className="border border-line bg-bg p-6 sm:p-8 space-y-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <p className="nav-label text-muted" style={{ fontSize: '9px', letterSpacing: '0.14em' }}>
              TANGGAL TRANSAKSI
            </p>
            <p className="text-sm font-light text-charcoal mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
              {order.date}
            </p>
          </div>
          <div>
            <p className="nav-label text-muted" style={{ fontSize: '9px', letterSpacing: '0.14em' }}>
              STATUS PESANAN
            </p>
            <span
              className="inline-block mt-1 nav-label px-3 py-1 rounded-full text-white text-[10px]"
              style={{ backgroundColor: 'var(--charcoal)', letterSpacing: '0.1em' }}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-line text-xs font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
          <div>
            <p className="nav-label text-charcoal mb-2" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
              PENERIMA & ALAMAT
            </p>
            <p className="text-charcoal font-medium">{order.shippingAddress.name}</p>
            <p className="text-muted">{order.shippingAddress.phone}</p>
            <p className="text-muted mt-1 leading-relaxed">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>
          <div>
            <p className="nav-label text-charcoal mb-2" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
              PENGIRIMAN & PEMBAYARAN
            </p>
            <p className="text-charcoal">{order.courier.name} ({order.courier.service})</p>
            <p className="text-muted">Estimasi: {order.courier.estimatedDays}</p>
            <p className="text-muted mt-2">Metode: {order.paymentMethod.toUpperCase()}</p>
          </div>
        </div>

        {/* Ordered items */}
        <div>
          <p className="nav-label text-charcoal mb-4" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
            PRODUK YANG DIBELI
          </p>
          <ul className="divide-y divide-line">
            {order.items.map((item, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between text-xs font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                <div>
                  <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    {item.product.name}
                  </p>
                  <p className="text-muted text-[11px]">
                    Ukuran: {item.size} · Warna: {item.color} · Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-charcoal font-medium">
                  {format(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-line pt-4 space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{format(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-caramel-deep">
              <span>Diskon Voucher</span>
              <span>- {format(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Biaya Pengiriman</span>
            <span>{order.shippingCost === 0 ? 'GRATIS' : format(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-charcoal font-medium text-base pt-3 border-t border-line">
            <span className="font-cormorant text-xl">Total Pembayaran</span>
            <span>{format(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/akun/pesanan"
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 nav-label py-3.5 px-6 border border-charcoal text-charcoal hover:bg-surface transition-colors text-center"
          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
        >
          <Package size={15} />
          LIHAT PESANAN DI AKUN SAYA
        </Link>
        <Link
          to="/busana"
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 nav-label py-3.5 px-6 bg-charcoal text-white hover:opacity-85 transition-opacity text-center"
          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
        >
          LANJUT BELANJA
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
