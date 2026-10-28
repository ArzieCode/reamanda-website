import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import type { BusanaProduct } from '../data/busana';
import { BUSANA_COLLECTIONS } from '../data/busana';
import { QuickViewModal } from '../components/busana/QuickViewModal';
import { Modal } from '../components/ui/Modal';
import { BRAND } from '../config/brand';
import { ArrowDown, Edit2, ShoppingBag } from 'lucide-react';

export const BusanaPage: React.FC = () => {
  const { products, isEditMode, updateProduct } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<BusanaProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<BusanaProduct | null>(null);

  // Filters and sort
  const activeCategory = searchParams.get('kategori') || 'Semua';
  const isSaleOnly = searchParams.get('filter') === 'sale';
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi'>('terbaru');

  const categories = ['Semua', 'Hijab', 'Blouse', 'Tunik', 'Abaya', 'Scarf', 'Gaun', 'Outerwear', 'Mukena'];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'Semua') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (isSaleOnly) {
      list = list.filter((p) => p.isSale);
    }

    if (sortBy === 'harga-rendah') {
      list.sort((a, b) => {
        const pa = a.isSale && a.salePrice ? a.salePrice : a.price;
        const pb = b.isSale && b.salePrice ? b.salePrice : b.price;
        return pa - pb;
      });
    } else if (sortBy === 'harga-tinggi') {
      list.sort((a, b) => {
        const pa = a.isSale && a.salePrice ? a.salePrice : a.price;
        const pb = b.isSale && b.salePrice ? b.salePrice : b.price;
        return pb - pa;
      });
    }

    return list;
  }, [products, activeCategory, isSaleOnly, sortBy]);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  return (
    <div className="w-full bg-surface">
      {/* 1. Busana Hero with Display Typography & CTA */}
      <section className="relative w-full min-h-[460px] lg:min-h-[65vh] py-16 sm:py-20 bg-charcoal flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage
            slot="busana-hero"
            aspectRatio="custom"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="site-container relative z-10 text-white space-y-4">
          <img src="/rheamanda-fashion-logo.png" alt="Logo Busana Rheamanda" className="block w-20 h-20 object-contain brightness-0 invert" />
          <span className="label-editorial text-white/80 block">
            {BRAND.name} Busana Muslimah · Koleksi 2025
          </span>
          <h1 className="font-display text-white max-w-3xl font-light">
            Siluet Teduh Bernilai Luhur
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-lg font-sans font-light leading-relaxed">
            Eksplorasi tenun songket kontemporer dan voal premium yang dirancang untuk kenyamanan ibadah, silaturahmi, serta aktivitas harian wanita Indonesia.
          </p>
          <div className="pt-2">
            <a
              href="#terbaru"
              className="px-6 py-3 bg-white text-charcoal hover:bg-caramel-deep hover:text-white text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <span>Jelajahi Produk Terbaru</span>
              <ArrowDown size={14} className="stroke-[1.25]" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Collections Showcase */}
      <section id="koleksi" className="py-16 site-container border-b border-line">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="label-editorial text-muted block mb-1">Arsip Koleksi</span>
          <h2 className="font-section-title text-charcoal">
            Belanja Berdasarkan Koleksi
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BUSANA_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="group bg-white border border-line p-3 cursor-pointer hover:border-charcoal transition-colors"
              onClick={() => {
                setSearchParams({ kategori: 'Semua' });
                const el = document.getElementById('terbaru');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="aspect-[3/4] overflow-hidden mb-3 bg-surface-2">
                <SmartImage
                  slot={col.imageSlot}
                  alt={col.name}
                  aspectRatio="3:4"
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-charcoal text-base font-normal leading-tight mb-1">
                {col.name}
              </h3>
              <p className="text-[11px] text-muted font-sans line-clamp-2 m-0">
                {col.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Products Section Header & Filters */}
      <section id="terbaru" className="section-padding site-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="label-editorial text-charcoal">Katalog Busana</span>
              {isSaleOnly && (
                <span
                  className="bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium"
                  style={{ borderRadius: '9999px' }}
                >
                  FILTER: SALE AKTIF
                </span>
              )}
            </div>
            <h2 className="font-section-title text-charcoal">
              {isSaleOnly ? 'Koleksi Promo & Penawaran Spesial' : 'Pilihan Busana Santun'}
            </h2>
            <p className="text-xs text-muted font-sans mt-1">
              Menampilkan {filteredProducts.length} produk pilihan
            </p>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted font-sans">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 border border-line text-xs font-sans text-ink focus:border-charcoal focus:outline-none bg-white"
              style={{ borderRadius: '2px' }}
            >
              <option value="terbaru">Terbaru</option>
              <option value="harga-rendah">Harga Terendah</option>
              <option value="harga-tinggi">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div id="kategori" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-line">
          {categories.map((cat) => {
            const isActive = activeCategory === cat && !isSaleOnly;
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'Semua') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ kategori: cat });
                  }
                }}
                className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors ${
                  isActive
                    ? 'bg-charcoal text-white border-charcoal font-medium'
                    : 'bg-white text-ink border-line hover:border-charcoal'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {cat}
              </button>
            );
          })}

          <button
            onClick={() => {
              if (isSaleOnly) {
                setSearchParams({});
              } else {
                setSearchParams({ filter: 'sale' });
              }
            }}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
              isSaleOnly
                ? 'bg-sale text-white border-sale font-medium'
                : 'bg-white text-ink border-line hover:border-sale'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <span>Sale Promo</span>
            <span
              className="bg-sale text-white px-1.5 py-0.2 text-[8px] tracking-widest font-sans"
              style={{ borderRadius: '9999px' }}
            >
              %
            </span>
          </button>
        </div>

        {/* 4. Product Grid (Minimum 8 products with 3:4 aspect ratio & image swap) */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-muted font-sans text-sm bg-white border border-line">
            Tidak ada produk yang sesuai dengan kategori ini.
            <div className="mt-4">
              <button
                onClick={() => setSearchParams({})}
                className="px-4 py-2 bg-charcoal text-white text-xs uppercase tracking-widest"
                style={{ borderRadius: '2px' }}
              >
                Lihat Semua Produk
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const displayPrice = p.isSale && p.salePrice ? p.salePrice : p.price;
              return (
                <div
                  key={p.id}
                  className="group bg-white border border-line p-3 flex flex-col justify-between hover:border-charcoal transition-colors relative"
                  style={{ borderRadius: '2px' }}
                >
                  {/* Inline Admin Edit trigger */}
                  {isEditMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(p);
                      }}
                      className="absolute top-2 right-2 z-20 p-1.5 bg-indigo text-white hover:opacity-90 shadow-none"
                      style={{ borderRadius: '2px' }}
                      title="Edit produk ini"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}

                  <div
                    className="cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    {/* 3:4 Aspect Ratio Image with Hover Swap */}
                    <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-surface-2">
                      <SmartImage
                        slot={p.imageSlot1}
                        alt={p.name}
                        aspectRatio="3:4"
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <SmartImage
                          slot={p.imageSlot2}
                          alt={`${p.name} tampak alternatif`}
                          aspectRatio="3:4"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {p.isSale && (
                        <span
                          className="absolute top-2 left-2 bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium z-10"
                          style={{ borderRadius: '9999px' }}
                        >
                          SALE
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-muted font-sans mb-1">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>{p.collection}</span>
                      </div>

                      <h3 className="font-serif text-charcoal text-base sm:text-lg font-normal leading-tight mb-2 group-hover:text-caramel-deep transition-colors line-clamp-1">
                        {p.name}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-serif text-charcoal text-base font-normal">
                          Rp {displayPrice.toLocaleString('id-ID')}
                        </span>
                        {p.isSale && p.salePrice && (
                          <span className="text-xs text-muted line-through font-sans">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="w-full py-2 border border-line text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:bg-charcoal hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    style={{ borderRadius: '2px' }}
                  >
                    <ShoppingBag size={13} className="stroke-[1.25]" />
                    <span>Pilih Ukuran</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Admin Inline Edit Modal */}
      {editingProduct && (
        <Modal
          id="admin-edit-product-modal"
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          maxWidth="md"
          title={`Edit Data Produk: ${editingProduct.name}`}
          eyebrow="Mode Administrator"
        >
          <form onSubmit={handleEditSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Nama Produk</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-muted mb-1 uppercase tracking-wider">Harga Normal (Rp)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="block text-muted mb-1 uppercase tracking-wider">Harga Diskon (Rp)</label>
                <input
                  type="number"
                  value={editingProduct.salePrice || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="saleCheck"
                checked={editingProduct.isSale}
                onChange={(e) => setEditingProduct({ ...editingProduct, isSale: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="saleCheck" className="text-charcoal cursor-pointer">
                Tampilkan Badge SALE
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-line text-muted hover:text-charcoal transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo text-white uppercase tracking-wider transition-opacity hover:opacity-90 font-medium"
                style={{ borderRadius: '2px' }}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
