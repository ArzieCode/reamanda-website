import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { BRAND } from '../../config/brand';
import { Modal } from '../ui/Modal';
import { CheckCircle, MessageCircle, ArrowRight, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, clearCart } = useCart();
  const { settings, addOrder } = useAdmin();
  const { showToast } = useOverlay();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Reguler Bebas Ongkir (JNE/SiCepat)');
  const [bankAccount, setBankAccount] = useState('BCA');
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOrderConfirmedId(null);
    }
  }, [isOpen]);

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const isDirty = Boolean(
    !orderConfirmedId &&
      (name.trim().length > 0 || whatsapp.trim().length > 0 || address.trim().length > 0 || notes.trim().length > 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !address.trim()) {
      return;
    }

    const itemSummary = items.map((i) => `${i.product.name} (${i.size}, ${i.color} x${i.quantity})`).join(', ');

    const newOrderId = addOrder({
      type: 'busana',
      customerName: name.trim(),
      whatsapp: whatsapp.trim(),
      summary: itemSummary,
      totalAmountFormatted: formatRupiah(subtotal),
      itemsOrDetails: {
        items,
        deliveryMethod,
        bankAccount,
        address,
        notes,
      },
    });

    setOrderConfirmedId(newOrderId);
    clearCart();
    showToast('Pesanan berhasil dibuat.');
  };

  const getWhatsappMessage = () => {
    if (!orderConfirmedId) return '';
    const text = `Halo ${BRAND.name}, saya telah membuat pesanan dengan rincian berikut:
ID Pesanan: ${orderConfirmedId}
Nama: ${name}
WhatsApp: ${whatsapp}
Alamat: ${address}
Pengiriman: ${deliveryMethod}
Metode Bayar: Transfer Bank ${bankAccount}
Total Pembayaran: ${formatRupiah(subtotal)}

Mohon konfirmasi ketersediaan dan rekening pembayaran. Terima kasih.`;
    return encodeURIComponent(text);
  };

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${getWhatsappMessage()}`;

  if (!isOpen) return null;

  return (
    <Modal
      id="checkout-modal"
      isOpen={isOpen}
      onClose={onClose}
      isDirty={isDirty}
      maxWidth="720px"
    >
      {orderConfirmedId ? (
        <div className="text-center py-6 sm:py-8 space-y-6">
          <div className="w-14 h-14 bg-surface flex items-center justify-center mx-auto text-charcoal border border-line rounded-[2px]">
            <CheckCircle size={32} className="stroke-[1.25]" />
          </div>

          <div className="space-y-2">
            <span className="label-editorial text-muted block">Pesanan Berhasil Dicatat</span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
              Terima Kasih atas Pesanan Anda
            </h3>
            <p className="text-sm text-ink max-w-md mx-auto font-sans leading-relaxed">
              Kode referensi pesanan Anda adalah <strong className="font-semibold text-charcoal">{orderConfirmedId}</strong>.
              Rincian pesanan telah diteruskan ke sistem layanan concierge {BRAND.name}.
            </p>
          </div>

          <div className="p-4 bg-surface border border-line max-w-md mx-auto text-left text-xs font-sans space-y-1.5 rounded-[2px]">
            <div className="flex justify-between">
              <span className="text-muted">Total Pembayaran:</span>
              <span className="font-serif text-charcoal font-medium text-sm">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Metode Pembayaran:</span>
              <span className="text-charcoal font-medium">Transfer Bank {bankAccount} (PT {BRAND.name} Mode)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Penerima & WhatsApp:</span>
              <span className="text-charcoal font-medium">{name} ({whatsapp})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Alamat Pengiriman:</span>
              <span className="text-charcoal font-medium truncate max-w-[220px]">{address}</span>
            </div>
          </div>

          <div className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.16em] font-sans transition-colors inline-flex items-center justify-center gap-2 font-medium rounded-[2px]"
            >
              <MessageCircle size={16} className="stroke-[1.25]" />
              <span>Konfirmasi via WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-6 border border-line text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:bg-surface transition-colors inline-flex items-center justify-center gap-1.5 rounded-[2px]"
            >
              <Check size={14} className="stroke-[1.5]" />
              <span>Selesai</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-6 pr-12">
            <span className="label-editorial text-muted block mb-1">
              {BRAND.wordmark} ATELIER
            </span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light mb-1.5">
              Selesaikan Pesanan Busana
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
              Pengiriman berasuransi ke seluruh nusantara. Konfirmasi otomatis via pesan langsung.
            </p>
          </div>

          {/* Items Summary Strip */}
          <div className="mb-6 p-4 bg-surface border border-line text-xs font-sans space-y-2 rounded-[2px]">
            <div className="flex items-center justify-between text-muted">
              <span>Ringkasan Item ({items.length} jenis)</span>
              <span className="font-serif text-charcoal font-normal text-sm">{formatRupiah(subtotal)}</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-[11px] text-ink">
              {items.map((it) => (
                <div key={`${it.product.id}-${it.size}-${it.color}`} className="flex justify-between">
                  <span>{it.product.name} ({it.size}, {it.color}) x{it.quantity}</span>
                  <span className="text-muted">{formatRupiah((it.product.isSale && it.product.salePrice ? it.product.salePrice : it.product.price) * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Penerima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Alamat Lengkap Pengiriman *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan, Kota, Kode Pos"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Opsi Pengiriman
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                >
                  <option value="Reguler Bebas Ongkir (JNE/SiCepat)">Reguler Bebas Ongkir (Gratis Seluruh RI)</option>
                  <option value="Next Day Express (+Rp 25.000)">Next Day Express (+Rp 25.000)</option>
                  <option value="Kurir Instan Jabodetabek (+Rp 40.000)">Kurir Instan Jabodetabek (+Rp 40.000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Metode Pembayaran Transfer
                </label>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                >
                  <option value="BCA">BCA (PT {BRAND.name} Mode)</option>
                  <option value="Mandiri">Mandiri (PT {BRAND.name} Mode)</option>
                  <option value="BSI">BSI Syariah (PT {BRAND.name} Mode)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Catatan Tambahan untuk Pengirim
              </label>
              <input
                type="text"
                placeholder="Contoh: Titipkan ke satpam, sertakan kartu ucapan Idul Fitri"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
              />
            </div>

            {/* Sticky Actions bar inside panel on mobile */}
            <div className="sticky bottom-0 bg-white border-t border-line pt-3 pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:pt-4 sm:border-t sm:static z-20 flex flex-col sm:flex-row items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border border-line text-xs uppercase tracking-wider text-muted hover:text-charcoal font-sans transition-colors order-2 sm:order-1 rounded-[2px]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors flex items-center justify-center gap-2 font-medium order-1 sm:order-2 rounded-[2px]"
              >
                <span>Pesan Sekarang · {formatRupiah(subtotal)}</span>
                <ArrowRight size={14} className="stroke-[1.25]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
