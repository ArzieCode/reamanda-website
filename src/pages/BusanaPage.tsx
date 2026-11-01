// ============================================================
// Page — Busana Muslimah Catalog (CMS + Dynamic Categories & Variants)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';
import { productService } from '../services/products';
import type { Product, ProductCategory, Collection } from '../types/busana';
import { QuickViewModal } from '../components/busana/QuickViewModal';
import { CardActionToolbar } from '../components/cms/CardActionToolbar';
import { AddSectionCard } from '../components/cms/AddSectionCard';
import { EditableText } from '../components/cms/EditableText';
import { Drawer } from '../components/ui/Drawer';
import { GalleryField } from '../components/cms/GalleryField';
import { Modal } from '../components/ui/Modal';
import { BRAND } from '../config/brand';
import { ArrowDown, ShoppingBag, Plus, RotateCcw } from 'lucide-react';

export const BusanaPage: React.FC = () => {
  const { products, isEditMode, isVisitorPreview, refreshProducts } = useAdmin();
  const { isStaff, hasPermission, currentUser } = useAuth();
  const { showToast } = useOverlay();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletedProduct, setDeletedProduct] = useState<Product | null>(null);

  // Add/Edit Product Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCollection, setFormCollection] = useState('');
  const [formPrice, setFormPrice] = useState(350000);
  const [formSalePrice, setFormSalePrice] = useState<number | undefined>(undefined);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formVariants, setFormVariants] = useState<any[]>([]);

  // Add Category Modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Add Collection Modal
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  // Filters & Sorting
  const activeCategory = searchParams.get('kategori') || 'Semua';
  const isSaleOnly = searchParams.get('filter') === 'sale';
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi'>('terbaru');

  const categories = productService.getCategories();
  const collections = productService.getCollections();

  const canEdit = isEditMode && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Visitors only see published products
    if (!isStaff || isVisitorPreview) {
      list = list.filter((p) => p.isPublished);
    }

    if (activeCategory !== 'Semua') {
      list = list.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
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
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, isStaff, isVisitorPreview, activeCategory, isSaleOnly, sortBy]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.name || 'Hijab & Scarf');
    setFormCollection(collections[0]?.name || 'Koleksi Raya Bersama 2025');
    setFormPrice(385000);
    setFormSalePrice(undefined);
    setFormImages([
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    ]);
    setFormVariants([
      { id: `v-${Date.now()}-1`, size: 'M', color: 'Hitam', sku: `RM-${Date.now().toString().slice(-4)}-M`, stock: 10 },
      { id: `v-${Date.now()}-2`, size: 'L', color: 'Sage Green', sku: `RM-${Date.now().toString().slice(-4)}-L`, stock: 8 },
    ]);
    setIsDrawerOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormCollection(p.collection);
    setFormPrice(p.price);
    setFormSalePrice(p.salePrice);
    setFormImages(p.images || []);
    setFormVariants(p.variants || []);
    setIsDrawerOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    productService.saveProduct(
      {
        id: editingProduct ? editingProduct.id : undefined,
        name: formName.trim(),
        category: formCategory,
        collection: formCollection,
        price: Number(formPrice),
        salePrice: formSalePrice ? Number(formSalePrice) : undefined,
        images: formImages,
        variants: formVariants,
        sizes: Array.from(new Set(formVariants.map((v) => v.size))),
        colors: Array.from(new Set(formVariants.map((v) => v.color))),
        material: editingProduct?.material || 'Serat Sutra Halus & Katun Dingin',
        care: editingProduct?.care || 'Cuci lembut suhu ruang',
        description: editingProduct?.description || 'Rancangan busana muslimah anggun khas Rea Manda.',
        isNewArrival: editingProduct ? editingProduct.isNewArrival : true,
        isSale: Boolean(formSalePrice && formSalePrice < formPrice),
        isPublished: true,
      },
      currentUser?.name || 'Admin'
    );

    refreshProducts();
    setIsDrawerOpen(false);
    showToast(editingProduct ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil ditambahkan.');
  };

  const handleDuplicateProduct = (id: string) => {
    const copy = productService.duplicateProduct(id, currentUser?.name || 'Admin');
    refreshProducts();
    showToast(`Produk diduplikasi: "${copy.name}".`);
  };

  const handleToggleProductVisibility = (id: string) => {
    const prod = productService.getProductById(id);
    if (prod) {
      productService.saveProduct({ ...prod, isPublished: !prod.isPublished }, currentUser?.name || 'Admin');
      refreshProducts();
      showToast(`Visibilitas produk diubah (${prod.isPublished ? 'disembunyikan' : 'ditampilkan'}).`);
    }
  };

  const handleDeleteProduct = (id: string) => {
    const deleted = productService.deleteProduct(id, currentUser?.name || 'Admin');
    setDeletedProduct(deleted);
    refreshProducts();
    showToast(`Produk "${deleted.name}" dihapus. Klik Urungkan untuk membatalkan.`);
  };

  const handleUndoDeleteProduct = () => {
    if (!deletedProduct) return;
    productService.restoreProduct(deletedProduct);
    setDeletedProduct(null);
    refreshProducts();
    showToast('Produk berhasil dikembalikan ke katalog.');
  };

  const handleSaveNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const cat = productService.saveCategory({
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sortOrder: categories.length + 1,
      isVisible: true,
    });
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    refreshProducts();
    showToast(`Kategori "${cat.name}" berhasil ditambahkan ke navigasi.`);
  };

  const handleSaveNewCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const col = productService.saveCollection({
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      slug: newCollectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCollectionDesc.trim() || 'Koleksi busana pilihan Rea Manda.',
    });
    setNewCollectionName('');
    setNewCollectionDesc('');
    setIsAddCollectionOpen(false);
    refreshProducts();
    showToast(`Koleksi "${col.name}" berhasil ditambahkan.`);
  };

  return (
    <div className="w-full bg-surface">
      {/* 1. Busana Hero with Display Typography & CTA */}
      <section className="relative w-full min-h-[460px] lg:min-h-[65vh] py-16 sm:py-20 bg-charcoal flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="site-container relative z-10 text-white space-y-4 editorial-enter">
          <img src="/rheamanda-fashion-logo.png" alt="Logo Busana Rheamanda" className="block w-20 h-20 object-contain brightness-0 invert" />
          <span className="label-editorial text-white/80 block">
            01 / 03 · {BRAND.name} Busana Muslimah
          </span>

          <h1 className="font-display text-white max-w-3xl font-light">
            <EditableText
              contentKey="busana.hero.title"
              defaultText="Siluet Teduh Bernilai Luhur"
            />
          </h1>

          <p className="text-white/90 text-sm sm:text-base max-w-lg font-sans font-light leading-relaxed">
            <EditableText
              contentKey="busana.hero.subtitle"
              defaultText="Eksplorasi tenun songket kontemporer dan voal premium yang dirancang untuk kenyamanan ibadah, silaturahmi, serta aktivitas harian wanita Indonesia."
              multiline
            />
          </p>

          <div className="pt-2">
            <a
              href="#terbaru"
              className="px-6 py-3 bg-white text-charcoal hover:bg-caramel-deep hover:text-white text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium rounded-[2px]"
            >
              <span>Jelajahi Produk Terbaru</span>
              <ArrowDown size={14} className="stroke-[1.25]" />
            </a>
          </div>
        </div>
      </section>

      {/* Undo Delete Banner */}
      {deletedProduct && (
        <div className="site-container pt-6">
          <div className="p-3 bg-surface border border-line rounded-[2px] flex items-center justify-between text-xs font-sans">
            <span className="text-muted">Produk "{deletedProduct.name}" baru saja dihapus.</span>
            <button
              type="button"
              onClick={handleUndoDeleteProduct}
              className="flex items-center gap-1 text-charcoal font-medium hover:text-caramel-deep"
            >
              <RotateCcw size={12} /> Urungkan Hapus Produk
            </button>
          </div>
        </div>
      )}

      {/* 2. Collections Showcase */}
      <section id="koleksi" className="py-16 site-container border-b border-line">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="label-editorial text-muted block mb-1">Arsip Koleksi</span>
            <h2 className="font-section-title text-charcoal">
              <EditableText
                contentKey="busana.collections.title"
                defaultText="Belanja Berdasarkan Koleksi"
              />
            </h2>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={() => setIsAddCollectionOpen(true)}
              className="px-3 py-1.5 border border-line hover:border-charcoal bg-white text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus size={13} /> Tambah Koleksi
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group bg-white border border-line p-3 cursor-pointer hover:border-charcoal transition-colors rounded-[2px]"
              onClick={() => {
                setSearchParams({ kategori: 'Semua' });
                const el = document.getElementById('terbaru');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="aspect-[3/4] overflow-hidden mb-3 bg-surface-2 rounded-[2px]">
                <img
                  src={col.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-charcoal text-base font-normal leading-tight mb-1">
                {col.name}
              </h3>
              <p className="text-[11px] text-muted font-sans line-clamp-2 m-0">
                {col.description}
              </p>
            </div>
          ))}

          {canEdit && (
            <AddSectionCard
              label="+ Tambah Koleksi"
              minHeight="min-h-[200px]"
              onClick={() => setIsAddCollectionOpen(true)}
            />
          )}
        </div>
      </section>

      {/* 3. Products Section Header & Dynamic Category Filters */}
      <section id="terbaru" className="section-padding site-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="label-editorial text-charcoal">Katalog Busana</span>
              {isSaleOnly && (
                <span className="bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium rounded-full">
                  FILTER: SALE AKTIF
                </span>
              )}
            </div>

            <h2 className="font-section-title text-charcoal">
              <EditableText
                contentKey="busana.catalog.title"
                defaultText={isSaleOnly ? 'Koleksi Promo & Penawaran Spesial' : 'Pilihan Busana Santun'}
              />
            </h2>

            <p className="text-xs text-muted font-sans mt-1">
              Menampilkan {filteredProducts.length} produk pilihan
            </p>
          </div>

          {/* Sort Controller & Add Button */}
          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-3.5 py-1.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1 font-medium transition-colors"
              >
                <Plus size={13} /> Tambah Produk
              </button>
            )}

            <span className="text-xs uppercase tracking-widest text-muted font-sans">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 border border-line text-xs font-sans text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
            >
              <option value="terbaru">Terbaru</option>
              <option value="harga-rendah">Harga Terendah</option>
              <option value="harga-tinggi">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Pills Strip */}
        <div id="kategori" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-line">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors rounded-[2px] ${
              activeCategory === 'Semua' && !isSaleOnly
                ? 'bg-charcoal text-white border-charcoal font-medium'
                : 'bg-white text-ink border-line hover:border-charcoal'
            }`}
          >
            Semua
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name && !isSaleOnly;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSearchParams({ kategori: cat.name })}
                className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors rounded-[2px] ${
                  isActive
                    ? 'bg-charcoal text-white border-charcoal font-medium'
                    : 'bg-white text-ink border-line hover:border-charcoal'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              if (isSaleOnly) setSearchParams({});
              else setSearchParams({ filter: 'sale' });
            }}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors flex items-center gap-1.5 rounded-[2px] ${
              isSaleOnly
                ? 'bg-sale text-white border-sale font-medium'
                : 'bg-white text-ink border-line hover:border-sale'
            }`}
          >
            <span>Sale Promo</span>
            <span className="bg-sale text-white px-1.5 py-0.2 text-[8px] tracking-widest font-sans rounded-full">
              %
            </span>
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() => setIsAddCategoryOpen(true)}
              className="px-3 py-2 text-xs uppercase tracking-wider font-sans whitespace-nowrap border border-dashed border-caramel-deep text-caramel-deep hover:bg-caramel-deep hover:text-white rounded-[2px] flex items-center gap-1 transition-colors"
            >
              <Plus size={13} /> Tambah Kategori
            </button>
          )}
        </div>

        {/* 4. Product Grid with Motion entrance & layout animations */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-muted font-sans text-sm bg-white border border-line rounded-[2px]">
            Tidak ada produk yang sesuai dengan kategori ini.
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="px-4 py-2 bg-charcoal text-white text-xs uppercase tracking-widest rounded-[2px]"
              >
                Lihat Semua Produk
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => {
                const totalStock = productService.getProductTotalStock(p);
                const displayPrice = p.isSale && p.salePrice ? p.salePrice : p.price;
                const isOutOfStock = totalStock === 0;

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group bg-white border border-line p-3 flex flex-col justify-between hover:border-charcoal transition-colors relative rounded-[2px]"
                  >
                    {/* Admin Action Toolbar */}
                    <CardActionToolbar
                      isVisible={p.isPublished}
                      onEdit={() => handleOpenEditProduct(p)}
                      onDuplicate={() => handleDuplicateProduct(p.id)}
                      onToggleVisibility={() => handleToggleProductVisibility(p.id)}
                      onDelete={() => handleDeleteProduct(p.id)}
                    />

                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-surface-2 rounded-[2px]">
                        <img
                          src={p.images[0] || '/rheamanda-mark.png'}
                          alt={p.name}
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105"
                        />

                        {/* Status Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          {p.isSale && (
                            <span className="bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium rounded-full">
                              SALE
                            </span>
                          )}
                          {!p.isPublished && (
                            <span className="bg-charcoal text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-sans rounded-xs">
                              Draf
                            </span>
                          )}
                        </div>

                        {/* Stock Warning Badge: "Sisa 3" or "Habis" */}
                        {isOutOfStock ? (
                          <span className="absolute bottom-2 left-2 bg-status-occupied text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-sans font-medium rounded-xs z-10">
                            Habis
                          </span>
                        ) : totalStock <= 5 && (
                          <span className="absolute bottom-2 left-2 bg-status-deposit text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-sans font-medium rounded-xs z-10">
                            Sisa {totalStock}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="label-editorial text-muted text-[10px] block mb-1">
                          {p.category} · {p.collection}
                        </span>
                        <h3 className="font-serif text-charcoal text-base font-normal leading-tight mb-2 group-hover:text-caramel-deep transition-colors truncate">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-charcoal text-sm font-medium">
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
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* "+ Tambah Produk" Card at the end of the grid */}
            {canEdit && (
              <AddSectionCard
                label="+ Tambah Produk Busana"
                minHeight="min-h-[280px]"
                onClick={handleOpenAddProduct}
              />
            )}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Product Drawer Form */}
      <Drawer
        id="busana-product-drawer"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? `Sunting Busana — ${editingProduct.name}` : 'Tambah Produk Busana Baru'}
        side="right"
        maxWidth="w-full sm:max-w-xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase text-muted mb-1">Nama Produk</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-muted mb-1">Kategori</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-2.5 py-2 border border-line bg-white rounded-[2px]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Koleksi</label>
              <select
                value={formCollection}
                onChange={(e) => setFormCollection(e.target.value)}
                className="w-full px-2.5 py-2 border border-line bg-white rounded-[2px]"
              >
                {collections.map((col) => (
                  <option key={col.id} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-muted mb-1">Harga Normal (Rp)</label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              />
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Harga Diskon (Rp)</label>
              <input
                type="number"
                min={0}
                step={1000}
                placeholder="Biarkan kosong jika tidak ada diskon"
                value={formSalePrice ?? ''}
                onChange={(e) => setFormSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              />
            </div>
          </div>

          {/* Varian */}
          <div className="space-y-2 pt-2 border-t border-line">
            <span className="block uppercase text-muted">Varian Ukuran, Warna & Stok</span>
            {formVariants.map((v, i) => (
              <div key={v.id || i} className="p-2.5 bg-surface border border-line rounded-[2px] grid grid-cols-4 gap-2 items-center text-xs">
                <div>
                  <span className="text-[10px] text-muted block">Ukuran</span>
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => {
                      const u = [...formVariants];
                      u[i].size = e.target.value;
                      setFormVariants(u);
                    }}
                    className="w-full px-2 py-1 bg-white border border-line rounded-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Warna</span>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const u = [...formVariants];
                      u[i].color = e.target.value;
                      setFormVariants(u);
                    }}
                    className="w-full px-2 py-1 bg-white border border-line rounded-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Stok</span>
                  <input
                    type="number"
                    min={0}
                    value={v.stock}
                    onChange={(e) => {
                      const u = [...formVariants];
                      u[i].stock = Number(e.target.value);
                      setFormVariants(u);
                    }}
                    className="w-full px-2 py-1 bg-white border border-line rounded-xs"
                  />
                </div>
                <div className="text-right pt-3">
                  <button
                    type="button"
                    disabled={formVariants.length <= 1}
                    onClick={() => setFormVariants((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-status-occupied text-xs hover:underline disabled:opacity-30"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <span className="block uppercase text-muted mb-1">Galeri Foto Produk</span>
            <GalleryField images={formImages} onChange={setFormImages} />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] font-medium"
          >
            Simpan Produk Busana
          </button>
        </form>
      </Drawer>

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <Modal
          id="add-cat-modal"
          isOpen={isAddCategoryOpen}
          onClose={() => setIsAddCategoryOpen(false)}
          title="Tambah Kategori Busana Baru"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveNewCategory} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block uppercase text-muted mb-1">Nama Kategori</label>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Misal: Kaftan & Sutra"
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest rounded-[2px]"
            >
              Simpan Kategori
            </button>
          </form>
        </Modal>
      )}

      {/* Add Collection Modal */}
      {isAddCollectionOpen && (
        <Modal
          id="add-col-modal"
          isOpen={isAddCollectionOpen}
          onClose={() => setIsAddCollectionOpen(false)}
          title="Tambah Koleksi Baru"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveNewCollection} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block uppercase text-muted mb-1">Nama Koleksi</label>
              <input
                type="text"
                required
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Misal: Senja Kahyangan"
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              />
            </div>
            <div>
              <label className="block uppercase text-muted mb-1">Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest rounded-[2px]"
            >
              Simpan Koleksi
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
