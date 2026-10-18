import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const BrandTabStrip: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isProperti = currentPath.startsWith('/properti');
  const isKatering = currentPath.startsWith('/katering');
  const isBusana = currentPath.startsWith('/busana') || currentPath === '/' || (!isProperti && !isKatering);

  const tabs = [
    { label: 'Busana', path: '/busana', isActive: isBusana },
    { label: 'Properti', path: '/properti', isActive: isProperti },
    { label: 'Katering', path: '/katering', isActive: isKatering },
  ];

  return (
    <div className="w-full bg-white border-b border-line h-10 select-none">
      <div className="site-container h-full flex items-center">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full py-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={`h-8 px-4 flex items-center justify-center text-xs uppercase tracking-[0.18em] transition-colors whitespace-nowrap font-sans ${
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
