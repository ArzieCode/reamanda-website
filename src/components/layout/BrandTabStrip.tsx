import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BrandTabStrip: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isKost = currentPath.startsWith('/kost-wanita');
  const isKatering = currentPath.startsWith('/katering');
  const isBusana = currentPath.startsWith('/busana');
  const isHome = currentPath === '/';

  const tabs = [
    { label: 'Busana', path: '/busana', isActive: isBusana },
    { label: 'Kost Eksklusif Wanita', shortLabel: 'Kost Wanita', path: '/kost-wanita', isActive: isKost },
    { label: 'Katering', path: '/katering', isActive: isKatering },
  ];

  return (
    <div className="w-full bg-white border-b border-line h-12 select-none">
      <div className="site-container !px-3 sm:!px-8 lg:!px-12 h-full flex items-center gap-1 sm:gap-5">
        <Link
          to="/"
          className={`shrink-0 inline-flex min-h-10 items-center gap-1 text-sm font-sans font-medium hover:text-caramel-deep ${isHome ? 'text-charcoal' : 'text-ink underline underline-offset-4'}`}
        >
          {!isHome && <ArrowLeft size={16} />}
          <span className="sm:hidden">{isHome ? 'Beranda' : 'Kembali'}</span>
          <span className="hidden sm:inline">{isHome ? 'Beranda Rheamanda' : 'Kembali ke Rheamanda'}</span>
        </Link>
        <nav aria-label="Lini usaha" className="flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar h-full py-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={`min-h-10 px-1.5 sm:px-4 flex items-center justify-center text-sm tracking-normal transition-colors whitespace-nowrap font-sans font-medium ${
                tab.isActive
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-ink hover:text-charcoal'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
