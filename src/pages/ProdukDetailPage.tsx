// ============================================================
// Product Detail Page (/busana/produk/:slug)
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Placeholder from '../components/ui/Placeholder';
import ProductCard from '../components/busana/ProductCard';
import { getProduct, getProducts } from '../services/busana';
import type { Product } from '../types/busana';
import { formatRupiah } from '../utils/format';
import { useCart } from '../context/CartContext';

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left transition-opacity duration-400 hover:opacity-70"
      >
        <span className="nav-label" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>
          {title.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.25}
          color="var(--charcoal)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease' }}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.8 }}>
            {children}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProdukDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const { dispatch } = useCart();

  useEffect(() => {
    Promise.all([
      getProduct(slug ?? ''),
      getProducts(),
    ]).then(([prod, all]) => {
      setProduct(prod);
      if (prod) {
        setSelectedSize(prod.sizes[0]);
        setSelectedColor(prod.colors[0]);
        setRelated(all.filter((p) => p.id !== prod.id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({ type: 'ADD_ITEM', payload: { product, size: selectedSize, color: selectedColor } });
    // Add `quantity - 1` more if > 1
    for (let i = 1; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: { product, size: selectedSize, color: selectedColor } });
    }
    dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Placeholder ratio="3/4" />
          <div className="space-y-4">
            <div className="h-6 bg-surface w-48" />
            <div className="h-4 bg-surface w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 text-center">
        <p className="font-cormorant text-2xl font-light mb-4" style={{ color: 'var(--charcoal)' }}>
          Produk tidak ditemukan
        </p>
        <Link to="/busana" className="nav-label" style={{ fontSize: '11px', color: 'var(--caramel)' }}>
          ← Kembali ke Busana
        </Link>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const thumbs = [0, 1, 2, 3]; // 4 placeholder thumbnails

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-28 md:pb-36 pt-4">
        {/* Breadcrumb */}
        <div className="flex gap-2 py-4 border-b mb-10" style={{ borderColor: 'var(--line)' }}>
          <Link to="/busana" className="nav-label hover:opacity-60 transition-opacity" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em' }}>BUSANA</Link>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--muted)' }}>/</span>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="mb-3">
              <Placeholder ratio="3/4" label={`${product.name} — ${activeThumb + 1}`} className="w-full" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {thumbs.map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className="transition-opacity duration-400"
                  style={{ opacity: activeThumb === i ? 1 : 0.5 }}
                  aria-label={`Gambar ${i + 1}`}
                >
                  <Placeholder ratio="1/1" label={`${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p className="nav-label mb-2" style={{ fontSize: '10px', color: 'var(--caramel-deep)', letterSpacing: '0.18em' }}>
              {product.collection.toUpperCase()}
            </p>
            <h1
              className="font-cormorant font-light mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--charcoal)', letterSpacing: '0.06em' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-light" style={{ color: product.isSale ? 'var(--sale)' : 'var(--ink)', fontFamily: 'Jost', fontSize: '18px' }}>
                {formatRupiah(displayPrice)}
              </span>
              {product.isSale && (
                <span className="font-light line-through" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '14px' }}>
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="nav-label mb-3" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
                UKURAN
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="nav-label px-4 py-2 border transition-all duration-400"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      borderColor: selectedSize === s ? 'var(--charcoal)' : 'var(--line)',
                      color: selectedSize === s ? 'var(--charcoal)' : 'var(--muted)',
                      backgroundColor: selectedSize === s ? 'var(--surface)' : 'transparent',
                    }}
                    aria-pressed={selectedSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour selector */}
            <div className="mb-6">
              <p className="nav-label mb-3" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
                WARNA: <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="nav-label px-3 py-1 border transition-all duration-400"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      borderColor: selectedColor === c ? 'var(--charcoal)' : 'var(--line)',
                      color: selectedColor === c ? 'var(--charcoal)' : 'var(--muted)',
                    }}
                    aria-pressed={selectedColor === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="nav-label mb-3" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
                JUMLAH
              </p>
              <div className="flex items-center gap-0 border w-fit" style={{ borderColor: 'var(--line)' }}>
                <button
                  className="px-4 py-3 transition-opacity hover:opacity-60 nav-label"
                  style={{ fontSize: '14px', color: 'var(--charcoal)' }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span
                  className="px-5 text-sm font-light"
                  style={{ color: 'var(--ink)', fontFamily: 'Jost', minWidth: 40, textAlign: 'center' }}
                >
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 transition-opacity hover:opacity-60 nav-label"
                  style={{ fontSize: '14px', color: 'var(--charcoal)' }}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className="nav-label w-full py-4 text-white mb-4 transition-opacity duration-400 hover:opacity-80"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                backgroundColor: 'var(--charcoal)',
              }}
            >
              TAMBAH KE KERANJANG
            </button>

            {/* Accordions */}
            <div className="mt-6 border-t" style={{ borderColor: 'var(--line)' }}>
              <Accordion title="Material">{product.material}</Accordion>
              <Accordion title="Perawatan">{product.care}</Accordion>
              <Accordion title="Deskripsi">{product.description}</Accordion>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t" style={{ borderColor: 'var(--line)' }}>
            <p className="nav-label text-center mb-10" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
              PRODUK LAINNYA
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
