// ============================================================
// Brand Tab Strip — folder-tab style, above the header
// ============================================================
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Busana', path: '/busana' },
  { label: 'Properti', path: '/properti' },
  { label: 'Katering', path: '/katering' },
];

export default function BrandTabStrip() {
  const { pathname } = useLocation();

  const getActive = () => {
    if (pathname.startsWith('/busana')) return 'Busana';
    if (pathname.startsWith('/properti')) return 'Properti';
    if (pathname.startsWith('/katering')) return 'Katering';
    return 'Busana'; // default on landing
  };

  const activeTab = getActive();

  return (
    <div
      className="w-full flex justify-end border-b"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--bg)' }}
    >
      <div className="flex">
        {tabs.map((tab, i) => {
          const isActive = tab.label === activeTab;
          // One tab gets caramel accent — the Katering tab when not on catering
          const isCaramel = !isActive && tab.label === 'Katering' && activeTab !== 'Katering';

          return (
            <Link
              key={tab.label}
              to={tab.path}
              className="nav-label px-5 py-2 transition-colors duration-400 border-l"
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                borderColor: 'var(--line)',
                backgroundColor: isActive
                  ? 'var(--charcoal)'
                  : isCaramel
                  ? 'var(--caramel)'
                  : 'transparent',
                color: isActive || isCaramel ? '#fff' : 'var(--muted)',
                borderLeftWidth: i === 0 ? 0 : 1,
              }}
            >
              {tab.label.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
