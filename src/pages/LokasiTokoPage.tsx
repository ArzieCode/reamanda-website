// ============================================================
// Page — Lokasi Toko (/lokasi-toko)
// Store locator with city filter, contact info, map placeholder
// ============================================================
import React, { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import Placeholder from '../components/ui/Placeholder';

interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
}

const STORES: StoreLocation[] = [
  {
    id: 's1',
    name: 'RiaMiranda Flagship Store Senopati',
    city: 'Jakarta',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190',
    phone: '(021) 7234-8899',
    hours: 'Setiap Hari: 10.00 – 21.00 WIB',
  },
  {
    id: 's2',
    name: 'RiaMiranda Pondok Indah Mall 2',
    city: 'Jakarta',
    address: 'PIM 2 Lantai 1, Unit 128, Jakarta Selatan 12310',
    phone: '(021) 7592-0881',
    hours: 'Setiap Hari: 10.00 – 22.00 WIB',
  },
  {
    id: 's3',
    name: 'RiaMiranda Boutique Bandung',
    city: 'Bandung',
    address: 'Jl. R.E. Martadinata (Riau) No. 78, Cihapit, Bandung 40114',
    phone: '(022) 4208-1122',
    hours: 'Setiap Hari: 09.00 – 20.00 WIB',
  },
  {
    id: 's4',
    name: 'RiaMiranda Gallery Surabaya',
    city: 'Surabaya',
    address: 'Jl. Raya Gubeng No. 32, Gubeng, Surabaya 60281',
    phone: '(031) 5032-4455',
    hours: 'Setiap Hari: 10.00 – 21.00 WIB',
  },
  {
    id: 's5',
    name: 'RiaMiranda Boutique Makassar',
    city: 'Makassar',
    address: 'Jl. Pengayoman No. 18, Panakkukang, Makassar 90231',
    phone: '(0411) 456-7890',
    hours: 'Setiap Hari: 09.30 – 20.30 WITA',
  },
];

const CITIES = ['Semua Kota', 'Jakarta', 'Bandung', 'Surabaya', 'Makassar'];

export default function LokasiTokoPage() {
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [activeStore, setActiveStore] = useState<StoreLocation>(STORES[0]);

  const filteredStores = selectedCity === 'Semua Kota'
    ? STORES
    : STORES.filter((s) => s.city === selectedCity);

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          TEMUKAN BUTIK KAMI
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Lokasi Butik & Galeri RiaMiranda
        </h1>
        <p className="text-sm font-light text-muted mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          Kunjungi butik resmi kami untuk merasakan langsung kelembutan kain dan kehangatan layanan konsultan busana kami.
        </p>
      </div>

      {/* City Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCity(c)}
            className="nav-label min-h-[44px] px-4 py-2 border transition-all focus-visible:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              borderColor: selectedCity === c ? 'var(--charcoal)' : 'var(--line)',
              backgroundColor: selectedCity === c ? 'var(--charcoal)' : 'transparent',
              color: selectedCity === c ? '#ffffff' : 'var(--muted)',
            }}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Stores List */}
        <div className="space-y-4">
          {filteredStores.map((store) => {
            const isSelected = activeStore.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => setActiveStore(store)}
                className="p-5 border cursor-pointer transition-all hover:border-charcoal bg-bg"
                style={{
                  borderColor: isSelected ? 'var(--charcoal)' : 'var(--line)',
                  borderLeftWidth: isSelected ? 4 : 1,
                }}
              >
                <p className="nav-label text-charcoal mb-2" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
                  {store.name}
                </p>
                <p className="text-xs text-muted font-light mb-3 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  {store.address}
                </p>
                <div className="space-y-1 text-xs text-ink font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-muted" /> {store.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={13} className="text-muted" /> {store.hours}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map / Preview Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-line overflow-hidden bg-surface relative aspect-[16/9] flex items-center justify-center">
            <Placeholder ratio="16/9" label={`Peta Lokasi: ${activeStore.name}`} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-bg/95 border border-line backdrop-blur-sm shadow-md">
              <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                {activeStore.name}
              </p>
              <p className="text-xs text-muted font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                {activeStore.address}
              </p>
            </div>
          </div>

          <div className="p-4 bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
              <MapPin size={16} color="var(--caramel-deep)" />
              <span>Petunjuk arah langsung terhubung dengan Google Maps & Waze</span>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeStore.name + ' ' + activeStore.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-label min-h-[44px] px-6 py-2.5 bg-charcoal text-white hover:opacity-85 transition-opacity inline-flex items-center"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              BUKA DI GOOGLE MAPS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
