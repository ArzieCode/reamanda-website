// ============================================================
// Modal — Global Search Overlay
// Instant multi-section results (Busana, Properti, Katering)
// Recent searches, keyboard navigation, Enter navigates to /cari?q=
// ============================================================
import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function SearchOverlay() {
  const {
    isOpen,
    toggleSearch,
    query,
    setQuery,
    results,
    loading,
    recentSearches,
    selectRecent,
    clearRecent,
  } = useSearch();

  const { format } = useCurrency();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSearch]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      toggleSearch(false);
      navigate(`/cari?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectResult = (path: string) => {
    toggleSearch(false);
    navigate(path);
  };

  const busanaResults = results.filter((r) => r.category === 'busana');
  const propertiResults = results.filter((r) => r.category === 'properti');
  const kateringResults = results.filter((r) => r.category === 'katering');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[65] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.6)' }}
        onClick={() => toggleSearch(false)}
        aria-hidden
      />

      {/* Full-width Search Panel */}
      <div
        className="fixed top-0 left-0 right-0 z-[65] bg-bg border-b border-line shadow-lg max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian Global"
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-6 pb-4">
          {/* Input Header */}
          <div className="flex items-center gap-4 border-b border-charcoal pb-3">
            <Search size={22} strokeWidth={1.5} color="var(--charcoal)" className="flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari busana, properti, atau paket katering..."
              className="flex-1 bg-transparent border-none outline-none font-cormorant font-light text-xl sm:text-2xl text-charcoal placeholder:text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:opacity-60 text-muted focus-visible:outline-none"
                aria-label="Hapus kata kunci"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={() => toggleSearch(false)}
              className="p-2 -mr-2 hover:opacity-60 text-charcoal focus-visible:outline-none flex items-center gap-1 nav-label"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
              aria-label="Tutup pencarian"
            >
              TUTUP
              <X size={18} strokeWidth={1.25} />
            </button>
          </div>

          {/* Recent searches chips (when input is empty) */}
          {!query && (
            <div className="py-6">
              <div className="flex items-center justify-between mb-3">
                <p className="nav-label text-muted" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                  PENCARIAN TERAKHIR
                </p>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecent}
                    className="nav-label text-xs text-muted hover:text-charcoal focus-visible:outline-none"
                    style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                  >
                    HAPUS SEMUA
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => selectRecent(s)}
                    className="flex items-center gap-1.5 nav-label px-3.5 py-2 border border-line hover:border-charcoal transition-colors bg-surface focus-visible:outline-none"
                    style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--charcoal)' }}
                  >
                    <Clock size={12} strokeWidth={1.25} color="var(--muted)" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        {query && (
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 w-full overflow-y-auto flex-1 pb-8">
            {loading ? (
              <div className="py-12 text-center text-muted font-light text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                Mencari produk dan layanan...
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-cormorant font-light text-2xl text-charcoal mb-2">
                  Tidak Ditemukan Hasil untuk "{query}"
                </p>
                <p className="text-sm font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Coba gunakan kata kunci lain seperti "Luminara", "Scarves", "Vila", atau "Nasi Box".
                </p>
              </div>
            ) : (
              <div className="space-y-8 pt-4">
                {/* 1. Busana Results */}
                {busanaResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                      <p className="nav-label text-charcoal font-medium" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                        BUSANA MUSLIMAH ({busanaResults.length})
                      </p>
                      <Link
                        to={`/busana`}
                        onClick={() => toggleSearch(false)}
                        className="nav-label text-xs text-caramel hover:opacity-70 flex items-center gap-1"
                        style={{ fontSize: '10px' }}
                      >
                        Lihat Katalog <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {busanaResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item.path)}
                          className="flex items-center gap-4 p-3 border border-line hover:border-charcoal cursor-pointer transition-colors bg-surface"
                        >
                          <div className="w-12 h-16 bg-line flex-shrink-0 flex items-center justify-center text-[9px] text-muted uppercase">
                            {item.title.substring(0, 3)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="nav-label text-charcoal truncate" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted font-light truncate" style={{ fontFamily: 'Jost, sans-serif' }}>
                              {item.subtitle}
                            </p>
                            {item.price && (
                              <p className="text-xs text-charcoal font-medium mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                                {format(item.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Properti Results */}
                {propertiResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                      <p className="nav-label text-charcoal font-medium" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                        PROPERTI & HOTEL ({propertiResults.length})
                      </p>
                      <Link
                        to={`/properti`}
                        onClick={() => toggleSearch(false)}
                        className="nav-label text-xs text-indigo-brand hover:opacity-70 flex items-center gap-1"
                        style={{ fontSize: '10px' }}
                      >
                        Lihat Listing <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {propertiResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item.path)}
                          className="flex items-center gap-4 p-3 border border-line hover:border-charcoal cursor-pointer transition-colors bg-surface"
                        >
                          <div className="w-16 h-12 bg-line flex-shrink-0 flex items-center justify-center text-[9px] text-muted uppercase">
                            {item.title.substring(0, 4)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="nav-label text-charcoal truncate" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted font-light truncate" style={{ fontFamily: 'Jost, sans-serif' }}>
                              {item.subtitle}
                            </p>
                            {item.price && (
                              <p className="text-xs text-indigo-brand font-medium mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                                {format(item.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Katering Results */}
                {kateringResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                      <p className="nav-label text-charcoal font-medium" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
                        KATERING ({kateringResults.length})
                      </p>
                      <Link
                        to={`/katering`}
                        onClick={() => toggleSearch(false)}
                        className="nav-label text-xs text-caramel hover:opacity-70 flex items-center gap-1"
                        style={{ fontSize: '10px' }}
                      >
                        Lihat Menu <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {kateringResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item.path)}
                          className="p-4 border border-line hover:border-charcoal cursor-pointer transition-colors bg-surface"
                        >
                          <p className="nav-label text-charcoal" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
                            {item.title}
                          </p>
                          <p className="text-xs text-muted font-light mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                            {item.subtitle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View all on search results page */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => {
                      toggleSearch(false);
                      navigate(`/cari?q=${encodeURIComponent(query)}`);
                    }}
                    className="nav-label px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all focus-visible:outline-none"
                    style={{ fontSize: '11px', letterSpacing: '0.16em' }}
                  >
                    LIHAT SEMUA HASIL UNTUK "{query.toUpperCase()}" →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
