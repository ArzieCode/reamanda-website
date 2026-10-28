import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { BRAND } from '../../config/brand';
import { Drawer } from '../ui/Drawer';
import { Search, ShoppingBag, ShieldCheck, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAdminModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isAdmin, openDashboard } = useAdmin();
  const location = useLocation();

  // Determine section navigation items based on current business line
  const isKost = location.pathname.startsWith('/kost-wanita');
  const isKatering = location.pathname.startsWith('/katering');
  const isBusana = location.pathname.startsWith('/busana');
  const brandPath = isKost ? '/kost-wanita' : isKatering ? '/katering' : isBusana ? '/busana' : '/';
  const brandName = isKost ? 'D’Rhea Syariah Guest House' : isKatering ? 'Katering Rheamanda' : isBusana ? 'Busana Rheamanda' : BRAND.wordmark;
  const brandLogo = isKost ? '/d-rhea-syariah-mark.png' : isKatering ? '/rheamanda-mark.png' : isBusana ? '/rheamanda-fashion-logo.png' : null;

  const navItems = isKost
    ? [
        { label: 'Informasi Kost', href: '/kost-wanita#informasi-kost' },
      ]
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

  const drawerFooter = (
    <div>
      {isAdmin ? (
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            openDashboard();
          }}
          className="w-full py-3 bg-indigo text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 font-sans font-medium"
          style={{ borderRadius: '2px' }}
        >
          <ShieldCheck size={16} />
          <span>Buka Dasbor Admin</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onOpenAdminModal();
          }}
          className="w-full py-3 border border-line text-ink hover:text-charcoal text-xs uppercase tracking-widest flex items-center justify-center gap-2 font-sans font-medium"
          style={{ borderRadius: '2px' }}
        >
          <ShieldCheck size={16} />
          <span>Masuk Administrator</span>
        </button>
      )}
    </div>
  );

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
                    className="bg-sale text-white px-2 py-0.5 text-[10px] tracking-[0.14em] font-sans font-medium"
                    style={{ borderRadius: '9999px' }}
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
                  className="bg-charcoal text-white text-[10px] w-4 h-4 flex items-center justify-center font-sans font-normal"
                  style={{ borderRadius: '2px' }}
                >
                  {totalItems}
                </span>
              )}
            </button>}

            {isAdmin ? (
              <button
                type="button"
                onClick={openDashboard}
                className="p-1 text-indigo hover:opacity-80 transition-colors flex items-center gap-1 text-[11px] font-sans uppercase tracking-wider"
                title="Buka Dasbor Admin"
              >
                <ShieldCheck size={18} className="stroke-[1.25]" />
                <span className="hidden xl:inline">Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="p-1 text-muted hover:text-charcoal transition-colors"
                title="Masuk sebagai Administrator"
              >
                <ShieldCheck size={17} className="stroke-[1.25]" />
              </button>
            )}
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

          {/* Right: Icons */}
          <div className="flex items-center gap-3">
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
                  className="absolute -top-1 -right-1 bg-charcoal text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center font-sans"
                  style={{ borderRadius: '2px' }}
                >
                  {totalItems}
                </span>
              )}
            </button>}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer using reusable Drawer component */}
      <Drawer
        id="mobile-menu-drawer"
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={brandName}
        side="left"
        maxWidth="w-full sm:max-w-[360px]"
        footer={drawerFooter}
      >
        <div className="space-y-6">
          {/* Business line switcher in drawer */}
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
          <nav className="flex flex-col gap-3">
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
                  <span
                    className="bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium"
                    style={{ borderRadius: '9999px' }}
                  >
                    SALE
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </Drawer>
    </>
  );
};
