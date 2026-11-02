// ============================================================
// Component — Checkout Modal (Customer Prefill, Guest, Invoice Preview)
// ============================================================
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { orderService } from '../../services/orders';
import { BRAND } from '../../config/brand';
import { Modal } from '../ui/Modal';
import { CheckCircle, MessageCircle, ArrowRight, Printer, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, clearCart } = useCart();
  const { settings, refreshOrders, refreshProducts } = useAdmin();
  const { currentUser } = useAuth();
  const { showToast } = useOverlay();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Reguler Bebas Ongkir (JNE Express)');
  const [bankAccount, setBankAccount] = useState('BCA');
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill from customer profile if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setWhatsapp(currentUser.phone || '');
      const defaultAddr = currentUser.addresses?.find((a) => a.isDefault) || currentUser.addresses?.[0];
      if (defaultAddr) {
        setAddress(defaultAddr.street);
        setCity(defaultAddr.city);
        setPostalCode(defaultAddr.postalCode);
      }
    }
  }, [currentUser, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !address.trim()) {
      showToast('Mohon lengkapi nama, kontak, dan alamat pengiriman.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map((i: any) => ({
        productId: i.product.id,
        productName: i.product.name,
        variantId: i.variantId || (i.product.variants && i.product.variants[0]?.id) || 'var-1',
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price || (i.product.isSale && i.product.salePrice ? i.product.salePrice : i.product.price),
        image: (i.product.images && i.product.images[0]) || i.product.imageSlot1 || '',
      }));

      const newOrder = await orderService.createOrder({
        type: 'busana',
        customerId: currentUser?.id,
        customerName: name.trim(),
        customerPhone: whatsapp.trim(),
        customerEmail: currentUser?.email,
        date: new Date().toISOString(),
        items: orderItems,
        shippingAddress: {
          fullName: name.trim(),
          phone: whatsapp.trim(),
          street: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          notes: notes.trim(),
        },
        courier: {
          id: 'jne-reguler',
          name: 'JNE Express',
          service: 'Reguler Bebas Ongkir',
          price: 0,
          estimatedDays: '2-3 hari',
        },
        paymentMethod: `transfer_${bankAccount.toLowerCase()}`,
        subtotal,
        discount: 0,
        shippingCost: 0,
        total: subtotal,
        status: 'Dibayar', // Auto verified in demo mode for instant dashboard updates
        isPaid: true,
      });

      setOrderConfirmedId(newOrder.id);
      clearCart();
      await refreshOrders();
      refreshProducts();
      showToast('Pesanan berhasil dibuat & stok telah diperbarui.');

      // Open printable invoice in new tab automatically as required
      window.open(`/admin/pesanan/${newOrder.id}/invoice`, '_blank');
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsappMessage = () => {
    if (!orderConfirmedId) return '';
    const text = `Halo ${BRAND.name}, saya telah membuat pesanan dengan rincian berikut:
ID Pesanan: ${orderConfirmedId}
Nama: ${name}
WhatsApp: ${whatsapp}
Alamat: ${address}, ${city} ${postalCode}
Pengiriman: ${deliveryMethod}
Metode Bayar: Transfer Bank ${bankAccount}
Total Pembayaran: ${formatRupiah(subtotal)}

Mohon konfirmasi ketersediaan dan nomor resi. Terima kasih.`;
    return encodeURIComponent(text);
  };

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${getWhatsappMessage()}`;
  const hasConfirmedWhatsapp = Boolean(settings.whatsappNumber && settings.whatsappNumber !== '6281234567890');

  if (!isOpen) return null;

  return (
    <Modal
      id="checkout-modal"
      isOpen={isOpen}
      onClose={onClose}
      isDirty={isDirty}
      maxWidth="xl"
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
              Pratinjau faktur cetak telah dibuka di tab baru dan inventaris stok telah dipotong otomatis.
            </p>
          </div>

          <div className="p-4 bg-surface border border-line max-w-md mx-auto text-left text-xs font-sans space-y-1.5 rounded-[2px]">
            <div className="flex justify-between">
              <span className="text-muted">Total Pembayaran:</span>
              <span className="font-serif text-charcoal font-medium text-sm">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Metode Pembayaran:</span>
              <span className="text-charcoal font-medium">Transfer Bank {bankAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Penerima & WhatsApp:</span>
              <span className="text-charcoal font-medium">{name} ({whatsapp})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Alamat Pengiriman:</span>
              <span className="text-charcoal font-medium truncate max-w-[220px]">{address}, {city}</span>
            </div>
          </div>

          <div className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            {hasConfirmedWhatsapp && <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.16em] font-sans transition-colors inline-flex items-center justify-center gap-2 font-medium rounded-[2px]"
            >
              <MessageCircle size={16} className="stroke-[1.25]" />
              <span>Konfirmasi via WhatsApp</span>
            </a>}

            <button
              type="button"
              onClick={() => window.open(`/admin/pesanan/${orderConfirmedId}/invoice`, '_blank')}
              className="flex-1 py-3 border border-line hover:border-charcoal bg-white text-charcoal text-xs uppercase tracking-[0.16em] font-sans transition-colors inline-flex items-center justify-center gap-2 rounded-[2px]"
            >
              <Printer size={16} />
              <span>Buka Faktur (PDF)</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
          <div>
            <h3 className="font-serif text-charcoal text-2xl font-light m-0">Formulir Checkout Pesanan</h3>
            <p className="text-muted text-xs font-sans m-0 mt-0.5">
              {currentUser ? `Memuat data akun ${currentUser.name}. Anda dapat mengubahnya jika perlu.` : 'Anda dapat memesan langsung sebagai tamu (guest checkout) atau masuk ke akun.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">
                Nama Lengkap Penerima <span className="text-status-occupied">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm text-ink"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">
                Nomor WhatsApp <span className="text-status-occupied">*</span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="0812..."
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-muted mb-1">
              Alamat Pengiriman Lengkap <span className="text-status-occupied">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm text-ink"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm text-ink"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Kode Pos</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Metode Pembayaran</label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-xs text-ink"
              >
                <option value="BCA">Transfer Bank BCA Virtual Account</option>
                <option value="Mandiri">Transfer Bank Mandiri</option>
                <option value="BSI">Transfer BSI Syariah</option>
                <option value="QRIS">QRIS Statis Instant</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Opsi Pengiriman</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-xs text-ink"
              >
                <option value="Reguler Bebas Ongkir (JNE Express)">JNE Express (Bebas Ongkir)</option>
                <option value="SiCepat Best Day">SiCepat BEST Kilat</option>
                <option value="Paxel Sameday">Paxel Sameday Service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-muted mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Titipkan ke satpam jika sedang tidak di rumah"
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-xs text-ink"
            />
          </div>

          {/* Cart Summary */}
          <div className="p-4 bg-surface border border-line rounded-[2px] flex items-center justify-between">
            <div>
              <span className="text-muted block text-[11px]">{items.length} macam produk di keranjang</span>
              <span className="font-serif text-charcoal text-lg font-medium">Total: {formatRupiah(subtotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi & Buat Pesanan'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
