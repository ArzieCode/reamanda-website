// ============================================================
// Busana Page (/busana)
// ============================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/busana/HeroCarousel';
import ProductCard from '../components/busana/ProductCard';
import Placeholder from '../components/ui/Placeholder';
import { getProducts } from '../services/busana';
import { collections } from '../data/busana';
import type { Product } from '../types/busana';
import { Star, Truck, RefreshCw, Award } from 'lucide-react';

const testimoni = [
  {
    quote: 'Bahan abayanya luar biasa lembut dan jatuhnya sempurna. Banyak yang menanyakan beli di mana setiap kali saya pakai ke acara.',
    name: 'Fauziah R.',
    city: 'Surabaya',
  },
  {
    quote: 'Saya sudah bertahun-tahun setia dengan RiaMiranda. Kualitasnya konsisten dan desainnya tidak pernah ketinggalan zaman.',
    name: 'Nadia K.',
    city: 'Makassar',
  },
];

const trustItems = [
  { icon: Truck, title: 'Gratis Ongkir', sub: 'Untuk pembelian di atas Rp 500.000' },
  { icon: RefreshCw, title: 'Retur & Tukar', sub: '14 hari mudah tanpa syarat rumit' },
  { icon: Award, title: 'Program Loyalitas', sub: 'Kumpulkan poin di setiap transaksi' },
];

export default function BusanaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <>
      {/* Edge-to-edge carousel */}
      <HeroCarousel />

      {/* PRODUK TERBARU section */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-8 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
          <h2
            className="font-cormorant font-light"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--charcoal)' }}
          >
            Produk Terbaru
          </h2>
          <Link
            to="/busana/koleksi/luminara"
            className="nav-label transition-opacity duration-400 hover:opacity-60"
            style={{ fontSize: '10px', color: 'var(--caramel-deep)', letterSpacing: '0.16em' }}
          >
            LIHAT SEMUA →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Placeholder key={i} ratio="3/4" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Belanja per Koleksi */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 md:pb-24">
        <p
          className="nav-label mb-8 text-center"
          style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}
        >
          BELANJA PER KOLEKSI
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {collections.concat({ id: 'sale', slug: 'sale', name: 'SALE', description: '' }).map((col) => (
            <Link
              key={col.slug}
              to={`/busana/koleksi/${col.slug}`}
              className="block group"
            >
              <div className="relative overflow-hidden">
                <Placeholder ratio="3/4" label={col.name} className="w-full transition-opacity duration-400 group-hover:opacity-80" />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ backgroundColor: col.id === 'sale' ? 'var(--sale)' : 'var(--charcoal)' }}
                >
                  <p className="nav-label text-white text-center" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                    {col.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="border-t" style={{ borderColor: 'var(--line)' }} />
      </div>

      {/* Testimoni */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <p
          className="nav-label text-center mb-12"
          style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}
        >
          CERITA WANITA RIAMIRANDA
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {testimoni.map((t, i) => (
            <div key={i} className="flex flex-col items-start">
              <div className="flex gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="var(--caramel)" color="var(--caramel)" strokeWidth={0} />
                ))}
              </div>
              <blockquote
                className="font-cormorant font-light mb-6 leading-relaxed"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--charcoal)', letterSpacing: '0.02em', fontStyle: 'italic' }}
              >
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: 'var(--surface)' }}
                />
                <div>
                  <p className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>
                    {t.name}
                  </p>
                  <p className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '11px' }}>
                    {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust row — with safe area padding bottom so floating elements never cover */}
      <section className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-28 md:pb-36 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-5 px-6 md:px-8 py-8" style={{ borderColor: 'var(--line)' }}>
                <item.icon size={22} strokeWidth={1.25} color="var(--caramel)" />
                <div>
                  <p className="nav-label mb-1" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.12em' }}>
                    {item.title}
                  </p>
                  <p className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '12px' }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
