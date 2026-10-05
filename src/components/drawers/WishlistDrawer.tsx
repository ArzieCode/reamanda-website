// ============================================================
// Drawer — Wishlist (Daftar Keinginan)
// Slide-in right, responsive, move-to-cart, remove
// ============================================================
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Link } from 'react-router-dom';

export default function WishlistDrawer() {
  const { items, isWishlistOpen, toggleWishlistDrawer, removeFromWishlist } = useWishlist();
  const { addItem, toggleCart } = useCart();
  const { format } = useCurrency();

  if (!isWishlistOpen) return null;

  const close = () => toggleWishlistDrawer(false);

  const handleMoveToCart = (product: any) => {
    const size = product.sizes?.[0] ?? 'All Size';
    const color = product.colors?.[0] ?? 'Default';
    addItem(product, size, color, 1);
    removeFromWishlist(product.id);
    toggleWishlistDrawer(false);
    toggleCart(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.45)' }}
        onClick={close}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-[60] flex flex-col w-full sm:w-[420px] max-w-full bg-bg border-l border-line"
        role="dialog"
        aria-label="Daftar Keinginan (Wishlist)"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
            DAFTAR KEINGINAN ({items.length})
          </p>
          <button
            onClick={close}
            className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
            aria-label="Tutup daftar keinginan"
          >
            <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-sm font-light text-muted mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Daftar keinginan Anda masih kosong. Simpan produk favorit Anda untuk dipesan nanti.
              </p>
              <Link
                to="/busana"
                onClick={close}
                className="nav-label px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all focus-visible:outline-none"
                style={{ fontSize: '10px', letterSpacing: '0.14em' }}
              >
                JELAJAHI KOLEKSI
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((product) => (
                <li key={product.id} className="flex gap-4 border-b border-line pb-6">
                  {/* Thumb */}
                  <Link
                    to={`/busana/produk/${product.slug}`}
                    onClick={close}
                    className="flex-shrink-0 w-20 aspect-[3/4] bg-surface flex items-center justify-center text-[10px] text-muted uppercase font-light"
                  >
                    {product.name}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/busana/produk/${product.slug}`}
                      onClick={close}
                      className="nav-label block text-charcoal hover:opacity-70 truncate mb-1"
                      style={{ fontSize: '12px', letterSpacing: '0.12em' }}
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted font-light mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {product.collection.toUpperCase()} · {product.category}
                    </p>
                    <p className="text-sm font-light text-charcoal mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {format(product.salePrice ?? product.price)}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 nav-label py-2.5 px-3 text-white transition-opacity hover:opacity-85 focus-visible:outline-none"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          backgroundColor: 'var(--charcoal)',
                        }}
                      >
                        <ShoppingBag size={13} strokeWidth={1.25} />
                        KE KERANJANG
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2.5 border border-line text-muted hover:text-occupied hover:border-occupied transition-colors focus-visible:outline-none"
                        aria-label={`Hapus ${product.name} dari wishlist`}
                      >
                        <Trash2 size={14} strokeWidth={1.25} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
