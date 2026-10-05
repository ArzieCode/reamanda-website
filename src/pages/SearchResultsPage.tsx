// ============================================================
// Page — Search Results (/cari?q=...)
// Multi-section search results with filtering and empty state
// ============================================================
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { searchAll } from '../services/search';
import type { SearchResultItem } from '../types/search';
import { useCurrency } from '../context/CurrencyContext';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'busana' | 'properti' | 'katering'>('all');
  const { format } = useCurrency();

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchAll(query).then((res) => {
      setResults(res);
      setLoading(false);
    });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter((r) => r.category === activeFilter);

  const busanaCount = results.filter((r) => r.category === 'busana').length;
  const propertiCount = results.filter((r) => r.category === 'properti').length;
  const kateringCount = results.filter((r) => r.category === 'katering').length;

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16 pb-28 md:pb-36">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          HASIL PENCARIAN
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal mb-6">
          {query ? `Hasil untuk "${query}"` : 'Cari Produk & Layanan'}
        </h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-0 border-b border-charcoal max-w-lg mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari busana, properti, atau katering..."
            className="flex-1 bg-transparent py-3 text-sm font-light outline-none text-charcoal"
            style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px' }}
          />
          <button
            type="submit"
            className="nav-label px-4 py-3 text-charcoal hover:opacity-60 transition-opacity flex items-center gap-1.5 focus-visible:outline-none"
            style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            aria-label="Cari sekarang"
          >
            <Search size={16} strokeWidth={1.5} />
            CARI
          </button>
        </form>
      </div>

      {/* Category Filter Tabs */}
      {results.length > 0 && (
        <div className="flex justify-center border-b border-line mb-10 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 sm:gap-6">
            <button
              onClick={() => setActiveFilter('all')}
              className="nav-label py-3 border-b-2 transition-all px-2 whitespace-nowrap focus-visible:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                borderColor: activeFilter === 'all' ? 'var(--charcoal)' : 'transparent',
                color: activeFilter === 'all' ? 'var(--charcoal)' : 'var(--muted)',
                fontWeight: activeFilter === 'all' ? 500 : 400,
              }}
            >
              SEMUA ({results.length})
            </button>
            <button
              onClick={() => setActiveFilter('busana')}
              className="nav-label py-3 border-b-2 transition-all px-2 whitespace-nowrap focus-visible:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                borderColor: activeFilter === 'busana' ? 'var(--charcoal)' : 'transparent',
                color: activeFilter === 'busana' ? 'var(--charcoal)' : 'var(--muted)',
                fontWeight: activeFilter === 'busana' ? 500 : 400,
              }}
            >
              BUSANA ({busanaCount})
            </button>
            <button
              onClick={() => setActiveFilter('properti')}
              className="nav-label py-3 border-b-2 transition-all px-2 whitespace-nowrap focus-visible:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                borderColor: activeFilter === 'properti' ? 'var(--charcoal)' : 'transparent',
                color: activeFilter === 'properti' ? 'var(--charcoal)' : 'var(--muted)',
                fontWeight: activeFilter === 'properti' ? 500 : 400,
              }}
            >
              PROPERTI ({propertiCount})
            </button>
            <button
              onClick={() => setActiveFilter('katering')}
              className="nav-label py-3 border-b-2 transition-all px-2 whitespace-nowrap focus-visible:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                borderColor: activeFilter === 'katering' ? 'var(--charcoal)' : 'transparent',
                color: activeFilter === 'katering' ? 'var(--charcoal)' : 'var(--muted)',
                fontWeight: activeFilter === 'katering' ? 500 : 400,
              }}
            >
              KATERING ({kateringCount})
            </button>
          </div>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="py-20 text-center text-muted font-light text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
          Mencari seluruh katalog dan arsip RiaMiranda...
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <p className="font-cormorant font-light text-2xl text-charcoal mb-3">
            Tidak Ada Hasil yang Cocok
          </p>
          <p className="text-sm font-light text-muted mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>
            Kami tidak menemukan hasil yang sesuai dengan kata kunci "{query}". Silakan periksa ejaan atau telusuri kategori berikut:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/busana"
              className="nav-label px-5 py-2.5 border border-line hover:border-charcoal transition-colors bg-surface"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              KATALOG BUSANA
            </Link>
            <Link
              to="/properti"
              className="nav-label px-5 py-2.5 border border-line hover:border-charcoal transition-colors bg-surface"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              LELANG PROPERTI
            </Link>
            <Link
              to="/katering"
              className="nav-label px-5 py-2.5 border border-line hover:border-charcoal transition-colors bg-surface"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              PAKET KATERING
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="p-5 border border-line bg-bg hover:border-charcoal transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="nav-label text-[9px] uppercase px-2 py-0.5"
                    style={{
                      letterSpacing: '0.14em',
                      backgroundColor: 'var(--surface)',
                      color: item.category === 'properti' ? 'var(--indigo-brand)' : 'var(--charcoal)',
                    }}
                  >
                    {item.category}
                  </span>
                  {item.price && (
                    <span className="font-light text-sm text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {format(item.price)}
                    </span>
                  )}
                </div>

                <h3 className="font-cormorant font-light text-xl text-charcoal group-hover:text-caramel-deep transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs font-light text-muted leading-relaxed line-clamp-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-line flex items-center justify-between text-xs text-charcoal font-light">
                <span className="nav-label text-[10px]" style={{ letterSpacing: '0.12em' }}>
                  LIHAT DETAIL
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
