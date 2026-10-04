// ============================================================
// Header — fixed height (60px mobile / 72px desktop)
// Transparent over hero, solid white when scrolled
// Mobile menu drawer below 1024px, 44px touch targets
// Wishlist icon for mobile view
// ============================================================
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import MegaMenu from '../busana/MegaMenu';

const navItems = [
  { label: 'Koleksi', path: '/busana', hasMega: true },
  { label: 'Properti', path: '/properti', hasMega: false },
  { label: 'Katering', path: '/katering', hasMega: false },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, dispatch } = useCart();
  const { pathname } = useLocation();

  // Determine if we're on a hero page (transparent header)
  const isHeroPage =
    pathname === '/' ||
    pathname === '/busana' ||
    pathname === '/properti' ||
    pathname === '/katering';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset mobile menu on route change without cascading effect
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
  }

  const isTransparent = isHeroPage && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-charcoal';
  const iconColor = isTransparent ? '#ffffff' : 'var(--charcoal)';

  return (
    <>
      <header
        className="w-full transition-colors duration-400"
        style={{
          height: undefined,
          backgroundColor: isTransparent ? 'transparent' : 'var(--bg)',
          borderBottom: isTransparent ? 'none' : '1px solid var(--line)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-[60px] lg:h-[72px]">
          {/* Left: Mobile hamburger (under 1024px) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center -ml-2.5 transition-opacity duration-400 hover:opacity-75 focus-visible:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} color={iconColor} strokeWidth={1.25} />
            </button>
          </div>

          {/* Wordmark */}
          <Link
            to="/"
            className={`font-cormorant text-xl lg:text-2xl tracking-widest uppercase font-light transition-colors duration-400 ${textColor}`}
            style={{ letterSpacing: '0.25em' }}
          >
            RiaMiranda
          </Link>

          {/* Desktop Nav (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative py-2"
                onMouseEnter={() => item.hasMega && setMegaOpen(true)}
                onMouseLeave={() => item.hasMega && setMegaOpen(false)}
              >
                <Link
                  to={item.path}
                  className={`nav-label flex items-center gap-1 transition-colors duration-400 hover:opacity-70 ${textColor}`}
                  style={{ fontSize: '11px', letterSpacing: '0.16em' }}
                >
                  {item.label.toUpperCase()}
                  {item.hasMega && (
                    <ChevronDown size={12} color={iconColor} strokeWidth={1.25} />
                  )}
                </Link>
                {item.hasMega && megaOpen && (
                  <MegaMenu onClose={() => setMegaOpen(false)} />
                )}
              </div>
            ))}
          </nav>

          {/* Right icons: min 44px tap targets */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Currency (desktop only) */}
            <span
              className={`nav-label hidden xl:block px-2 transition-colors duration-400 ${textColor}`}
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              IDR
            </span>

            {/* Search */}
            <button
              aria-label="Cari produk"
              className={`w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 ${textColor}`}
            >
              <Search size={19} color={iconColor} strokeWidth={1.25} />
            </button>

            {/* Wishlist icon button (prominent on mobile when floating tab is hidden) */}
            <Link
              to="/busana"
              aria-label="Wishlist (Favorit)"
              className={`w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 ${textColor}`}
            >
              <Heart size={19} color={iconColor} strokeWidth={1.25} />
            </Link>

            {/* User Account */}
            <button
              aria-label="Akun saya"
              className={`hidden sm:flex w-11 h-11 items-center justify-center transition-colors duration-400 hover:opacity-70 ${textColor}`}
            >
              <User size={19} color={iconColor} strokeWidth={1.25} />
            </button>

            {/* Shopping Cart */}
            <button
              aria-label={`Keranjang belanja (${totalItems} item)`}
              className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 ${textColor}`}
              onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
            >
              <ShoppingBag size={19} color={iconColor} strokeWidth={1.25} />
              {totalItems > 0 && (
                <span
                  className="absolute top-2 right-2 rounded-full flex items-center justify-center text-white"
                  style={{
                    width: 16,
                    height: 16,
                    fontSize: 9,
                    backgroundColor: 'var(--caramel)',
                    fontWeight: 500,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (under 1024px) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-400"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-[60] flex flex-col bg-bg border-r border-line w-full sm:w-[420px] max-w-full overflow-y-auto"
            role="dialog"
            aria-label="Menu Navigasi"
          >
            <div className="flex items-center justify-between px-6 h-[60px] border-b border-line">
              <span className="font-cormorant text-xl tracking-widest uppercase font-light text-charcoal">
                RiaMiranda
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center -mr-2.5 transition-opacity hover:opacity-60"
                aria-label="Tutup menu navigasi"
              >
                <X size={20} strokeWidth={1.25} color="var(--charcoal)" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="border-b border-line pb-6">
                <p className="nav-label text-muted mb-4" style={{ fontSize: '10px', letterSpacing: '0.18em' }}>
                  LINI PRODUK
                </p>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/busana"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-cormorant text-2xl font-light text-charcoal hover:opacity-70 block"
                    >
                      Busana Muslimah
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/properti"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-cormorant text-2xl font-light text-charcoal hover:opacity-70 block"
                    >
                      Properti & Hotel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/katering"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-cormorant text-2xl font-light text-charcoal hover:opacity-70 block"
                    >
                      Katering
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="border-b border-line pb-6">
                <p className="nav-label text-muted mb-4" style={{ fontSize: '10px', letterSpacing: '0.18em' }}>
                  KOLEKSI PILIHAN
                </p>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/busana/koleksi/luminara"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-label text-charcoal text-xs hover:opacity-70 block"
                    >
                      LUMINARA 2024
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/busana/koleksi/terra"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-label text-charcoal text-xs hover:opacity-70 block"
                    >
                      TERRA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/busana/koleksi/kolaborasi-nara"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-label text-charcoal text-xs hover:opacity-70 block"
                    >
                      KOLABORASI NARA STUDIO
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Link
                      to="/busana"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-label inline-block px-4 py-2 rounded-full text-white"
                      style={{ backgroundColor: 'var(--sale)', fontSize: '10px', letterSpacing: '0.16em' }}
                    >
                      SALE
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-4 text-xs text-muted font-light">
                  <span>Mata Uang: IDR</span>
                  <span>·</span>
                  <span>Jakarta, est. 2009</span>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
