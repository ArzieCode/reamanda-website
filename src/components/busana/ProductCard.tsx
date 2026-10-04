// ============================================================
// ProductCard — 3:4 photo, hover second image, badges, Tambah
// ============================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/busana';
import Placeholder from '../ui/Placeholder';
import { formatRupiah } from '../../utils/format';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        size: product.sizes[0],
        color: product.colors[0],
      },
    });
    dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  return (
    <article>
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span
                className="nav-label px-2 py-0.5 text-white"
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.14em',
                  backgroundColor: 'var(--charcoal)',
                }}
              >
                NEW ARRIVAL
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

          {/* Tambah button — appears on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-400"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              opacity: hovered ? 1 : 0,
            }}
          >
            <button
              onClick={handleAddToCart}
              className="w-full nav-label py-3 text-white transition-opacity duration-400 hover:opacity-80"
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                backgroundColor: 'var(--charcoal)',
              }}
            >
              + TAMBAH
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p
            className="nav-label"
            style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}
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
                  {formatRupiah(product.salePrice)}
                </span>
                <span
                  className="text-xs font-light line-through"
                  style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}
                >
                  {formatRupiah(product.price)}
                </span>
              </>
            ) : (
              <span
                className="text-sm font-light"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                {formatRupiah(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
