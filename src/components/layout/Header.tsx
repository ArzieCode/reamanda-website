// ============================================================
// Header — fixed height (60px mobile / 72px desktop)
// 3-column CSS grid: minmax(0,1fr) auto minmax(0,1fr), gap 24px
// Breakpoint: below 1100px collapses nav to hamburger
// Transition at scroll > 24px, 300ms duration
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User as UserIcon, ShoppingBag, ChevronDown, Menu, X, Heart, LogOut, Package, Gavel, Award, Sun, Moon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();

  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Determine if we're on a hero page (transparent header)
  const isHeroPage =
    pathname === '/' ||
    pathname === '/busana' ||
    pathname === '/properti' ||
    pathname === '/katering';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
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
  const textColor = isTransparent ? 'text-[#F7F4EE]' : 'text-charcoal';
  const iconColor = isTransparent ? '#F7F4EE' : 'var(--charcoal)';

  return (
    <>
      <header
        className="w-full transition-all duration-300 relative z-40"
        style={{
          height: undefined, // Controlled by inner container height
          backgroundColor: isTransparent ? 'transparent' : 'var(--color-bg-nav)',
          backdropFilter: isTransparent ? 'none' : 'blur(12px)',
          borderBottom: isTransparent ? 'none' : '1px solid var(--color-border)',
        }}
      >
        <div className="site-container h-[60px] min-[1100px]:h-[72px]">
          {/* Below 1100px layout: Hamburger left, Wordmark centre, Icons right */}
          <div className="flex min-[1100px]:hidden items-center justify-between h-full">
            {/* Left: Mobile hamburger */}
            <div className="w-[44px]">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center -ml-2.5 transition-opacity duration-300 hover:opacity-75 focus-visible:outline-none"
                aria-label="Buka menu navigasi"
              >
                <Menu size={20} color={iconColor} strokeWidth={1.25} />
              </button>
            </div>

            {/* Centre: Wordmark */}
            <Link
              to="/"
              className={`font-cormorant uppercase font-light text-center truncate px-2 transition-colors duration-300 ${textColor}`}
              style={{
                fontSize: 'clamp(18px, 1.6vw + 8px, 26px)',
                letterSpacing: '0.22em',
                lineHeight: 1,
              }}
            >
              RiaMiranda
            </Link>

            {/* Right: Theme Toggle, Search, Wishlist, Cart */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Beralih ke Signature Night' : 'Beralih ke Signature Light'}
                title={theme === 'light' ? 'Mode Night' : 'Mode Light'}
                className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                {theme === 'light' ? (
                  <Moon size={18} color={iconColor} strokeWidth={1.3} />
                ) : (
                  <Sun size={18} color={iconColor} strokeWidth={1.3} />
                )}
              </button>
              <button
                onClick={() => toggleSearch(true)}
                aria-label="Cari produk"
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                <Search size={19} color={iconColor} strokeWidth={1.25} />
              </button>
              <button
                onClick={() => toggleWishlistDrawer(true)}
                aria-label={`Wishlist (${wishlistItems.length} produk)`}
                className={`relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                <Heart size={19} color={iconColor} strokeWidth={1.25} />
                {wishlistItems.length > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{
                      fontSize: '9px',
                      backgroundColor: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <button
                aria-label={`Keranjang belanja (${totalItems} item)`}
                className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
                onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
              >
                <ShoppingBag size={20} color={iconColor} strokeWidth={1.25} />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{
                      fontSize: '9px',
                      backgroundColor: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* >= 1100px Desktop Layout: CSS Grid (minmax(0,1fr) auto minmax(0,1fr), gap 24px) */}
          <div
            className="hidden min-[1100px]:grid items-center h-full"
            style={{
              gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
              columnGap: '24px',
            }}
          >
            {/* Left Cell: Wordmark (never wraps, min 18px, justify-self: start) */}
            <div className="justify-self-start">
              <Link
                to="/"
                className={`font-cormorant uppercase font-light whitespace-nowrap block transition-colors duration-300 hover:opacity-85 ${textColor}`}
                style={{
                  fontSize: 'clamp(18px, 1.6vw + 8px, 26px)',
                  letterSpacing: '0.22em',
                  lineHeight: 1,
                }}
              >
                RiaMiranda
              </Link>
            </div>

            {/* Centre Cell: Nav links (gap 32px, 12px uppercase, letter-spacing 0.14em, whitespace nowrap) */}
            <nav className="justify-self-center flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative py-2"
                  onMouseEnter={() => item.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => item.hasMega && setMegaOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`nav-label flex items-center gap-1.5 transition-colors duration-300 hover:opacity-70 whitespace-nowrap ${textColor}`}
                    style={{ fontSize: '12px', letterSpacing: '0.14em' }}
                  >
                    {item.label.toUpperCase()}
                    {item.hasMega && (
                      <ChevronDown size={13} color={iconColor} strokeWidth={1.25} />
                    )}
                  </Link>
                  {item.hasMega && megaOpen && (
                    <MegaMenu onClose={() => setMegaOpen(false)} />
                  )}
                </div>
              ))}
            </nav>

            {/* Right Cell: Theme Toggle, Currency, Search, Profile, Wishlist, Cart */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-3">
              {/* Theme Mode Toggle (Signature Light vs Signature Night) */}
              <button
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Beralih ke Mode Signature Night' : 'Beralih ke Mode Signature Light'}
                title={theme === 'light' ? 'Beralih ke Mode Signature Night' : 'Beralih ke Mode Signature Light'}
                className={`h-11 px-2.5 flex items-center gap-1.5 transition-colors duration-300 hover:opacity-75 focus-visible:outline-none ${textColor}`}
              >
                {theme === 'light' ? (
                  <Moon size={15} color={iconColor} strokeWidth={1.3} />
                ) : (
                  <Sun size={15} color={iconColor} strokeWidth={1.3} />
                )}
                <span className="hidden xl:inline nav-label text-[10px] tracking-widest font-normal">
                  {theme === 'light' ? 'NIGHT' : 'LIGHT'}
                </span>
              </button>

              {/* Currency Selector */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                  className={`nav-label h-11 px-2.5 flex items-center gap-1 transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
                  style={{ fontSize: '12px', letterSpacing: '0.14em' }}
                  aria-label={`Pilih Mata Uang (Saat ini: ${currency})`}
                  aria-expanded={currencyDropdownOpen}
                >
                  <span>{currency}</span>
                  <ChevronDown size={12} strokeWidth={1.25} />
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
                          currency === code ? 'text-charcoal font-medium bg-surface' : 'text-muted-aa'
                        }`}
                        style={{ fontSize: '12px', letterSpacing: '0.12em' }}
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
                aria-label="Pencarian katalog"
                className={`w-11 h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                <Search size={20} color={iconColor} strokeWidth={1.25} />
              </button>

              {/* Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-label={user ? `Akun saya (${user.name})` : 'Masuk atau daftar'}
                  aria-expanded={profileDropdownOpen}
                  className={`w-11 h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
                >
                  <UserIcon size={20} color={iconColor} strokeWidth={1.25} />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-64 bg-bg border border-line shadow-xl py-3 z-50 animate-in fade-in"
                    role="menu"
                  >
                    {user ? (
                      <div>
                        <div className="px-4 pb-3 border-b border-line mb-2">
                          <p className="nav-label text-charcoal truncate" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-aa truncate font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                            {user.email}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Link
                            to="/akun"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <UserIcon size={14} color="var(--charcoal)" />
                            <span>Profil Saya</span>
                          </Link>
                          <Link
                            to="/akun/pesanan"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <Package size={14} color="var(--charcoal)" />
                            <span>Riwayat Pesanan</span>
                          </Link>
                          <Link
                            to="/akun/wishlist"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <Heart size={14} color="var(--charcoal)" />
                            <span>Wishlist Favorit ({wishlistItems.length})</span>
                          </Link>
                          <Link
                            to="/akun/penawaran"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <Gavel size={14} color="var(--charcoal)" />
                            <span>Penawaran Properti</span>
                          </Link>
                          <Link
                            to="/akun/poin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-light text-ink hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <Award size={14} color="var(--caramel-deep)" />
                            <span>Poin & Hadiah ({user.points ?? 1250})</span>
                          </Link>
                        </div>

                        <div className="pt-2 mt-2 border-t border-line">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-light text-occupied hover:bg-surface transition-colors"
                            role="menuitem"
                          >
                            <LogOut size={14} />
                            <span>Keluar dari Akun</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-light text-muted-aa leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                          Masuk untuk menikmati kemudahan pelacakan pesanan dan hak istimewa member.
                        </p>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full nav-label py-2.5 bg-charcoal text-white hover:opacity-85 transition-opacity text-center block"
                          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
                        >
                          MASUK KE AKUN
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openAuthModal('register');
                          }}
                          className="w-full nav-label py-2.5 border border-charcoal text-charcoal hover:bg-surface transition-colors text-center block"
                          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
                        >
                          BUAT AKUN BARU
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlistDrawer(true)}
                aria-label={`Wishlist (${wishlistItems.length} produk tersimpan)`}
                className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
              >
                <Heart size={20} color={iconColor} strokeWidth={1.25} />
                {wishlistItems.length > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{
                      fontSize: '9px',
                      backgroundColor: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                aria-label={`Keranjang belanja (${totalItems} item)`}
                className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-300 hover:opacity-70 focus-visible:outline-none ${textColor}`}
                onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
              >
                <ShoppingBag size={20} color={iconColor} strokeWidth={1.25} />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{
                      fontSize: '9px',
                      backgroundColor: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (under 1100px) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-[60] flex flex-col bg-bg border-r border-line w-full sm:w-[420px] max-w-full overflow-y-auto"
            role="dialog"
            aria-modal="true"
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
                      <p className="text-xs text-muted-aa font-light">{user.email}</p>
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
                      className="flex-1 nav-label py-2.5 bg-charcoal text-white text-[11px]"
                    >
                      MASUK
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="flex-1 nav-label py-2.5 border border-line text-charcoal text-[11px]"
                    >
                      DAFTAR
                    </button>
                  </div>
                )}
              </div>

              <div className="border-b border-line pb-6">
                <p className="nav-label text-muted-aa mb-4" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
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
                <p className="nav-label text-muted-aa mb-4" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
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
                      style={{ backgroundColor: 'var(--sale)', fontSize: '10px', letterSpacing: '0.14em' }}
                    >
                      SALE
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Visual Mode Switcher (Signature Light vs Signature Night) */}
              <div className="border-b border-line pb-6">
                <p className="nav-label text-muted mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                  TAMPILAN TEMA
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (theme !== 'light') toggleTheme();
                    }}
                    className={`nav-label py-2.5 px-3 flex items-center justify-center gap-1.5 border transition-all text-xs ${
                      theme === 'light'
                        ? 'border-charcoal bg-surface font-medium text-charcoal'
                        : 'border-line text-muted hover:border-line-strong'
                    }`}
                  >
                    <Sun size={14} />
                    <span>LIGHT</span>
                  </button>
                  <button
                    onClick={() => {
                      if (theme !== 'dark') toggleTheme();
                    }}
                    className={`nav-label py-2.5 px-3 flex items-center justify-center gap-1.5 border transition-all text-xs ${
                      theme === 'dark'
                        ? 'border-charcoal bg-surface font-medium text-charcoal'
                        : 'border-line text-muted hover:border-line-strong'
                    }`}
                  >
                    <Moon size={14} />
                    <span>NIGHT</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-3 text-xs text-muted-aa font-light mb-4">
                  <span>Mata Uang:</span>
                  <div className="flex gap-2">
                    {CURRENCIES.map((code) => (
                      <button
                        key={code}
                        onClick={() => setCurrency(code)}
                        className={`nav-label px-2.5 py-1 border ${
                          currency === code ? 'border-charcoal text-charcoal font-medium bg-surface' : 'border-line text-muted-aa'
                        }`}
                        style={{ fontSize: '11px' }}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-aa font-light">
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
