// ============================================================
// Koleksi Page (/busana/koleksi/:slug)
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/busana/ProductCard';
import FilterDrawer from '../components/busana/FilterDrawer';
import { getProducts, getCollections } from '../services/busana';
import type { Product, Collection } from '../types/busana';

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-asc', label: 'Harga Terendah' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'name', label: 'Nama A–Z' },
];

export default function KoleksiPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    Promise.all([
      getProducts({ collection: slug }),
      getCollections(),
    ]).then(([prods, cols]) => {
      setProducts(prods);
      setCollection(cols.find((c) => c.slug === slug) ?? null);
      setLoading(false);
    });
  }, [slug]);

  const filtered = products
    .filter((p) => selectedSizes.length === 0 || selectedSizes.some((s) => p.sizes.includes(s)))
    .filter((p) => selectedColors.length === 0 || selectedColors.some((c) => p.colors.includes(c)))
    .filter((p) => !minPrice || (p.salePrice ?? p.price) >= Number(minPrice))
    .filter((p) => !maxPrice || (p.salePrice ?? p.price) <= Number(maxPrice));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    if (sortBy === 'price-desc') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    if (field === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

  const reset = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <>
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        selectedSizes={selectedSizes}
        selectedColors={selectedColors}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onToggleSize={toggleSize}
        onToggleColor={toggleColor}
        onPriceChange={handlePriceChange}
        onReset={reset}
      />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-28 md:pb-36 pt-4">
        {/* Breadcrumb */}
        <div className="flex gap-2 py-4 border-b mb-8" style={{ borderColor: 'var(--line)' }}>
          <Link to="/busana" className="nav-label transition-opacity hover:opacity-60" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
            BUSANA
          </Link>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--muted)' }}>/</span>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>
            {collection?.name ?? slug?.toUpperCase()}
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1
            className="font-cormorant font-light mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--charcoal)' }}
          >
            {collection?.name ?? slug}
          </h1>
          {collection?.description && (
            <p className="font-light max-w-2xl" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.8 }}>
              {collection.description}
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 nav-label border min-h-[44px] px-5 transition-all duration-400 hover:opacity-70 focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.14em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          >
            <SlidersHorizontal size={14} strokeWidth={1.25} />
            FILTER
            {(selectedSizes.length + selectedColors.length) > 0 && (
              <span
                className="ml-1 rounded-full px-2 py-0.5 text-white"
                style={{ fontSize: '9px', backgroundColor: 'var(--caramel)', fontWeight: 500 }}
              >
                {selectedSizes.length + selectedColors.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <p className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '13px' }}>
              {sorted.length} produk
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="nav-label border min-h-[44px] px-4 transition-all duration-400 hover:opacity-70 bg-transparent focus-visible:outline-none"
              style={{ fontSize: '11px', letterSpacing: '0.12em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid: 2 mobile, 3 tablet, 4 desktop */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="aspect-[3/4] bg-surface" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-cormorant font-light text-2xl mb-3" style={{ color: 'var(--charcoal)' }}>
              Tidak ada produk
            </p>
            <p className="text-sm font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>
              Coba sesuaikan pilihan filter Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
