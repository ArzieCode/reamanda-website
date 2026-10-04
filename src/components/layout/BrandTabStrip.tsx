// ============================================================
// Brand Tab Strip — folder-tab style, 44px high, left-aligned
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
    return 'Busana'; // default on landing
  };

  const activeTab = getActive();

  return (
    <div
      className="w-full border-b"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 flex justify-start">
        <div className="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap">
          {tabs.map((tab, i) => {
            const isActive = tab.label === activeTab;
            const isCaramel = !isActive && tab.label === 'Katering' && activeTab !== 'Katering';

            return (
              <Link
                key={tab.label}
                to={tab.path}
                className="nav-label h-11 px-5 inline-flex items-center justify-center min-w-[44px] transition-colors duration-400 border-r"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  borderColor: 'var(--line)',
                  borderLeftWidth: i === 0 ? 1 : 0,
                  backgroundColor: isActive
                    ? 'var(--charcoal)'
                    : isCaramel
                    ? 'var(--caramel)'
                    : 'transparent',
                  color: isActive
                    ? '#ffffff'
                    : isCaramel
                    ? '#ffffff'
                    : 'var(--muted)',
                  fontWeight: isCaramel || isActive ? 500 : 400,
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
