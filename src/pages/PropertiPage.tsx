// ============================================================
// Properti Page (/properti) — listing + filters + status legend
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Placeholder from '../components/ui/Placeholder';
import { getListings } from '../services/properti';
import type { Property, PropertyStatus, PropertyType } from '../types/properti';
import { formatRupiah } from '../utils/format';

const statusConfig: Record<PropertyStatus, { label: string; color: string }> = {
  tersedia: { label: 'Tersedia', color: 'var(--available)' },
  dp: { label: 'Sudah DP', color: 'var(--deposit)' },
  ditempati: { label: 'Sudah Ditempati', color: 'var(--occupied)' },
};

const propertyTypes: PropertyType[] = ['Hotel', 'Rumah', 'Ruko', 'Tanah'];

export default function PropertiPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<PropertyType | ''>('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | ''>('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  useEffect(() => {
    getListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  const filtered = listings.filter((p) => {
    if (typeFilter && p.type !== typeFilter) return false;
    if (locationFilter && !p.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (minPriceFilter && p.startingPrice < Number(minPriceFilter)) return false;
    if (maxPriceFilter && p.startingPrice > Number(maxPriceFilter)) return false;
    return true;
  });

  return (
    <>
      {/* Hero with flat charcoal overlay (0.45) and dark placeholder */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: 'clamp(520px, 80svh, 860px)' }}
      >
        <div className="absolute inset-0 w-full h-full">
          <Placeholder ratio="16/9" dark={true} label="Properti & Hotel" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ backgroundColor: 'rgba(79, 77, 74, 0.45)' }}
        >
          <p className="nav-label text-white mb-4 select-none" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
            PROPERTI & HOTEL
          </p>
          <h1
            className="font-cormorant font-light text-white max-w-3xl leading-snug"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.04em' }}
          >
            Platform Lelang Properti Eksklusif
          </h1>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 pb-28 md:pb-36">
        {/* Status Legend */}
        <div
          className="flex flex-wrap items-center gap-6 py-4 px-6 mb-10 border"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--surface)' }}
        >
          <p className="nav-label" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
            KETERANGAN STATUS:
          </p>
          {(Object.entries(statusConfig) as [PropertyStatus, typeof statusConfig[PropertyStatus]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="rounded-full flex-shrink-0"
                style={{ width: 8, height: 8, backgroundColor: cfg.color }}
              />
              <span className="text-xs font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '13px' }}>
                {cfg.label}
                {key === 'tersedia' && <span className="ml-1 text-xs" style={{ color: 'var(--muted)' }}>(belum ditempati)</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Filters: 44px min touch height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as PropertyType | '')}
            className="nav-label border min-h-[44px] px-3 bg-transparent focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.12em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          >
            <option value="">Semua Tipe</option>
            {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <input
            type="text"
            placeholder="Lokasi..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="nav-label border min-h-[44px] px-3 bg-transparent focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.1em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          />

          <input
            type="number"
            placeholder="Harga min (Rp)"
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
            className="nav-label border min-h-[44px] px-3 bg-transparent focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.1em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          />

          <input
            type="number"
            placeholder="Harga maks (Rp)"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            className="nav-label border min-h-[44px] px-3 bg-transparent focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.1em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | '')}
            className="nav-label border min-h-[44px] px-3 bg-transparent focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.12em', borderColor: 'var(--line)', color: 'var(--charcoal)' }}
          >
            <option value="">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="dp">Sudah DP</option>
            <option value="ditempati">Sudah Ditempati</option>
          </select>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => <div key={i} className="aspect-[16/6] bg-surface" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-cormorant font-light text-2xl mb-3" style={{ color: 'var(--charcoal)' }}>
              Tidak ada properti yang sesuai
            </p>
            <p className="text-sm font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>
              Coba sesuaikan filter pencarian Anda
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((prop) => {
              const status = statusConfig[prop.status];
              return (
                <Link
                  key={prop.id}
                  to={`/properti/${prop.id}`}
                  className="block group border transition-all duration-400 hover:opacity-90 focus-visible:outline-none"
                  style={{
                    borderColor: 'var(--line)',
                    borderTopColor: status.color,
                    borderTopWidth: 2,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Photo */}
                    <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <Placeholder ratio="16/9" label={prop.name} className="w-full h-full transition-opacity duration-400 group-hover:opacity-90" />
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3 gap-4">
                          <div>
                            <p className="nav-label mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                              {prop.type.toUpperCase()}
                            </p>
                            <h3
                              className="font-cormorant font-light"
                              style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--charcoal)' }}
                            >
                              {prop.name}
                            </h3>
                          </div>
                          <span
                            className="flex items-center gap-1.5 nav-label px-3 py-1 flex-shrink-0"
                            style={{
                              fontSize: '9px',
                              letterSpacing: '0.12em',
                              color: status.color,
                              border: `1px solid ${status.color}`,
                            }}
                          >
                            <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: status.color }} />
                            {status.label.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-light mb-4" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '13px' }}>
                          {prop.location} · {prop.area.toLocaleString('id-ID')} m²
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
                        <div>
                          <p className="nav-label mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                            HARGA AWAL
                          </p>
                          <p className="font-light" style={{ fontFamily: 'Jost', fontSize: '15px', color: 'var(--charcoal)' }}>
                            {formatRupiah(prop.startingPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="nav-label mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                            PENAWARAN TERTINGGI
                          </p>
                          <p className="font-light" style={{ fontFamily: 'Jost', fontSize: '15px', color: 'var(--indigo-brand)' }}>
                            {formatRupiah(prop.currentBid)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
