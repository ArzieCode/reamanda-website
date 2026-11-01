// ============================================================
// Component — Header Navigation & Customer Account Dropdown
// ============================================================
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import { Drawer } from '../ui/Drawer';
import { CustomerAuthModal } from '../account/CustomerAuthModal';
import { CustomerAccountDrawer } from '../account/CustomerAccountDrawer';
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Menu,
  User,
  LogOut,
  ChevronDown,
  ShoppingBag as OrderIcon,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [accountDrawerTab, setAccountDrawerTab] = useState<'profile' | 'orders'>('profile');

  const { totalItems, openCart } = useCart();
  const { isStaff, currentUser, logout } = useAuth();
  const { isVisitorPreview } = useAdmin();
  const location = useLocation();

  const isKost = location.pathname.startsWith('/kost-wanita');
  const isKatering = location.pathname.startsWith('/katering');
  const isBusana = location.pathname.startsWith('/busana');
  const brandPath = isKost ? '/kost-wanita' : isKatering ? '/katering' : isBusana ? '/busana' : '/';
  const brandName = isKost ? 'D’Rhea Syariah Guest House' : isKatering ? 'Katering Rheamanda' : isBusana ? 'Busana Rheamanda' : BRAND.wordmark;
  const brandLogo = isKost ? '/d-rhea-syariah-mark.png' : isKatering ? '/rheamanda-mark.png' : isBusana ? '/rheamanda-fashion-logo.png' : null;

  const navItems = isKost
    ? [{ label: 'Informasi Kost', href: '/kost-wanita#informasi-kost' }]
    : isKatering
    ? [
        { label: 'Paket Perjamuan', href: '/katering#paket' },
        { label: 'Daftar Menu Pilihan', href: '/katering#menu' },
        { label: 'Cara Pemesanan', href: '/katering#cara-pesan' },
        { label: 'Kontak', href: '/katering#kontak' },
      ]
    : isBusana ? [
        { label: 'Produk', href: '/busana#terbaru' },
        { label: 'Hijab', href: '/busana?kategori=Hijab' },
        { label: 'Tunik', href: '/busana?kategori=Tunik' },
        { label: 'Koleksi', href: '/busana#koleksi' },
        { label: 'Sale', href: '/busana?filter=sale', isSale: true },
      ] : [
        { label: 'Busana', href: '/busana' },
        { label: 'Kost Wanita', href: '/kost-wanita' },
        { label: 'Katering', href: '/katering' },
      ];

  const handleOpenLogin = () => {
    setAuthModalInitialTab('login');
    setAuthModalOpen(true);
    setAccountDropdownOpen(false);
  };

  const handleOpenRegister = () => {
    setAuthModalInitialTab('register');
    setAuthModalOpen(true);
    setAccountDropdownOpen(false);
  };

  const handleOpenAccount = (tab: 'profile' | 'orders') => {
    setAccountDrawerTab(tab);
    setAccountDrawerOpen(true);
    setAccountDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-header w-full bg-white border-b border-line h-[60px] lg:h-[72px]">
        {/* Desktop View (>= 1280px) */}
        <div className="hidden min-[1280px]:flex items-center justify-between gap-6 site-container h-full">
          {/* Left: Brand mark and name */}
          <div className="flex items-center">
            <Link
              to={brandPath}
              aria-label={brandName}
              className="inline-flex shrink-0 items-center gap-2 font-serif text-charcoal tracking-[0.02em] whitespace-nowrap text-[22px] hover:opacity-85 transition-opacity"
            >
              {brandLogo && <img src={brandLogo} alt="" className="h-10 max-w-11 object-contain" />}
              <span className="text-[20px]">{brandName}</span>
            </Link>
          </div>

          {/* Centre: Navigation */}
          <nav className="flex shrink-0 items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-xs uppercase tracking-[0.14em] font-sans text-ink hover:text-caramel-deep hover:underline underline-offset-4 decoration-1 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {item.label}
                {item.isSale && (
                  <span
                    className="bg-sale text-white px-2 py-0.5 text-[10px] tracking-[0.14em] font-sans font-medium rounded-full"
                  >
                    SALE
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1 text-charcoal hover:text-caramel-deep transition-colors"
              aria-label="Cari produk atau layanan"
            >
              <Search size={18} className="stroke-[1.25]" />
            </button>

            {isBusana && <button
              type="button"
              onClick={openCart}
              className="relative p-1 text-charcoal hover:text-caramel-deep transition-colors flex items-center gap-1.5"
              aria-label={`Keranjang belanja, ${totalItems} barang`}
            >
              <ShoppingBag size={18} className="stroke-[1.25]" />
              {totalItems > 0 && (
                <span
                  className="bg-charcoal text-white text-[10px] w-4 h-4 flex items-center justify-center font-sans font-normal rounded-xs"
                >
                  {totalItems}
                </span>
              )}
            </button>}

            {/* Profile Dropdown Entry Point */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className="p-1 text-charcoal hover:text-caramel-deep transition-colors flex items-center gap-1 text-xs font-sans"
                aria-label="Menu Akun Pengguna"
              >
                <User size={18} className="stroke-[1.25]" />
                {currentUser && (
                  <span className="hidden xl:inline max-w-[100px] truncate font-medium">
                    {currentUser.name.split(' ')[0]}
                  </span>
                )}
                <ChevronDown size={12} className="stroke-[1.5] text-muted" />
              </button>

              {accountDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-line rounded-[2px] shadow-lg py-1.5 text-xs font-sans z-header animate-modal-panel"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 border-b border-line/60">
                        <span className="text-[10px] uppercase tracking-wider text-muted block">Akun Pengguna</span>
                        <div className="font-medium text-charcoal truncate">{currentUser.name}</div>
                        <span className="text-[10px] text-muted capitalize">{currentUser.role}</span>
                      </div>

                      {isStaff && !isVisitorPreview && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="w-full px-3 py-2 text-left hover:bg-surface text-ink flex items-center gap-2"
                        >
                          <ShieldCheck size={14} className="text-indigo" />
                          <span>Portal Administrator</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenAccount('profile')}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-ink flex items-center gap-2"
                      >
                        <User size={14} />
                        <span>Akun Saya</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAccount('orders')}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-ink flex items-center gap-2"
                      >
                        <OrderIcon size={14} />
                        <span>Riwayat Pesanan</span>
                      </button>

                      <div className="border-t border-line/60 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-status-occupied flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        <span>Keluar Akun</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleOpenLogin}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-charcoal font-medium flex items-center gap-2"
                      >
                        <User size={14} />
                        <span>Masuk Akun</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenRegister}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-ink flex items-center gap-2"
                      >
                        <span>Daftar Akun Baru</span>
                      </button>
                      <div className="border-t border-line/60 my-1" />
                      <Link
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="w-full px-3 py-2 text-left hover:bg-surface text-muted text-[11px] flex items-center gap-2"
                      >
                        <ShieldCheck size={13} />
                        <span>Portal Staf / Admin</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet View (< 1280px) */}
        <div className="min-[1280px]:hidden flex items-center justify-between site-container h-full">
          {/* Left: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-charcoal hover:text-caramel-deep transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} className="stroke-[1.25]" />
          </button>

          {/* Centre: Brand mark and name */}
          <Link
            to={brandPath}
            aria-label={brandName}
            className="inline-flex items-center gap-1.5 font-serif text-charcoal tracking-[0.02em] whitespace-nowrap text-[18px] sm:text-[20px]"
          >
            {brandLogo && <img src={brandLogo} alt="" className="h-8 max-w-8 object-contain" />}
            <span className="text-[13px] sm:text-[18px] truncate max-w-[170px] sm:max-w-none">{brandName}</span>
          </Link>

          {/* Right: Icons (Search, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1 text-charcoal hover:text-caramel-deep transition-colors"
              aria-label="Cari"
            >
              <Search size={18} className="stroke-[1.25]" />
            </button>

            {isBusana && <button
              type="button"
              onClick={openCart}
              className="relative p-1 text-charcoal hover:text-caramel-deep transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingBag size={18} className="stroke-[1.25]" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-charcoal text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center font-sans rounded-xs"
                >
                  {totalItems}
                </span>
              )}
            </button>}

            <button
              type="button"
              onClick={() => {
                if (currentUser) handleOpenAccount('profile');
                else handleOpenLogin();
              }}
              className="p-1 text-charcoal hover:text-caramel-deep transition-colors"
              aria-label="Akun"
            >
              <User size={18} className="stroke-[1.25]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        id="mobile-menu-drawer"
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={brandName}
        side="left"
        maxWidth="w-full sm:max-w-[360px]"
      >
        <div className="space-y-6">
          {/* Lini Bisnis */}
          <div>
            <span className="label-editorial text-muted block mb-2">Lini Bisnis</span>
            <div className="grid grid-cols-3 gap-1">
              <Link
                to="/busana"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 text-center text-xs uppercase tracking-wider font-sans border border-line ${
                  isBusana ? 'bg-charcoal text-white' : 'bg-surface text-ink'
                }`}
              >
                Busana
              </Link>
              <Link
                to="/kost-wanita"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 text-center text-xs uppercase tracking-wider font-sans border border-line ${
                  isKost ? 'bg-charcoal text-white' : 'bg-surface text-ink'
                }`}
              >
                Kost Wanita
              </Link>
              <Link
                to="/katering"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 text-center text-xs uppercase tracking-wider font-sans border border-line ${
                  isKatering ? 'bg-charcoal text-white' : 'bg-surface text-ink'
                }`}
              >
                Katering
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <span className="label-editorial text-muted block">Navigasi Bagian</span>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-[0.14em] font-sans text-ink hover:text-caramel-deep flex items-center justify-between py-1.5 border-b border-line/40 transition-colors"
              >
                <span>{item.label}</span>
                {item.isSale && (
                  <span className="bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium rounded-full">
                    SALE
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Account links in mobile drawer */}
          <div className="pt-4 border-t border-line space-y-2">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAccountDrawerOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-surface border border-line text-left text-xs uppercase tracking-wider font-sans flex items-center gap-2 rounded-[2px]"
                >
                  <User size={15} />
                  <span>Akun Saya ({currentUser.name})</span>
                </button>
                {isStaff && !isVisitorPreview && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 bg-indigo text-white text-xs uppercase tracking-wider font-sans flex items-center justify-center gap-2 rounded-[2px]"
                  >
                    <ShieldCheck size={15} />
                    <span>Portal Administrator</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenLogin();
                  }}
                  className="w-full py-2.5 px-3 bg-charcoal text-white text-xs uppercase tracking-wider font-sans flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <User size={15} />
                  <span>Masuk / Daftar Akun</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 border border-line text-muted text-xs uppercase tracking-wider font-sans flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <ShieldCheck size={15} />
                  <span>Portal Staf / Admin</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        key={`${authModalInitialTab}-${authModalOpen}`}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
      />

      {/* Customer Account Drawer */}
      <CustomerAccountDrawer
        key={`${accountDrawerTab}-${accountDrawerOpen}`}
        isOpen={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        initialTab={accountDrawerTab}
      />
    </>
  );
};
