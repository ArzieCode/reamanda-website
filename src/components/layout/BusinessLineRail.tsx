import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const lines = [
  { path: '/busana', number: '01', label: 'Busana Muslim', detail: 'Fashion & mukena' },
  { path: '/kost-wanita', number: '02', label: 'Kost Eksklusif', detail: 'Hunian khusus wanita' },
  { path: '/katering', number: '03', label: 'Katering', detail: 'Sajian & kebutuhan acara' },
] as const;

export const BusinessLineRail: React.FC = () => (
  <aside className="hidden min-[1280px]:block w-[196px] shrink-0 border-r border-line bg-surface-2/80" aria-label="Jelajahi lini usaha Rheamanda">
    <div className="sticky top-[72px] h-[calc(100vh-72px)] flex flex-col px-5 py-10">
      <span className="label-editorial text-caramel-deep text-[11px]">Jelajahi Rheamanda</span>
      <nav aria-label="Lini usaha" className="mt-8 space-y-3">
        {lines.map((line) => (
          <NavLink
            key={line.path}
            to={line.path}
            className={({ isActive }) => `block border-l-2 px-3 py-3 transition-colors focus-visible:outline-offset-[-2px] ${
              isActive ? 'border-caramel-deep bg-white text-charcoal' : 'border-transparent text-ink hover:border-caramel hover:bg-white/70'
            }`}
          >
            <span className="block text-[11px] tracking-[0.16em] text-caramel-deep">{line.number}</span>
            <span className="block font-serif text-[22px] leading-none mt-2">{line.label}</span>
            <span className="block text-xs leading-snug text-muted mt-2">{line.detail}</span>
          </NavLink>
        ))}
      </nav>
      <Link to="/" className="mt-auto pt-6 border-t border-line inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:text-caramel-deep">
        Beranda grup <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </div>
  </aside>
);
