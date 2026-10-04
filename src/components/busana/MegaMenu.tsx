// ============================================================
// MegaMenu — drops from the "Koleksi / Busana" nav item
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  onClose: () => void;
}

const categories = [
  'Scarves', 'Tops', 'Knitwear', 'Tunics', 'Dresses',
  'Bottoms', 'Co-Ord Sets', 'Outerwear', 'Prayer Sets',
  'Accessories', 'Menswear', 'Kidswear',
];

export default function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div
      className="absolute left-1/2 top-full mt-0 w-[640px] border border-t-0 z-50"
      style={{
        transform: 'translateX(-40%)',
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--line)',
      }}
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-4 gap-0 p-8">
        {/* New In */}
        <div className="border-r pr-6" style={{ borderColor: 'var(--line)' }}>
          <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            NEW IN
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/busana"
                onClick={onClose}
                className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                Semua Terbaru
              </Link>
            </li>
            <li>
              <Link
                to="/busana"
                onClick={onClose}
                className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                Minggu Ini
              </Link>
            </li>
          </ul>
        </div>

        {/* Collections */}
        <div className="border-r px-6" style={{ borderColor: 'var(--line)' }}>
          <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            KOLEKSI
          </p>
          <ul className="space-y-2 mb-5">
            <li>
              <Link
                to="/busana/koleksi/luminara"
                onClick={onClose}
                className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                Luminara
              </Link>
            </li>
            <li>
              <Link
                to="/busana/koleksi/terra"
                onClick={onClose}
                className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                Terra
              </Link>
            </li>
          </ul>
          <p className="nav-label mb-3" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            KOLABORASI
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/busana/koleksi/kolaborasi-nara"
                onClick={onClose}
                className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                Nara Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Category */}
        <div className="border-r px-6" style={{ borderColor: 'var(--line)' }}>
          <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            KATEGORI
          </p>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to="/busana"
                  onClick={onClose}
                  className="text-sm font-light transition-opacity duration-400 hover:opacity-60 block"
                  style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SALE */}
        <div className="pl-6 flex flex-col justify-start items-start">
          <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            PROMOSI
          </p>
          <Link
            to="/busana"
            onClick={onClose}
            className="nav-label px-4 py-2 rounded-full text-white transition-opacity duration-400 hover:opacity-80"
            style={{
              backgroundColor: 'var(--sale)',
              fontSize: '10px',
              letterSpacing: '0.16em',
            }}
          >
            SALE
          </Link>
        </div>
      </div>
    </div>
  );
}
