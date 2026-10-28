import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const BrandTabStrip: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isKost = currentPath.startsWith('/kost-wanita');
  const isKatering = currentPath.startsWith('/katering');
  const isBusana = currentPath.startsWith('/busana') || currentPath === '/' || (!isKost && !isKatering);

  const tabs = [
    { label: 'Busana', path: '/busana', isActive: isBusana },
    { label: 'Kost Eksklusif Wanita', path: '/kost-wanita', isActive: isKost },
    { label: 'Katering', path: '/katering', isActive: isKatering },
  ];

  return (
    <div className="w-full bg-white border-b border-line h-10 select-none">
      <div className="site-container h-full flex items-center">
        <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar h-full py-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={`h-8 px-2 sm:px-4 flex items-center justify-center text-[10px] sm:text-xs uppercase tracking-[0.05em] sm:tracking-[0.18em] transition-colors whitespace-nowrap font-sans ${
                tab.isActive
                  ? 'bg-charcoal text-white font-normal'
                  : 'bg-white text-ink hover:text-charcoal'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
