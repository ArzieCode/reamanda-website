// ============================================================
// Page — Printable Order Invoice (/admin/pesanan/:id/invoice)
// ============================================================
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orders';
import { contentService } from '../services/content';
import type { Order } from '../types/order';
import { BRAND } from '../config/brand';
import { Printer, ArrowLeft } from 'lucide-react';

export const InvoicePrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const settings = contentService.getSettings();

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id).then((o) => {
        setOrder(o);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-muted font-sans text-sm">
        Memuat faktur pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-muted font-sans text-sm">
        Pesanan tidak ditemukan.
      </div>
    );
  }

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="min-h-screen bg-surface py-8 print:bg-white print:py-0">
      {/* Print Trigger Button Strip (Hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 px-4 flex items-center justify-between print:hidden">
        <Link
          to="/admin"
          className="text-xs uppercase tracking-wider text-muted hover:text-charcoal flex items-center gap-1 font-sans"
        >
          <ArrowLeft size={14} /> Kembali ke Dasbor
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Printer size={15} /> Cetak / Simpan PDF
        </button>
      </div>

      {/* Invoice Document Canvas */}
      <div className="max-w-3xl mx-auto bg-white border border-line p-8 sm:p-12 print:border-0 print:p-0 print:shadow-none shadow-sm rounded-[2px]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/rheamanda-mark.png" alt="" className="h-9 w-auto" />
              <span className="font-serif text-2xl text-charcoal">{BRAND.name}</span>
            </div>
            <p className="text-xs text-muted font-sans m-0">{settings.address}</p>
            <p className="text-xs text-muted font-sans m-0">Telp / WA: {settings.phone} · Surel: {settings.email}</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-serif text-charcoal tracking-wide block uppercase">
              FAKTUR PENJUALAN
            </span>
            <span className="font-mono text-sm text-charcoal font-medium block mt-1">
              {order.id}
            </span>
            <span className="text-xs text-muted font-sans block">
              Tanggal: {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-line text-xs font-sans">
          <div>
            <span className="text-muted uppercase tracking-wider text-[11px] block mb-1">Ditujukan Kepada:</span>
            <div className="font-medium text-charcoal text-sm">{order.customerName}</div>
            <div className="text-muted">{order.customerPhone}</div>
            {order.customerEmail && <div className="text-muted">{order.customerEmail}</div>}
          </div>

          <div>
            <span className="text-muted uppercase tracking-wider text-[11px] block mb-1">Alamat Pengiriman:</span>
            <div className="text-ink">{order.shippingAddress?.street || '-'}</div>
            <div className="text-ink">{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</div>
            <div className="text-muted mt-1">Metode: {order.courierName || 'Reguler Bebas Ongkir'}</div>
            {order.trackingNumber && (
              <div className="font-mono text-charcoal font-medium mt-1">Resi: {order.trackingNumber}</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 border-b border-line">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-2">Deskripsi Barang</th>
                <th className="py-2 text-center">Ukuran / Warna</th>
                <th className="py-2 text-center">Kuantitas</th>
                <th className="py-2 text-right">Harga Satuan</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {order.items?.map((item: any, idx) => {
                const name = item.productName || item.product?.name || 'Produk';
                const price = item.price || 0;
                const qty = item.quantity || 1;
                return (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-charcoal">{name}</td>
                    <td className="py-3 text-center text-muted">{item.size || '-'} / {item.color || '-'}</td>
                    <td className="py-3 text-center text-charcoal">{qty}</td>
                    <td className="py-3 text-right text-muted">{formatRupiah(price)}</td>
                    <td className="py-3 text-right font-medium text-charcoal">{formatRupiah(price * qty)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-2 gap-8 pt-6 text-xs font-sans">
          <div>
            <span className="text-muted uppercase tracking-wider text-[11px] block mb-1">Status Pembayaran:</span>
            <div className="font-medium text-charcoal text-sm">
              {order.isPaid ? 'LUNAS (Terverifikasi)' : order.status}
            </div>
            <div className="text-muted mt-1">Metode: {order.paymentMethod.toUpperCase()}</div>
            <p className="text-[11px] text-muted italic mt-4">
              Terima kasih telah mempercayakan busana dan jamuan santun Anda kepada {BRAND.name}.
            </p>
          </div>

          <div className="space-y-1.5 text-right">
            <div className="flex justify-between text-muted">
              <span>Subtotal:</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-status-occupied">
                <span>Diskon:</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <span>Biaya Pengiriman:</span>
              <span>{order.shippingCost === 0 ? 'GRATIS' : formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-serif text-charcoal text-base font-medium pt-2 border-t border-line">
              <span>Total Akhir:</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
