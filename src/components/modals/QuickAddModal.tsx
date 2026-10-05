// ============================================================
// Modal — Quick Add Size & Color Selector
// Appears when clicking "+ TAMBAH" on Product Cards
// ============================================================
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/busana';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickAddModal({ isOpen, onClose, product }: QuickAddModalProps) {
  const { addItem, toggleCart } = useCart();
  const { format } = useCurrency();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? 'All Size');
      setSelectedColor(product.colors[0] ?? 'Default');
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, 1);
    onClose();
    toggleCart(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.5)' }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Pilih Ukuran ${product.name}`}
      >
        <div
          className="pointer-events-auto w-full max-w-sm bg-bg border border-line p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-line pb-4 mb-5">
            <div>
              <p className="nav-label text-charcoal truncate" style={{ fontSize: '12px', letterSpacing: '0.14em' }}>
                {product.name}
              </p>
              <p className="text-sm font-light text-charcoal mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                {format(product.salePrice ?? product.price)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup pemilihan ukuran"
            >
              <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
            </button>
          </div>

          {/* Size picker */}
          <div className="mb-5">
            <p className="nav-label text-muted mb-2.5" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
              PILIH UKURAN:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className="nav-label min-h-[44px] min-w-[44px] px-3.5 py-2 border transition-all focus-visible:outline-none"
                  style={{
                    fontSize: '11px',
                    borderColor: selectedSize === s ? 'var(--charcoal)' : 'var(--line)',
                    backgroundColor: selectedSize === s ? 'var(--surface)' : 'transparent',
                    color: selectedSize === s ? 'var(--charcoal)' : 'var(--muted)',
                  }}
                  aria-pressed={selectedSize === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-6">
            <p className="nav-label text-muted mb-2.5" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
              WARNA: <span className="text-charcoal font-normal">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className="nav-label min-h-[44px] px-3.5 py-2 border transition-all focus-visible:outline-none"
                  style={{
                    fontSize: '11px',
                    borderColor: selectedColor === c ? 'var(--charcoal)' : 'var(--line)',
                    backgroundColor: selectedColor === c ? 'var(--surface)' : 'transparent',
                    color: selectedColor === c ? 'var(--charcoal)' : 'var(--muted)',
                  }}
                  aria-pressed={selectedColor === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 nav-label min-h-[44px] py-3.5 text-white transition-opacity hover:opacity-85 focus-visible:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              backgroundColor: 'var(--charcoal)',
            }}
          >
            <ShoppingBag size={14} />
            TAMBAH KE KERANJANG
          </button>
        </div>
      </div>
    </>
  );
}
