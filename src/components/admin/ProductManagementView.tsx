// ============================================================
// Component — Product Management (Table, Filters, Bulk, Drawer, Stock)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { productService } from '../../services/products';
import type { Product, ProductVariant, StockMovement } from '../../types/busana';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { GalleryField } from '../cms/GalleryField';
import {
  Search,
  Plus,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Edit,
  RotateCcw,
  Package,
  Layers,
  History,
  AlertTriangle,
  Check,
} from 'lucide-react';

export const ProductManagementView: React.FC = () => {
  const { products, refreshProducts } = useAdmin();
  const { currentUser, hasPermission } = useAuth();
  const { showToast } = useOverlay();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out_of_stock' | 'in_stock'>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'date'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk selections
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'info' | 'harga' | 'varian' | 'foto' | 'seo'>('info');

  // Form fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Hijab & Scarf');
  const [formCollection, setFormCollection] = useState('Koleksi Raya Bersama 2025');
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsSale, setFormIsSale] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formDesc, setFormDesc] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formSalePrice, setFormSalePrice] = useState<number | undefined>(undefined);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDesc, setFormSeoDesc] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Stock Movement Log Modal
  const [isStockLogOpen, setIsStockLogOpen] = useState(false);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  // Manual Stock Adjustment Modal
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Penyesuaian stok opname fisik gudang');
  const [adjustVariantId, setAdjustVariantId] = useState<string | undefined>(undefined);

  const categories = productService.getCategories();
  const collections = productService.getCollections();

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.variants?.some((v) => v.sku.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedCollection !== 'all') {
      list = list.filter((p) => p.collection === selectedCollection);
    }

    if (statusFilter === 'published') {
      list = list.filter((p) => p.isPublished);
    } else if (statusFilter === 'draft') {
      list = list.filter((p) => !p.isPublished);
    }

    if (stockFilter === 'low') {
      list = list.filter((p) => {
        const s = productService.getProductTotalStock(p);
        return s <= 5 && s > 0;
      });
    } else if (stockFilter === 'out_of_stock') {
      list = list.filter((p) => productService.getProductTotalStock(p) === 0);
    } else if (stockFilter === 'in_stock') {
      list = list.filter((p) => productService.getProductTotalStock(p) > 5);
    }

    // Sort
    list.sort((a, b) => {
      if (sortField === 'name') return a.name.localeCompare(b.name);
      if (sortField === 'price') return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortField === 'stock') {
        return productService.getProductTotalStock(a) - productService.getProductTotalStock(b);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [products, searchQuery, selectedCategory, selectedCollection, statusFilter, stockFilter, sortField]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddDrawer = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormCategory(categories[0]?.name || 'Hijab & Scarf');
    setFormCollection(collections[0]?.name || 'Koleksi Raya Bersama 2025');
    setFormIsNew(true);
    setFormIsSale(false);
    setFormIsPublished(true);
    setFormDesc('');
    setFormMaterial('');
    setFormCare('');
    setFormPrice(350000);
    setFormSalePrice(undefined);
    setFormVariants([
      { id: `v-init-1`, size: 'M', color: 'Hitam', sku: `RM-${Date.now().toString().slice(-4)}-M`, stock: 10 },
      { id: `v-init-2`, size: 'L', color: 'Hitam', sku: `RM-${Date.now().toString().slice(-4)}-L`, stock: 8 },
    ]);
    setFormImages(['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop']);
    setFormSeoTitle('');
    setFormSeoDesc('');
    setValidationErrors({});
    setActiveFormTab('info');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormCategory(product.category);
    setFormCollection(product.collection);
    setFormIsNew(product.isNewArrival);
    setFormIsSale(product.isSale);
    setFormIsPublished(product.isPublished);
    setFormDesc(product.description);
    setFormMaterial(product.material);
    setFormCare(product.care);
    setFormPrice(product.price);
    setFormSalePrice(product.salePrice);
    setFormVariants(product.variants || []);
    setFormImages(product.images || []);
    setFormSeoTitle(product.seoTitle || '');
    setFormSeoDesc(product.seoDescription || '');
    setValidationErrors({});
    setActiveFormTab('info');
    setIsDrawerOpen(true);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = 'Nama produk wajib diisi.';
    if (formPrice <= 0) errs.price = 'Harga produk harus lebih dari 0.';
    if (formImages.length === 0) errs.images = 'Minimal lampirkan 1 foto produk.';
    if (formVariants.length === 0) errs.variants = 'Minimal buat 1 varian produk (ukuran & warna).';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon lengkapi kolom yang wajib diisi.');
      return;
    }

    const sizes = Array.from(new Set(formVariants.map((v) => v.size)));
    const colors = Array.from(new Set(formVariants.map((v) => v.color)));

    productService.saveProduct(
      {
        id: editingProduct ? editingProduct.id : undefined,
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        category: formCategory,
        collection: formCollection,
        isNewArrival: formIsNew,
        isSale: formIsSale,
        isPublished: formIsPublished,
        description: formDesc.trim(),
        material: formMaterial.trim(),
        care: formCare.trim(),
        price: Number(formPrice),
        salePrice: formSalePrice ? Number(formSalePrice) : undefined,
        variants: formVariants,
        sizes,
        colors,
        images: formImages,
        seoTitle: formSeoTitle.trim(),
        seoDescription: formSeoDesc.trim(),
      },
      currentUser?.name || 'Admin'
    );

    refreshProducts();
    setIsDrawerOpen(false);
    showToast(editingProduct ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil ditambahkan.');
  };

  const handleDuplicate = (id: string) => {
    const copy = productService.duplicateProduct(id, currentUser?.name || 'Admin');
    refreshProducts();
    showToast(`Produk diduplikasi: "${copy.name}".`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      const deleted = productService.deleteProduct(id, currentUser?.name || 'Admin');
      refreshProducts();
      showToast(`Produk "${deleted.name}" dihapus. Klik Urungkan untuk membatalkan.`);
    }
  };

  const handleBulkToggleVisibility = (publish: boolean) => {
    productService.bulkToggleVisibility(selectedProductIds, publish);
    refreshProducts();
    setSelectedProductIds([]);
    showToast(`${selectedProductIds.length} produk berhasil ${publish ? 'ditampilkan' : 'disembunyikan'}.`);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Yakin ingin menghapus ${selectedProductIds.length} produk sekaligus?`)) {
      productService.bulkDelete(selectedProductIds);
      refreshProducts();
      setSelectedProductIds([]);
      showToast('Produk terpilih berhasil dihapus.');
    }
  };

  const handleOpenStockMovements = (product: Product) => {
    setSelectedProductForStock(product);
    const moves = productService.getStockMovements(product.id);
    setStockMovements(moves);
    setIsStockLogOpen(true);
  };

  const handleOpenAdjustStock = (product: Product) => {
    setSelectedProductForStock(product);
    setAdjustDelta(0);
    setAdjustReason('Penyesuaian stok opname fisik gudang');
    setAdjustVariantId(product.variants?.[0]?.id);
    setIsAdjustStockOpen(true);
  };

  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForStock || adjustDelta === 0) return;

    productService.adjustStock({
      productId: selectedProductForStock.id,
      variantId: adjustVariantId,
      delta: Number(adjustDelta),
      reason: adjustReason,
      type: 'adjustment',
      performedBy: currentUser?.name || 'Admin',
    });

    refreshProducts();
    setIsAdjustStockOpen(false);
    showToast('Penyesuaian stok berhasil disimpan.');
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Katalog Produk Busana</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Kelola inventaris, varian ukuran & warna, harga diskon, foto galeri, dan audit mutasi stok.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddDrawer}
          className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto font-medium"
        >
          <Plus size={14} /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-line rounded-[2px] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama atau SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-line rounded-[2px] text-xs bg-white focus:outline-none focus:border-charcoal"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-muted" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
          >
            <option value="all">Semua Status (Publikasi & Draf)</option>
            <option value="published">Hanya Publikasi (Aktif)</option>
            <option value="draft">Hanya Draf (Tersembunyi)</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
          >
            <option value="all">Semua Kondisi Stok</option>
            <option value="low">Stok Menipis (≤ 5 unit)</option>
            <option value="out_of_stock">Stok Habis (0 unit)</option>
            <option value="in_stock">Stok Aman (&gt; 5 unit)</option>
          </select>
        </div>

        {/* Bulk Action Strip if items checked */}
        {selectedProductIds.length > 0 && (
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs font-sans">
            <span className="text-charcoal font-medium">
              {selectedProductIds.length} produk terpilih
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkToggleVisibility(true)}
                className="px-2.5 py-1 border border-line hover:border-charcoal rounded-[2px] flex items-center gap-1"
              >
                <Eye size={12} /> Tampilkan
              </button>
              <button
                type="button"
                onClick={() => handleBulkToggleVisibility(false)}
                className="px-2.5 py-1 border border-line hover:border-charcoal rounded-[2px] flex items-center gap-1"
              >
                <EyeOff size={12} /> Sembunyikan
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-2.5 py-1 text-status-occupied border border-status-occupied/30 hover:bg-status-occupied/10 rounded-[2px] flex items-center gap-1"
              >
                <Trash2 size={12} /> Hapus Terpilih
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table (Desktop >= 768px) and Cards (Mobile < 768px) */}
      <div className="border border-line bg-white rounded-[2px] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={paginatedProducts.length > 0 && selectedProductIds.length === paginatedProducts.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProductIds(paginatedProducts.map((p) => p.id));
                      else setSelectedProductIds([]);
                    }}
                    className="rounded border-line text-charcoal"
                  />
                </th>
                <th className="py-3 px-3">Foto & Nama Produk</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Harga</th>
                <th className="py-3 px-3">Stok Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    Tidak ada produk yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const totalStock = productService.getProductTotalStock(p);
                  const isChecked = selectedProductIds.includes(p.id);

                  return (
                    <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedProductIds((prev) => [...prev, p.id]);
                            else setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                          }}
                          className="rounded border-line text-charcoal"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || '/rheamanda-mark.png'}
                            alt=""
                            className="w-10 h-12 object-cover rounded-[2px] border border-line bg-surface"
                          />
                          <div>
                            <div className="font-medium text-charcoal font-sans">{p.name}</div>
                            <span className="text-[10px] text-muted font-mono">{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-muted">{p.category}</td>

                      <td className="py-3 px-3">
                        {p.salePrice ? (
                          <div>
                            <span className="font-serif text-charcoal font-medium text-sm block">
                              {formatRupiah(p.salePrice)}
                            </span>
                            <span className="text-[10px] text-muted line-through">
                              {formatRupiah(p.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-serif text-charcoal text-sm">
                            {formatRupiah(p.price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-medium ${
                              totalStock === 0
                                ? 'text-status-occupied'
                                : totalStock <= 5
                                ? 'text-status-deposit'
                                : 'text-charcoal'
                            }`}
                          >
                            {totalStock === 0 ? 'Habis' : `${totalStock} unit`}
                          </span>
                          {totalStock <= 5 && totalStock > 0 && (
                            <span className="text-[10px] text-status-deposit font-medium">
                              (Menipis)
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenAdjustStock(p)}
                            className="p-0.5 text-muted hover:text-charcoal ml-1"
                            title="Sesuaikan Stok"
                          >
                            <Package size={12} />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-[2px] ${
                            p.isPublished
                              ? 'bg-status-available/15 text-status-available border border-status-available/30'
                              : 'bg-charcoal/10 text-charcoal border border-line'
                          }`}
                        >
                          {p.isPublished ? 'Aktif' : 'Draf'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenStockMovements(p)}
                            className="p-1 text-muted hover:text-charcoal rounded-[2px]"
                            title="Riwayat Mutasi Stok"
                          >
                            <History size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditDrawer(p)}
                            className="p-1 text-muted hover:text-charcoal rounded-[2px]"
                            title="Sunting Produk"
                          >
                            <Edit size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1 text-muted hover:text-charcoal rounded-[2px]"
                            title="Duplikat Produk"
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1 text-muted hover:text-status-occupied rounded-[2px]"
                            title="Hapus Produk"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View (< 768px) */}
        <div className="md:hidden divide-y divide-line p-3 space-y-3">
          {paginatedProducts.map((p) => {
            const totalStock = productService.getProductTotalStock(p);
            return (
              <div key={p.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-start gap-3">
                  <img
                    src={p.images[0] || '/rheamanda-mark.png'}
                    alt=""
                    className="w-16 h-20 object-cover rounded-[2px] border border-line bg-surface shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-sans block truncate">
                      {p.category}
                    </span>
                    <h4 className="font-serif text-charcoal text-base m-0 truncate">{p.name}</h4>
                    <div className="font-serif text-charcoal text-sm mt-0.5">
                      {p.salePrice ? formatRupiah(p.salePrice) : formatRupiah(p.price)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] font-sans ${totalStock <= 5 ? 'text-status-deposit font-medium' : 'text-muted'}`}>
                        Stok: {totalStock}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 border rounded-[2px] text-muted">
                        {p.isPublished ? 'Aktif' : 'Draf'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 text-xs font-sans text-muted">
                  <button type="button" onClick={() => handleOpenAdjustStock(p)} className="hover:text-charcoal flex items-center gap-1">
                    <Package size={12} /> Stok
                  </button>
                  <button type="button" onClick={() => handleOpenStockMovements(p)} className="hover:text-charcoal flex items-center gap-1">
                    <History size={12} /> Log
                  </button>
                  <button type="button" onClick={() => handleOpenEditDrawer(p)} className="hover:text-charcoal flex items-center gap-1">
                    <Edit size={12} /> Edit
                  </button>
                  <button type="button" onClick={() => handleDuplicate(p.id)} className="hover:text-charcoal flex items-center gap-1">
                    <Copy size={12} /> Salin
                  </button>
                  <button type="button" onClick={() => handleDelete(p.id)} className="hover:text-status-occupied flex items-center gap-1">
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-surface border-t border-line flex items-center justify-between text-xs font-sans text-muted">
          <span>Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-2.5 py-1 border border-line bg-white hover:border-charcoal disabled:opacity-40 rounded-[2px]"
            >
              Sebelumnya
            </button>
            <span>Halaman {currentPage} dari {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2.5 py-1 border border-line bg-white hover:border-charcoal disabled:opacity-40 rounded-[2px]"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Drawer with Tabs (Info, Harga, Varian, Foto, SEO) */}
      <Drawer
        id="product-form-drawer"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? `Sunting Produk — ${editingProduct.name}` : 'Tambah Produk Baru'}
        side="right"
        maxWidth="w-full sm:max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-6">
          {/* Drawer Tab Headers */}
          <div className="flex border-b border-line gap-2 overflow-x-auto no-scrollbar text-xs font-sans">
            {[
              { id: 'info', label: 'Info Dasar' },
              { id: 'harga', label: 'Harga' },
              { id: 'varian', label: `Varian (${formVariants.length})` },
              { id: 'foto', label: `Foto (${formImages.length})` },
              { id: 'seo', label: 'SEO' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id as any)}
                className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === tab.id
                    ? 'border-charcoal text-charcoal font-medium'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Info Dasar */}
          {activeFormTab === 'info' && (
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">
                  Nama Produk <span className="text-status-occupied">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingProduct) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
                {validationErrors.name && (
                  <span className="text-status-occupied text-[11px] block mt-1">{validationErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">
                  Slug URL (Otomatis)
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-xs font-mono text-muted bg-surface/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-muted mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-line rounded-[2px] text-xs bg-white text-ink"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted mb-1">Koleksi</label>
                  <select
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value)}
                    className="w-full px-2.5 py-2 border border-line rounded-[2px] text-xs bg-white text-ink"
                  >
                    {collections.map((col) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="rounded border-line text-charcoal"
                  />
                  <span>Label NEW ARRIVAL</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsSale}
                    onChange={(e) => setFormIsSale(e.target.checked)}
                    className="rounded border-line text-charcoal"
                  />
                  <span>Label SALE</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="rounded border-line text-charcoal"
                  />
                  <span>Publikasikan (Aktif)</span>
                </label>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">Material & Bahan</label>
                <input
                  type="text"
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(e.target.value)}
                  placeholder="Misal: Armani Silk Doff dengan Lapisan Katun Adem"
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">Panduan Perawatan</label>
                <input
                  type="text"
                  value={formCare}
                  onChange={(e) => setFormCare(e.target.value)}
                  placeholder="Misal: Cuci terpisah suhu ruang, setrika uap sedang"
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Harga & Diskon */}
          {activeFormTab === 'harga' && (
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">
                  Harga Normal (Rp) <span className="text-status-occupied">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">
                  Harga Diskon (Opsional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="Biarkan kosong jika tidak ada diskon"
                  value={formSalePrice ?? ''}
                  onChange={(e) => setFormSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
                <span className="text-[11px] text-muted block mt-1">
                  Jika diisi, harga normal akan dicoret dan label diskon ditampilkan secara otomatis.
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Varian Ukuran & Warna */}
          {activeFormTab === 'varian' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase tracking-wider">Kombinasi Ukuran, Warna, SKU & Stok</span>
                <button
                  type="button"
                  onClick={() => {
                    const newVar: ProductVariant = {
                      id: `v-${Date.now()}`,
                      size: 'M',
                      color: 'Standar',
                      sku: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
                      stock: 10,
                    };
                    setFormVariants((prev) => [...prev, newVar]);
                  }}
                  className="px-2.5 py-1 bg-surface border border-line hover:border-charcoal rounded-[2px] flex items-center gap-1"
                >
                  <Plus size={12} /> Tambah Varian
                </button>
              </div>

              <div className="space-y-2">
                {formVariants.map((v, idx) => (
                  <div key={v.id} className="p-3 border border-line bg-surface/30 rounded-[2px] grid grid-cols-5 gap-2 items-center">
                    <div>
                      <label className="text-[10px] text-muted block mb-0.5">Ukuran</label>
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[idx].size = e.target.value;
                          setFormVariants(updated);
                        }}
                        className="w-full px-2 py-1 border border-line bg-white rounded-[2px] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted block mb-0.5">Warna</label>
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[idx].color = e.target.value;
                          setFormVariants(updated);
                        }}
                        className="w-full px-2 py-1 border border-line bg-white rounded-[2px] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted block mb-0.5">SKU</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[idx].sku = e.target.value;
                          setFormVariants(updated);
                        }}
                        className="w-full px-2 py-1 border border-line bg-white rounded-[2px] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted block mb-0.5">Stok</label>
                      <input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[idx].stock = Number(e.target.value);
                          setFormVariants(updated);
                        }}
                        className="w-full px-2 py-1 border border-line bg-white rounded-[2px] text-xs"
                      />
                    </div>

                    <div className="text-right pt-3">
                      <button
                        type="button"
                        disabled={formVariants.length <= 1}
                        onClick={() => {
                          setFormVariants((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="p-1 text-muted hover:text-status-occupied disabled:opacity-30"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Foto Produk (GalleryField) */}
          {activeFormTab === 'foto' && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-muted font-sans block">
                Galeri Foto Produk (1 hingga 8 foto)
              </span>
              <GalleryField
                images={formImages}
                maxImages={8}
                onChange={setFormImages}
              />
              {validationErrors.images && (
                <span className="text-status-occupied text-xs font-sans block">{validationErrors.images}</span>
              )}
            </div>
          )}

          {/* Tab 5: SEO */}
          {activeFormTab === 'seo' && (
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">Judul SEO (Meta Title)</label>
                <input
                  type="text"
                  value={formSeoTitle}
                  onChange={(e) => setFormSeoTitle(e.target.value)}
                  placeholder="Misal: Abaya Zaleha Noir — Busana Muslimah Mewah Rea Manda"
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted mb-1">Deskripsi SEO (Meta Description)</label>
                <textarea
                  rows={3}
                  value={formSeoDesc}
                  onChange={(e) => setFormSeoDesc(e.target.value)}
                  placeholder="Ringkasan singkat untuk hasil pencarian Google..."
                  className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
                />
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-line text-xs uppercase tracking-wider font-sans rounded-[2px] hover:border-charcoal"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors font-medium"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </Drawer>

      {/* Stock Movements Log Modal */}
      {isStockLogOpen && selectedProductForStock && (
        <Modal
          id="stock-log-modal"
          isOpen={isStockLogOpen}
          onClose={() => setIsStockLogOpen(false)}
          title={`Log Mutasi Stok — ${selectedProductForStock.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-sans text-muted">
              <span>Total Stok Saat Ini: {productService.getProductTotalStock(selectedProductForStock)} unit</span>
              <span>Menampilkan mutasi stok otomatis & penyesuaian manual</span>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {stockMovements.length === 0 ? (
                <div className="p-8 text-center text-muted font-sans text-xs bg-surface/30 border border-line">
                  Belum ada catatan mutasi stok untuk produk ini.
                </div>
              ) : (
                stockMovements.map((m) => (
                  <div key={m.id} className="p-3 border border-line bg-surface/30 rounded-[2px] text-xs font-sans flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${m.delta > 0 ? 'text-status-available' : 'text-status-occupied'}`}>
                          {m.delta > 0 ? `+${m.delta}` : m.delta} unit
                        </span>
                        <span className="text-muted">({m.previousStock} → {m.newStock})</span>
                        {m.variantLabel && <span className="text-[10px] bg-white px-1.5 border border-line rounded-xs">{m.variantLabel}</span>}
                      </div>
                      <p className="m-0 text-charcoal">{m.reason}</p>
                      <span className="text-[10px] text-muted block">
                        {new Date(m.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · Oleh: {m.performedBy}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-line text-muted rounded-xs">
                      {m.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Stock Adjustment Modal */}
      {isAdjustStockOpen && selectedProductForStock && (
        <Modal
          id="adjust-stock-modal"
          isOpen={isAdjustStockOpen}
          onClose={() => setIsAdjustStockOpen(false)}
          title={`Penyesuaian Stok Manual — ${selectedProductForStock.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveStockAdjustment} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Pilih Varian Produk</label>
              <select
                value={adjustVariantId}
                onChange={(e) => setAdjustVariantId(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
              >
                {selectedProductForStock.variants?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.size} / {v.color} (Stok Saat Ini: {v.stock} unit)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">
                Jumlah Perubahan (+ untuk menambah, - untuk mengurangi)
              </label>
              <input
                type="number"
                required
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(Number(e.target.value))}
                placeholder="Misal: +5 atau -2"
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Alasan Penyesuaian</label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white rounded-[2px] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
            >
              Simpan Penyesuaian Stok
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
