import React, { useState } from 'react';
import type { BusanaProduct } from '../../data/busana';
import { useCart } from '../../context/CartContext';
import { useOverlay } from '../../context/OverlayContext';
import { Modal } from '../ui/Modal';
import { SmartImage } from '../ui/SmartImage';
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface QuickViewModalProps {
  product: BusanaProduct | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { showToast } = useOverlay();

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Standar');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageSlot, setActiveImageSlot] = useState<string>(product?.imageSlot1 || '');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    showToast(`${product.name} ditambahkan ke keranjang.`);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 500);
  };

  const currentPrice = product.isSale && product.salePrice ? product.salePrice : product.price;

  return (
    <Modal
      id="quick-view-modal"
      isOpen={Boolean(product)}
      onClose={onClose}
      maxWidth="3xl"
      hideHeader
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -m-5 sm:-m-8">
        {/* Images Column */}
        <div className="p-6 bg-surface flex flex-col gap-3">
          <div className="w-full aspect-[3/4] bg-surface-2 border border-line" style={{ borderRadius: '2px' }}>
            <SmartImage
              slot={activeImageSlot || product.imageSlot1}
              alt={product.name}
              aspectRatio="3:4"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveImageSlot(product.imageSlot1)}
              className={`w-14 h-18 border transition-all ${
                activeImageSlot === product.imageSlot1 || !activeImageSlot
                  ? 'border-charcoal opacity-100 ring-1 ring-charcoal'
                  : 'border-line opacity-60 hover:opacity-100'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <SmartImage slot={product.imageSlot1} aspectRatio="3:4" className="w-full h-full" />
            </button>
            <button
              type="button"
              onClick={() => setActiveImageSlot(product.imageSlot2)}
              className={`w-14 h-18 border transition-all ${
                activeImageSlot === product.imageSlot2
                  ? 'border-charcoal opacity-100 ring-1 ring-charcoal'
                  : 'border-line opacity-60 hover:opacity-100'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <SmartImage slot={product.imageSlot2} aspectRatio="3:4" className="w-full h-full" />
            </button>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="label-editorial text-muted">{product.collection}</span>
              {product.isSale && (
                <span
                  className="bg-sale text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] font-sans font-medium"
                  style={{ borderRadius: '9999px' }}
                >
                  Sale
                </span>
              )}
            </div>

            <h3 className="font-serif text-charcoal text-2xl font-normal leading-tight mb-3">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-charcoal text-xl font-medium">
                {formatRupiah(currentPrice)}
              </span>
              {product.isSale && product.salePrice && (
                <span className="text-xs text-muted line-through font-sans">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-ink leading-relaxed font-sans mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-sans">
                Pilihan Ukuran
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-8 px-3 text-xs font-sans tracking-wider border transition-colors ${
                      selectedSize === size
                        ? 'border-charcoal bg-charcoal text-white'
                        : 'border-line text-ink hover:border-charcoal'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-sans">
                Pilihan Warna
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 px-3 text-xs font-sans tracking-wider border transition-colors ${
                      selectedColor === color
                        ? 'border-charcoal bg-charcoal text-white'
                        : 'border-line text-ink hover:border-charcoal'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="pt-4 border-t border-line flex items-center gap-3">
            <div className="flex items-center border border-line" style={{ borderRadius: '2px' }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-surface"
                aria-label="Kurangi jumlah"
              >
                <Minus size={14} className="stroke-[1.25]" />
              </button>
              <span className="w-8 text-center text-xs font-sans text-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-surface"
                aria-label="Tambah jumlah"
              >
                <Plus size={14} className="stroke-[1.25]" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={added}
              className="flex-1 h-10 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors flex items-center justify-center gap-2"
              style={{ borderRadius: '2px' }}
            >
              {added ? (
                <>
                  <Check size={14} className="stroke-[1.5]" />
                  <span>Ditambahkan ke Keranjang</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} className="stroke-[1.25]" />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
