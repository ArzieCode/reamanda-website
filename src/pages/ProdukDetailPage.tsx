// ============================================================
// Product Detail Page (/busana/produk/:slug)
// Gallery, Zoom modal, Size guide modal, Wishlist toggle,
// "Beli Sekarang", Share link, Out-of-stock "Beritahu saya" form
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Share2, ZoomIn, Ruler, Check } from 'lucide-react';
import Placeholder from '../components/ui/Placeholder';
import ProductCard from '../components/busana/ProductCard';
import { getProduct, getProducts } from '../services/busana';
import type { Product } from '../types/busana';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import ImageZoomModal from '../components/modals/ImageZoomModal';
import SizeGuideModal from '../components/modals/SizeGuideModal';

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left transition-opacity duration-400 hover:opacity-70 focus-visible:outline-none"
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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  // Modals state
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Out of stock notify form
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const { dispatch, addItem, toggleCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { format } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getProduct(slug ?? ''),
      getProducts(),
    ]).then(([prod, all]) => {
      setProduct(prod);
      if (prod) {
        setSelectedSize(prod.sizes[0] ?? 'All Size');
        setSelectedColor(prod.colors[0] ?? 'Default');
        setRelated(all.filter((p) => p.id !== prod.id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [slug]);

  const isFavorited = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor, 1);
    }
    toggleCart(true);
    showToast(`"${product.name}" (${selectedSize}) ditambahkan ke keranjang!`, 'success');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Tautan produk berhasil disalin ke papan klip!', 'success');
      } else {
        showToast(window.location.href, 'info');
      }
    } catch {
      showToast('Gagal menyalin tautan.', 'error');
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'error');
      return;
    }
    setNotifySubmitted(true);
    showToast('Kami akan mengirimkan email saat stok produk ini tersedia kembali.', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 pb-28 md:pb-36">
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
      <div className="max-w-screen-xl mx-auto px-6 py-20 text-center pb-28 md:pb-36">
        <p className="font-cormorant text-2xl font-light mb-4" style={{ color: 'var(--charcoal)' }}>
          Produk tidak ditemukan
        </p>
        <Link to="/busana" className="nav-label text-caramel hover:underline" style={{ fontSize: '11px' }}>
          ← Kembali ke Katalog Busana
        </Link>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const isOutOfStock = product.stock === 0;
  const thumbs = [0, 1, 2, 3];

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-28 md:pb-36 pt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-4 border-b mb-10 text-xs font-light text-muted" style={{ borderColor: 'var(--line)', fontFamily: 'Jost, sans-serif' }}>
          <Link to="/busana" className="hover:text-charcoal transition-colors">BUSANA</Link>
          <span>/</span>
          <Link to={`/busana/koleksi/${product.collection.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-charcoal transition-colors uppercase">
            {product.collection}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery with Zoom Trigger */}
          <div>
            <div className="relative mb-3 group cursor-zoom-in" onClick={() => setZoomOpen(true)}>
              <Placeholder
                ratio="3/4"
                label={`${product.name} — Tampilan ${activeThumb + 1}`}
                className="w-full"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 p-2 bg-bg/80 backdrop-blur-xs text-charcoal rounded-full hover:bg-bg transition-colors shadow-xs"
                aria-label="Perbesar gambar produk"
              >
                <ZoomIn size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {thumbs.map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`transition-all border ${activeThumb === i ? 'border-charcoal opacity-100' : 'border-line opacity-60 hover:opacity-90'}`}
                  aria-label={`Pilih gambar sudut ${i + 1}`}
                >
                  <Placeholder ratio="1/1" label={`${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-2">
              <p className="nav-label text-caramel-deep" style={{ fontSize: '10px', letterSpacing: '0.18em' }}>
                KOLEKSI {product.collection.toUpperCase()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 border border-line text-muted hover:text-charcoal hover:border-charcoal transition-colors focus-visible:outline-none"
                  aria-label="Salin tautan produk"
                  title="Bagikan produk"
                >
                  <Share2 size={15} strokeWidth={1.25} />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 border border-line hover:border-charcoal transition-colors focus-visible:outline-none"
                  aria-label={isFavorited ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                  title="Simpan ke Wishlist"
                >
                  <Heart
                    size={15}
                    color={isFavorited ? 'var(--sale)' : 'var(--charcoal)'}
                    fill={isFavorited ? 'var(--sale)' : 'none'}
                    strokeWidth={1.25}
                  />
                </button>
              </div>
            </div>

            <h1
              className="font-cormorant font-light mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--charcoal)', letterSpacing: '0.04em' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-light" style={{ color: product.isSale ? 'var(--sale)' : 'var(--ink)', fontFamily: 'Jost', fontSize: '20px' }}>
                {format(displayPrice)}
              </span>
              {product.isSale && (
                <span className="font-light line-through" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '15px' }}>
                  {format(product.price)}
                </span>
              )}
            </div>

            {/* Size selector & Size guide modal button */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="nav-label text-charcoal" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                  PILIH UKURAN:
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 nav-label text-muted hover:text-charcoal transition-colors focus-visible:outline-none"
                  style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  <Ruler size={13} strokeWidth={1.25} />
                  PANDUAN UKURAN
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="nav-label min-h-[44px] min-w-[44px] px-4 py-2 border transition-all duration-300 focus-visible:outline-none"
                    style={{
                      fontSize: '11px',
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
              <p className="nav-label mb-3 text-charcoal" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                WARNA: <span className="font-light" style={{ textTransform: 'none' }}>{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="nav-label px-3.5 py-2 border transition-all duration-300 focus-visible:outline-none min-h-[38px]"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      borderColor: selectedColor === c ? 'var(--charcoal)' : 'var(--line)',
                      color: selectedColor === c ? 'var(--charcoal)' : 'var(--muted)',
                      backgroundColor: selectedColor === c ? 'var(--surface)' : 'transparent',
                    }}
                    aria-pressed={selectedColor === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mb-8">
                <p className="nav-label mb-3 text-charcoal" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                  JUMLAH
                </p>
                <div className="flex items-center gap-0 border border-line w-fit">
                  <button
                    className="px-4 py-3 transition-opacity hover:opacity-60 nav-label"
                    style={{ fontSize: '14px', color: 'var(--charcoal)' }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah pesanan"
                  >
                    −
                  </button>
                  <span
                    className="px-5 text-sm font-light text-ink min-w-[40px] text-center"
                    style={{ fontFamily: 'Jost' }}
                  >
                    {quantity}
                  </span>
                  <button
                    className="px-4 py-3 transition-opacity hover:opacity-60 nav-label"
                    style={{ fontSize: '14px', color: 'var(--charcoal)' }}
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Tambah jumlah pesanan"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Stock State: Out of Stock ("Habis") shows "Beritahu saya" form */}
            {isOutOfStock ? (
              <div className="p-6 border border-line bg-surface mb-6 space-y-4">
                <p className="nav-label text-occupied" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                  STOK SAAT INI SEDANG HABIS
                </p>
                <p className="text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Karya ini diproduksi dalam jumlah terbatas. Masukkan alamat email Anda untuk menerima notifikasi rilis stok tambahan atau *restock* batch berikutnya.
                </p>

                {notifySubmitted ? (
                  <p className="text-xs text-available font-medium flex items-center gap-1.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                    <Check size={14} />
                    Terima kasih! Kami akan memberi tahu Anda saat busana ini kembali tersedia.
                  </p>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex gap-0 border-b border-charcoal">
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Masukkan alamat email Anda"
                      className="flex-1 bg-transparent py-2.5 text-xs font-light outline-none"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                      required
                    />
                    <button
                      type="submit"
                      className="nav-label px-4 py-2.5 text-charcoal hover:opacity-75 focus-visible:outline-none"
                      style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                    >
                      BERITAHU SAYA
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* CTA Buttons: Add to cart & Buy now */
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="nav-label w-full min-h-[44px] py-4 text-white transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    backgroundColor: 'var(--charcoal)',
                  }}
                >
                  + TAMBAH KE KERANJANG
                </button>

                <button
                  onClick={handleBuyNow}
                  className="nav-label w-full min-h-[44px] py-3.5 border border-charcoal text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                  }}
                >
                  BELI SEKARANG
                </button>
              </div>
            )}

            {/* Accordions */}
            <div className="mt-6 border-t border-line">
              <Accordion title="Material & Tekstur">{product.material}</Accordion>
              <Accordion title="Petunjuk Perawatan">{product.care}</Accordion>
              <Accordion title="Deskripsi Desain">{product.description}</Accordion>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-line">
            <p className="nav-label text-center mb-10 text-muted" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
              KOLEKSI SERASI LAINNYA
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        title={product.name}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </>
  );
}
