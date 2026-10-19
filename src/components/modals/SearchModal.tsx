import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Modal } from '../ui/Modal';
import { Search } from 'lucide-react';
import { SmartImage } from '../ui/SmartImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: any) => void;
  onSelectProperty?: (property: any) => void;
  onSelectPackage?: (pkg: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectProperty,
  onSelectPackage,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products, properties, packages, dishes } = useAdmin();

  const q = query.toLowerCase().trim();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    : [];

  const filteredProperties = q
    ? properties.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    : [];

  const filteredKatering = q
    ? [
        ...packages
          .filter((pkg) => pkg.name.toLowerCase().includes(q) || pkg.description.toLowerCase().includes(q))
          .map((p) => ({ ...p, isPkg: true })),
        ...dishes
          .filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
          .map((d) => ({ ...d, isPkg: false })),
      ]
    : [];

  const totalResults = filteredProducts.length + filteredProperties.length + filteredKatering.length;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Modal
      id="search-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="720px"
      hideHeader
    >
      <div className="space-y-5">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line pb-4 pt-1 pr-12">
          <Search size={22} className="text-muted stroke-[1.25] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari busana, properti, paket katering..."
            className="w-full text-base sm:text-lg font-sans text-charcoal focus:outline-none border-none p-0 bg-transparent placeholder:text-muted"
          />
        </div>

        {/* Quick Suggestions when query is empty */}
        {!q && (
          <div className="space-y-4 pt-1">
            <span className="label-editorial text-muted block">Pencarian Populer</span>
            <div className="flex flex-wrap gap-2">
              {['Hijab Voal', 'Abaya Nura', 'Boutique Hotel', 'Paket Pernikahan', 'Rendang Daging', 'Koleksi Senja'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-surface hover:bg-surface-2 border border-line text-xs font-sans text-ink transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            <div className="pt-4 border-t border-line grid grid-cols-3 gap-3 text-center">
              <button
                type="button"
                onClick={() => handleNavigate('/busana')}
                className="p-3 bg-surface hover:bg-surface-2 border border-line space-y-1 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <span className="label-editorial text-charcoal block text-[10px]">Lini 01</span>
                <span className="font-serif text-sm text-charcoal block">Busana Muslimah</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/properti')}
                className="p-3 bg-surface hover:bg-surface-2 border border-line space-y-1 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <span className="label-editorial text-indigo block text-[10px]">Lini 02</span>
                <span className="font-serif text-sm text-charcoal block">Hospitality & Living</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/katering')}
                className="p-3 bg-surface hover:bg-surface-2 border border-line space-y-1 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <span className="label-editorial text-caramel-deep block text-[10px]">Lini 03</span>
                <span className="font-serif text-sm text-charcoal block">Katering Perjamuan</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Container */}
        {q && (
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-muted font-sans border-b border-line pb-2">
              <span>Hasil Pencarian untuk "{query}"</span>
              <span>{totalResults} ditemukan</span>
            </div>

            {totalResults === 0 ? (
              <div className="py-10 text-center text-muted font-sans text-sm">
                Tidak ada hasil yang sesuai. Coba kata kunci lain atau telusuri berdasarkan lini usaha.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Products */}
                {filteredProducts.length > 0 && (
                  <div className="space-y-2">
                    <span className="label-editorial text-charcoal block text-[10px]">
                      Koleksi Busana ({filteredProducts.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(p);
                            else handleNavigate('/busana');
                          }}
                          className="flex items-center gap-3 p-2 bg-surface hover:bg-surface-2 border border-line cursor-pointer transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          <div className="w-12 h-16 shrink-0">
                            <SmartImage slot={p.imageSlot1} alt={p.name} aspectRatio="3:4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-serif text-sm text-charcoal truncate">{p.name}</h5>
                            <span className="text-[11px] text-muted block">{p.category} · {p.collection}</span>
                            <span className="text-xs font-serif text-charcoal font-medium">
                              Rp {p.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Properties */}
                {filteredProperties.length > 0 && (
                  <div className="space-y-2">
                    <span className="label-editorial text-indigo block text-[10px]">
                      Hospitality & Living ({filteredProperties.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredProperties.map((prop) => (
                        <div
                          key={prop.id}
                          onClick={() => {
                            if (onSelectProperty) onSelectProperty(prop);
                            else handleNavigate('/properti');
                          }}
                          className="flex items-center gap-3 p-2 bg-surface hover:bg-surface-2 border border-line cursor-pointer transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          <div className="w-14 h-14 shrink-0">
                            <SmartImage slot={prop.imageSlots[0]} alt={prop.name} aspectRatio="1:1" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-serif text-sm text-charcoal truncate">{prop.name}</h5>
                            <span className="text-[11px] text-muted block">{prop.type} · {prop.location}</span>
                            <span className="text-xs font-serif text-indigo font-medium">{prop.priceFormatted}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Katering */}
                {filteredKatering.length > 0 && (
                  <div className="space-y-2">
                    <span className="label-editorial text-caramel-deep block text-[10px]">
                      Katering & Menu ({filteredKatering.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredKatering.map((k: any) => (
                        <div
                          key={k.id}
                          onClick={() => {
                            if (onSelectPackage) onSelectPackage(k);
                            else handleNavigate('/katering');
                          }}
                          className="p-3 bg-surface hover:bg-surface-2 border border-line cursor-pointer transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          <div className="flex items-baseline justify-between">
                            <h5 className="font-serif text-sm text-charcoal truncate">{k.name}</h5>
                            <span className="text-xs text-caramel-deep font-serif font-medium">
                              {k.isPkg ? k.startingPrice : `Rp ${k.pricePerPax?.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{k.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
