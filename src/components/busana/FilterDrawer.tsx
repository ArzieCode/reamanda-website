// ============================================================
// FilterDrawer — left-side filter panel for collection page
// ============================================================
import React from 'react';
import { X } from 'lucide-react';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All Size'];
const colors = [
  { name: 'Ivory', hex: '#F5F0E8' },
  { name: 'Cream', hex: '#EDE5D4' },
  { name: 'Sand', hex: '#C8B89A' },
  { name: 'Caramel', hex: '#987245' },
  { name: 'Sage', hex: '#8A9E8A' },
  { name: 'Dusty Rose', hex: '#C9A4A0' },
  { name: 'Mocha', hex: '#8B6F5E' },
  { name: 'Charcoal', hex: '#4F4D4A' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'White', hex: '#FFFFFF' },
];

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSizes: string[];
  selectedColors: string[];
  minPrice: string;
  maxPrice: string;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onPriceChange: (field: 'min' | 'max', value: string) => void;
  onReset: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedSizes,
  selectedColors,
  minPrice,
  maxPrice,
  onToggleSize,
  onToggleColor,
  onPriceChange,
  onReset,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-400"
        style={{ backgroundColor: 'rgba(77,73,70,0.3)' }}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col overflow-y-auto"
        style={{
          width: 300,
          backgroundColor: 'var(--bg)',
          borderRight: '1px solid var(--line)',
        }}
        aria-label="Filter produk"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--line)' }}>
          <p className="nav-label" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
            FILTER
          </p>
          <button onClick={onClose} className="transition-opacity duration-400 hover:opacity-60" aria-label="Tutup filter">
            <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8 flex-1">
          {/* Size */}
          <div>
            <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
              UKURAN
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onToggleSize(s)}
                  className="nav-label px-3 py-1.5 border transition-all duration-400"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    borderColor: selectedSizes.includes(s) ? 'var(--charcoal)' : 'var(--line)',
                    color: selectedSizes.includes(s) ? 'var(--charcoal)' : 'var(--muted)',
                    backgroundColor: selectedSizes.includes(s) ? 'var(--surface)' : 'transparent',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div>
            <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
              WARNA
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onToggleColor(c.name)}
                  title={c.name}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: c.hex,
                    border: selectedColors.includes(c.name)
                      ? '2px solid var(--charcoal)'
                      : '1px solid var(--line)',
                  }}
                  aria-label={c.name}
                  aria-pressed={selectedColors.includes(c.name)}
                />
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
              HARGA (RP)
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onPriceChange('min', e.target.value)}
                className="input-underline text-sm flex-1"
                style={{ fontSize: '13px' }}
              />
              <input
                type="number"
                placeholder="Maks"
                value={maxPrice}
                onChange={(e) => onPriceChange('max', e.target.value)}
                className="input-underline text-sm flex-1"
                style={{ fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t" style={{ borderColor: 'var(--line)' }}>
          <button
            onClick={onReset}
            className="nav-label w-full py-3 border transition-all duration-400 hover:opacity-70"
            style={{
              fontSize: '10px',
              letterSpacing: '0.16em',
              borderColor: 'var(--line)',
              color: 'var(--muted)',
            }}
          >
            RESET FILTER
          </button>
        </div>
      </aside>
    </>
  );
}
