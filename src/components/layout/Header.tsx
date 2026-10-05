// ============================================================
// Header — fixed height (60px mobile / 72px desktop)
// Transparent over hero, solid white when scrolled
// Full functionality: Currency dropdown, Search overlay trigger,
// Wishlist drawer trigger + badge, Profile dropdown (Auth), Cart badge
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User as UserIcon, ShoppingBag, ChevronDown, Menu, X, Heart, LogOut, Package, Gavel, Award } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import MegaMenu from '../busana/MegaMenu';
import type { CurrencyCode } from '../../types/currency';

const navItems = [
  { label: 'Koleksi', path: '/busana', hasMega: true },
  { label: 'Properti', path: '/properti', hasMega: false },
  { label: 'Katering', path: '/katering', hasMega: false },
];

const CURRENCIES: CurrencyCode[] = ['IDR', 'USD', 'SGD', 'MYR'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { totalItems, dispatch } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { toggleWishlistDrawer, items: wishlistItems } = useWishlist();
  const { toggleSearch } = useSearch();
  const { pathname } = useLocation();

  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

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

  // Close menus & dropdowns on route change
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
    setMegaOpen(false);
    setCurrencyDropdownOpen(false);
    setProfileDropdownOpen(false);
  }

  // Handle outside click & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setCurrencyDropdownOpen(false);
        setMegaOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isTransparent = isHeroPage && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-charcoal';
  const iconColor = isTransparent ? '#ffffff' : 'var(--charcoal)';

  return (
    <>
      <header
        className="w-full transition-colors duration-400"
        style={{
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
            {/* Currency Selector Dropdown (desktop) */}
            <div className="relative hidden xl:block" ref={currencyRef}>
              <button
                onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                className={`nav-label h-11 px-2.5 flex items-center gap-1 transition-colors duration-400 hover:opacity-70 focus-visible:outline-none ${textColor}`}
                style={{ fontSize: '11px', letterSpacing: '0.14em' }}
                aria-label={`Pilih Mata Uang (Saat ini: ${currency})`}
                aria-expanded={currencyDropdownOpen}
              >
                <span>{currency}</span>
                <ChevronDown size={11} strokeWidth={1.25} />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-28 bg-bg border border-line shadow-lg py-1 z-50 animate-in fade-in"
                  role="menu"
                >
                  {CURRENCIES.map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 nav-label transition-colors hover:bg-surface flex items-center justify-between ${
                        currency === code ? 'text-charcoal font-medium bg-surface' : 'text-muted'
                      }`}
                      style={{ fontSize: '11px', letterSpacing: '0.12em' }}
                      role="menuitem"
                    >
                      <span>{code}</span>
                      {currency === code && <span>•</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => toggleSearch(true)}
              aria-label="Buka pencarian produk & layanan"
              className={`w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 focus-visible:outline-none ${textColor}`}
            >
              <Search size={19} color={iconColor} strokeWidth={1.25} />
            </button>

            {/* Wishlist Button with Badge */}
            <button
              onClick={() => toggleWishlistDrawer(true)}
              aria-label={`Buka Wishlist (${wishlistItems.length} produk)`}
              className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 focus-visible:outline-none ${textColor}`}
            >
              <Heart size={19} color={iconColor} strokeWidth={1.25} />
              {wishlistItems.length > 0 && (
                <span
                  className="absolute top-2 right-2 rounded-full flex items-center justify-center text-white"
                  style={{
                    width: 15,
                    height: 15,
                    fontSize: 8,
                    backgroundColor: 'var(--charcoal)',
                    fontWeight: 500,
                  }}
                >
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* User Account Button with Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-label={user ? `Akun saya (${user.name})` : 'Masuk atau daftar akun'}
                aria-expanded={profileDropdownOpen}
                className={`w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                <UserIcon size={19} color={iconColor} strokeWidth={1.25} />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-64 bg-bg border border-line shadow-xl py-3 z-50 animate-in fade-in"
                  role="menu"
                >
                  {user ? (
                    <div>
                      {/* Logged in header */}
                      <div className="px-4 pb-3 border-b border-line mb-2">
                        <p className="nav-label text-charcoal truncate" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                          {user.name}
                        </p>
                        <p className="text-xs text-muted truncate font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {user.email}
                        </p>
                      </div>

                      {/* Logged in links */}
                      <div className="space-y-1">
                        <Link
                          to="/akun"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <UserIcon size={14} color="var(--charcoal)" />
                          <span>Profil Saya</span>
                        </Link>
                        <Link
                          to="/akun/pesanan"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <Package size={14} color="var(--charcoal)" />
                          <span>Riwayat Pesanan</span>
                        </Link>
                        <Link
                          to="/akun/wishlist"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <Heart size={14} color="var(--charcoal)" />
                          <span>Wishlist Favorit ({wishlistItems.length})</span>
                        </Link>
                        <Link
                          to="/akun/penawaran"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <Gavel size={14} color="var(--charcoal)" />
                          <span>Penawaran Properti</span>
                        </Link>
                        <Link
                          to="/akun/poin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <Award size={14} color="var(--caramel-deep)" />
                          <span>Poin & Hadiah ({user.points ?? 1250})</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="pt-2 mt-2 border-t border-line">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-light text-occupied hover:bg-surface transition-colors"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                          role="menuitem"
                        >
                          <LogOut size={14} />
                          <span>Keluar dari Akun</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Logged out: Masuk and Daftar */
                    <div className="p-4 space-y-3">
                      <p className="text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Masuk untuk menikmati kemudahan pelacakan pesanan, penawaran properti, dan poin penghargaan.
                      </p>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openAuthModal('login');
                        }}
                        className="w-full nav-label py-2.5 bg-charcoal text-white hover:opacity-85 transition-opacity text-center block"
                        style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                      >
                        MASUK KE AKUN
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openAuthModal('register');
                        }}
                        className="w-full nav-label py-2.5 border border-charcoal text-charcoal hover:bg-surface transition-colors text-center block"
                        style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                      >
                        BUAT AKUN BARU
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button with Badge */}
            <button
              aria-label={`Keranjang belanja (${totalItems} item)`}
              className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-400 hover:opacity-70 focus-visible:outline-none ${textColor}`}
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
              {/* Account Quick Status */}
              <div className="p-4 bg-surface border border-line">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="nav-label text-charcoal" style={{ fontSize: '11px' }}>{user.name}</p>
                      <p className="text-xs text-muted font-light">{user.email}</p>
                    </div>
                    <Link
                      to="/akun"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-label text-[10px] text-caramel-deep hover:underline"
                    >
                      AKUN SAYA →
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="flex-1 nav-label py-2 bg-charcoal text-white text-[10px]"
                    >
                      MASUK
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="flex-1 nav-label py-2 border border-line text-charcoal text-[10px]"
                    >
                      DAFTAR
                    </button>
                  </div>
                )}
              </div>

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
                <div className="flex items-center gap-3 text-xs text-muted font-light mb-4">
                  <span>Mata Uang:</span>
                  <div className="flex gap-2">
                    {CURRENCIES.map((code) => (
                      <button
                        key={code}
                        onClick={() => setCurrency(code)}
                        className={`nav-label px-2 py-0.5 border ${
                          currency === code ? 'border-charcoal text-charcoal font-medium bg-surface' : 'border-line text-muted'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted font-light">
                  Jakarta, est. 2009
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
