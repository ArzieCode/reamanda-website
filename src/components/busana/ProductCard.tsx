// ============================================================
// ProductCard — 3:4 photo, second image hover, badges, wishlist toggle, quick add
// ============================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/busana';
import Placeholder from '../ui/Placeholder';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Heart } from 'lucide-react';
import QuickAddModal from '../modals/QuickAddModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { format } = useCurrency();

  const isFavorited = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  return (
    <>
      <article className="relative">
        <Link
          to={`/busana/produk/${product.slug}`}
          className="block group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Photo area — 3:4, second image fades in on hover */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            {/* Primary image */}
            <div
              className="absolute inset-0 transition-opacity duration-400"
              style={{ opacity: hovered ? 0 : 1 }}
            >
              <Placeholder ratio="3/4" label={product.name} className="w-full h-full" />
            </div>

            {/* Secondary image */}
            <div
              className="absolute inset-0 transition-opacity duration-400"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <Placeholder ratio="3/4" label={`${product.name} 2`} className="w-full h-full" />
            </div>

            {/* Badges (Top Left) */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNewArrival && (
                <span
                  className="nav-label px-2 py-0.5 text-white"
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.14em',
                    backgroundColor: 'var(--charcoal)',
                  }}
                >
                  TERBARU
                </span>
              )}
              {product.isSale && (
                <span
                  className="nav-label px-2 py-0.5 text-white rounded-full"
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.14em',
                    backgroundColor: 'var(--sale)',
                  }}
                >
                  SALE
                </span>
              )}
            </div>

            {/* Wishlist Heart Button (Top Right) */}
            <button
              onClick={handleWishlistClick}
              aria-label={isFavorited ? `Hapus ${product.name} dari Wishlist` : `Simpan ${product.name} ke Wishlist`}
              className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-bg/80 backdrop-blur-xs flex items-center justify-center text-charcoal hover:bg-bg transition-all shadow-xs focus-visible:outline-none"
            >
              <Heart
                size={16}
                color={isFavorited ? 'var(--sale)' : 'var(--charcoal)'}
                fill={isFavorited ? 'var(--sale)' : 'none'}
                strokeWidth={1.5}
              />
            </button>

            {/* Tambah button — appears on hover (or accessible on touch via button) */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-400 z-10"
              style={{
                transform: hovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: hovered ? 1 : 0,
              }}
            >
              <button
                onClick={handleQuickAddClick}
                className="w-full nav-label py-3 text-white transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  backgroundColor: 'var(--charcoal)',
                }}
              >
                + PILIH UKURAN & TAMBAH
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 space-y-1">
            <p
              className="nav-label text-charcoal truncate"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              {product.name}
            </p>
            <div className="flex items-center gap-2">
              {product.isSale && product.salePrice ? (
                <>
                  <span
                    className="text-sm font-light"
                    style={{ color: 'var(--sale)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                  >
                    {format(product.salePrice)}
                  </span>
                  <span
                    className="text-xs font-light line-through"
                    style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}
                  >
                    {format(product.price)}
                  </span>
                </>
              ) : (
                <span
                  className="text-sm font-light"
                  style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                >
                  {format(product.price)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </article>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        product={product}
      />
    </>
  );
}
