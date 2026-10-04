// ============================================================
// Header — transparent over hero, white when scrolled
// Includes mega-menu for Busana nav item
// ============================================================
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown } from 'lucide-react';
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

  const isTransparent = isHeroPage && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-charcoal';
  const iconColor = isTransparent ? '#fff' : 'var(--charcoal)';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-400"
      style={{
        backgroundColor: isTransparent ? 'transparent' : 'var(--bg)',
        borderBottom: isTransparent ? 'none' : '1px solid var(--line)',
        // Account for the BrandTabStrip + AnnouncementBar above (only when not scrolled)
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Wordmark */}
        <Link
          to="/"
          className={`font-cormorant text-xl tracking-widest uppercase font-light transition-colors duration-400 ${textColor}`}
          style={{ letterSpacing: '0.25em' }}
        >
          RiaMiranda
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.hasMega && setMegaOpen(true)}
              onMouseLeave={() => item.hasMega && setMegaOpen(false)}
            >
              <Link
                to={item.path}
                className={`nav-label flex items-center gap-1 transition-colors duration-400 hover:opacity-70 ${textColor}`}
                style={{ fontSize: '11px' }}
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

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Currency */}
          <span
            className={`nav-label hidden md:block transition-colors duration-400 ${textColor}`}
            style={{ fontSize: '10px', cursor: 'pointer' }}
          >
            🇮🇩 IDR
          </span>

          <button
            aria-label="Cari"
            className={`transition-colors duration-400 hover:opacity-70 ${textColor}`}
          >
            <Search size={18} color={iconColor} strokeWidth={1.25} />
          </button>

          <button
            aria-label="Akun saya"
            className={`transition-colors duration-400 hover:opacity-70 ${textColor}`}
          >
            <User size={18} color={iconColor} strokeWidth={1.25} />
          </button>

          <button
            aria-label={`Keranjang (${totalItems} item)`}
            className={`relative transition-colors duration-400 hover:opacity-70 ${textColor}`}
            onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
          >
            <ShoppingBag size={18} color={iconColor} strokeWidth={1.25} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center text-white"
                style={{
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  backgroundColor: 'var(--caramel)',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
