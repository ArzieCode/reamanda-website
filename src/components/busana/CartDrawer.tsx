import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { BRAND } from '../../config/brand';
import { SmartImage } from '../ui/SmartImage';
import { Drawer } from '../ui/Drawer';
import { Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CheckoutModal } from '../modals/CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const handleProceedToCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const footerContent =
    items.length > 0 ? (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-sans">
          <span className="text-muted uppercase tracking-wider">Subtotal Pembelian:</span>
          <span className="font-serif text-charcoal text-xl font-normal">
            {formatRupiah(subtotal)}
          </span>
        </div>
        <p className="text-[11px] text-muted font-sans leading-tight">
          Bebas biaya kirim ke seluruh Indonesia. Pajak dan asuransi termasuk.
        </p>
        <button
          type="button"
          onClick={handleProceedToCheckout}
          className="w-full py-3.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors flex items-center justify-center gap-2 font-medium"
          style={{ borderRadius: '2px' }}
        >
          <span>Selesaikan Pesanan</span>
          <ArrowRight size={14} className="stroke-[1.25]" />
        </button>
      </div>
    ) : null;

  return (
    <>
      <Drawer
        id="cart-drawer"
        isOpen={isCartOpen}
        onClose={closeCart}
        title="Keranjang Belanja"
        eyebrow={`Koleksi Busana (${totalItems} item)`}
        side="right"
        maxWidth="w-full sm:max-w-[420px]"
        footer={footerContent}
      >
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <span className="font-serif text-2xl text-charcoal mb-2 font-light">
              Keranjang Masih Kosong
            </span>
            <p className="text-muted text-sm max-w-[28ch] mb-6 font-sans">
              Jelajahi pilihan busana santun terbaru dari {BRAND.name}.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="px-6 py-2.5 bg-charcoal text-white text-xs uppercase tracking-[0.16em] font-sans hover:bg-caramel-deep transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {items.map((item, index) => {
              const unitPrice =
                item.product.isSale && item.product.salePrice
                  ? item.product.salePrice
                  : item.product.price;

              return (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="py-4 flex gap-4 first:pt-0"
                >
                  <div className="w-20 h-24 shrink-0 bg-surface">
                    <SmartImage
                      slot={item.product.imageSlot1}
                      alt={item.product.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-serif text-charcoal text-base font-normal truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-muted font-sans mt-0.5 space-x-2">
                        <span>Ukuran: {item.size}</span>
                        <span>·</span>
                        <span>Warna: {item.color}</span>
                      </div>
                      <div className="font-serif text-charcoal text-sm mt-1 font-medium">
                        {formatRupiah(unitPrice)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-surface text-xs"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-sans text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-surface text-xs"
                          aria-label="Tambah jumlah"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-muted hover:text-charcoal p-1 transition-colors"
                        aria-label="Hapus produk"
                      >
                        <Trash2 size={15} className="stroke-[1.25]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>

      {/* Checkout Modal when proceeding */}
      {checkoutModalOpen && (
        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
        />
      )}
    </>
  );
};
