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
  const isProperti = location.pathname.startsWith('/properti');
  const isKatering = location.pathname.startsWith('/katering');

  const navItems = isProperti
    ? [
        { label: 'Semua Properti', href: '/properti#semua' },
        { label: 'Boutique Hotel', href: '/properti#hotel' },
        { label: 'Living Santun', href: '/properti#living' },
        { label: 'Reservasi & Sewa', href: '/properti#sewa' },
        { label: 'Bidding / Investasi', href: '/properti#investasi' },
      ]
    : isKatering
    ? [
        { label: 'Paket Perjamuan', href: '/katering#paket' },
        { label: 'Pernikahan Santun', href: '/katering#pernikahan' },
        { label: 'Jamuan Korporasi', href: '/katering#korporasi' },
        { label: 'Daftar Menu Pilihan', href: '/katering#menu' },
        { label: 'Konsultasi Menu', href: '/katering#kontak' },
      ]
    : [
        { label: 'New Arrivals', href: '/busana?filter=new' },
        { label: 'Hijab & Scarf', href: '/busana?kategori=Hijab' },
        { label: 'Tunik & Blouse', href: '/busana?kategori=Tunik' },
        { label: 'Abaya & Gaun', href: '/busana?kategori=Abaya' },
        { label: 'Mukena & Sholat', href: '/busana?kategori=Mukena' },
        { label: 'Koleksi', href: '/busana#koleksi' },
        { label: 'Sale', href: '/busana?filter=sale', isSale: true },
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
        {/* Desktop View (>= 1100px) */}
        <div className="hidden min-[1100px]:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6 items-center site-container h-full">
          {/* Left: Wordmark */}
          <div className="flex items-center">
            <Link
              to="/"
              className="font-serif text-charcoal tracking-[0.22em] whitespace-nowrap uppercase text-[20px] lg:text-[24px] hover:opacity-85 transition-opacity"
            >
              {BRAND.wordmark}
            </Link>
          </div>

          {/* Centre: Navigation */}
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-xs uppercase tracking-[0.14em] font-sans text-ink hover:text-caramel-deep hover:underline underline-offset-4 decoration-1 transition-colors flex items-center gap-1.5"
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

            <button
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
            </button>

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

        {/* Mobile / Tablet View (< 1100px) */}
        <div className="min-[1100px]:hidden flex items-center justify-between site-container h-full">
          {/* Left: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-charcoal hover:text-caramel-deep transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} className="stroke-[1.25]" />
          </button>

          {/* Centre: Wordmark */}
          <Link
            to="/"
            className="font-serif text-charcoal tracking-[0.22em] whitespace-nowrap uppercase text-[18px] sm:text-[20px]"
          >
            {BRAND.wordmark}
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

            <button
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
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer using reusable Drawer component */}
      <Drawer
        id="mobile-menu-drawer"
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={BRAND.wordmark}
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
                  !isProperti && !isKatering ? 'bg-charcoal text-white' : 'bg-surface text-ink'
                }`}
              >
                Busana
              </Link>
              <Link
                to="/properti"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 text-center text-xs uppercase tracking-wider font-sans border border-line ${
                  isProperti ? 'bg-charcoal text-white' : 'bg-surface text-ink'
                }`}
              >
                Properti
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
