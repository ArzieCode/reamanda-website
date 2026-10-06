// ============================================================
// Brand Tab Strip — 40px high, 12px uppercase, 20px side padding
// Left-aligned to container, horizontally scrollable on mobile
// Active: charcoal/white; Inactive: white/ink with 1px border
// ============================================================
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
    return 'Busana'; // default
  };

  const activeTab = getActive();

  return (
    <div
      className="w-full bg-bg border-b border-line"
      style={{ height: 'var(--tab-strip-height)' }}
    >
      <div className="site-container h-full flex justify-start items-center">
        <div className="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap h-full">
          {tabs.map((tab, i) => {
            const isActive = tab.label === activeTab;

            return (
              <Link
                key={tab.label}
                to={tab.path}
                className="nav-label inline-flex items-center justify-center px-5 h-full transition-colors duration-300 focus-visible:outline-none hover:text-charcoal"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  backgroundColor: isActive ? 'var(--color-bg-primary-surface)' : 'transparent',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderRight: '1px solid var(--line)',
                  borderLeft: i === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: isActive ? '2px solid var(--color-accent)' : 'none',
                  fontWeight: isActive ? 500 : 400,
                  minWidth: '44px',
                }}
              >
                {tab.label.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
