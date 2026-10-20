import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { QuickViewModal } from '../components/busana/QuickViewModal';
import { KateringInquiryModal } from '../components/modals/KateringInquiryModal';
import type { BusanaProduct } from '../data/busana';
import type { KateringPackageItem } from '../data/katering';
import { BRAND } from '../config/brand';

export const HomePage: React.FC = () => {
  const { products, isEditMode } = useAdmin();

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<BusanaProduct | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<KateringPackageItem | null>(null);

  // Featured items
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full bg-surface">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[560px] max-h-[820px] bg-charcoal overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <SmartImage
            slot="hero"
            aspectRatio="custom"
            className="w-full h-full object-cover"
            priority
          />
          {/* Strict required overlay token */}
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="site-container relative z-10 text-white space-y-6">
          <div className="inline-flex items-center gap-2 border border-white/30 px-3.5 py-1 text-white text-[11px] uppercase tracking-[0.2em] font-sans">
            <Sparkles size={12} className="stroke-[1.25]" />
            BUSANA · KOST WANITA · KATERING
          </div>

          <h1 className="font-display text-white max-w-4xl font-light">
            Keanggunan Santun dalam Setiap Langkah Kehidupan
          </h1>

          <p className="text-white/90 text-base sm:text-lg max-w-xl font-sans font-light leading-relaxed">
            Menghadirkan busana muslimah kontemporer, kost eksklusif untuk wanita, serta hidangan perjamuan berselera.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/busana"
              className="px-8 py-3.5 bg-white text-charcoal hover:bg-caramel-deep hover:text-white text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <span>Jelajahi Busana</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>

            <Link
              to="/kost-wanita"
              className="px-8 py-3.5 bg-transparent border border-white/60 text-white hover:bg-white hover:text-charcoal text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2"
              style={{ borderRadius: '2px' }}
            >
              <span>Kost Eksklusif Wanita</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statement Band per spec */}
      <section className="bg-charcoal text-white py-6 border-y border-line text-center">
        <div className="site-container">
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] font-sans text-white/90 font-light">
            Tiga lini usaha, satu komitmen: kualitas yang dirawat dengan tulus.
          </p>
        </div>
      </section>

      {/* 2. Three Business Lines Feature Tiles */}
      <section className="section-padding site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-editorial text-muted block mb-2">Tiga Lini Usaha</span>
          <h2 className="font-section-title text-charcoal">
            Ekosistem Gaya Hidup Santun {BRAND.name}
          </h2>
          <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tile 1: Busana (Accent: charcoal) */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-charcoal transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden">
                <SmartImage
                  slot="tile-busana"
                  aspectRatio="4:3"
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="label-editorial text-charcoal block mb-1">Busana Muslimah</span>
              <h3 className="font-serif text-2xl text-charcoal font-light mb-3">
                Koleksi Busana Santun
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Rancangan busana muslimah berkarakter lembut dengan palet pastel hangat, serat alami ramah iklim tropis, dan bordir monogram songket kontemporer.
              </p>
            </div>
            <Link
              to="/busana"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-charcoal group-hover:text-caramel-deep border-t border-line pt-4 transition-colors font-medium"
            >
              <span>Buka Katalog Busana</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          {/* Tile 2: Kost Eksklusif Wanita */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-indigo transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden flex items-center justify-center">
                <img src="/d-rhea-syariah-logo.png" alt="Logo D’Rhea Syariah Guest House" className="w-full h-full object-contain p-3 sm:p-6" />
              </div>
              <span className="label-editorial text-indigo block mb-1">D’Rhea Syariah Guest House</span>
              <h3 className="font-serif text-charcoal text-2xl font-light mb-3">
                Kost Eksklusif Wanita
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Hunian khusus wanita dengan identitas D’Rhea Syariah Guest House. Informasi kamar dan tarif akan ditampilkan setelah dikonfirmasi pengelola.
              </p>
            </div>
            <Link
              to="/kost-wanita"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-indigo border-t border-line pt-4 transition-opacity font-medium"
            >
              <span>Kenali Kost Wanita</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          {/* Tile 3: Katering (Accent: caramel-deep) */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-caramel-deep transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden">
                <SmartImage
                  slot="tile-katering"
                  aspectRatio="4:3"
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="label-editorial text-caramel-deep block mb-1">Katering & Perjamuan</span>
              <h3 className="font-serif text-charcoal text-2xl font-light mb-3">
                Tata Meja Rasa Nusantara
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Sajian kuliner halal autentik resep turun-temurun untuk resepsi pernikahan agung, jamuan korporasi, tumpeng syukuran, dan hantaran keluarga.
              </p>
            </div>
            <Link
              to="/katering"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-caramel-deep border-t border-line pt-4 transition-colors font-medium"
            >
              <span>Pilihan Menu Perjamuan</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Busana Products */}
      <section className="bg-white border-y border-line section-padding">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="label-editorial text-muted block mb-2">Busana Terpilih</span>
              <h2 className="font-section-title text-charcoal">
                Koleksi Pilihan Musim Ini
              </h2>
            </div>
            <Link
              to="/busana"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:text-caramel-deep font-medium"
            >
              <span>Lihat Semua Busana ({products.length})</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const displayPrice = p.isSale && p.salePrice ? p.salePrice : p.price;
              return (
                <div
                  key={p.id}
                  className="group bg-surface border border-line p-3 flex flex-col justify-between cursor-pointer hover:border-charcoal transition-colors"
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-surface-2">
                    <SmartImage
                      slot={p.imageSlot1}
                      alt={p.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <SmartImage
                        slot={p.imageSlot2}
                        alt={`${p.name} tampak alternatif`}
                        aspectRatio="3:4"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {p.isSale && (
                      <span
                        className="absolute top-2 left-2 bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium z-10"
                        style={{ borderRadius: '9999px' }}
                      >
                        SALE
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="label-editorial text-muted text-[10px] block mb-1">
                      {p.category} · {p.collection}
                    </span>
                    <h3 className="font-serif text-charcoal text-base font-normal leading-tight mb-2 group-hover:text-caramel-deep transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-charcoal text-sm font-medium">
                        Rp {displayPrice.toLocaleString('id-ID')}
                      </span>
                      {p.isSale && p.salePrice && (
                        <span className="text-xs text-muted line-through font-sans">
                          Rp {p.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Tentang Rheamanda */}
      <section className="section-padding site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="border border-line p-2 bg-white">
              <SmartImage
                slot="about-portrait"
                alt={`Studio dan Ruang Karya ${BRAND.name}`}
                aspectRatio="3:4"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <span className="label-editorial text-muted block">Tentang {BRAND.name}</span>
              {isEditMode && (
                <span className="text-[11px] font-sans text-caramel-deep bg-caramel/10 border border-caramel/30 px-2 py-0.5" style={{ borderRadius: '2px' }}>
                  Konten contoh, edit dari mode admin
                </span>
              )}
            </div>

            <h2 className="font-section-title text-charcoal font-light leading-tight">
              Tiga lini usaha, satu komitmen: kualitas yang dirawat dengan tulus.
            </h2>

            <div className="w-16 h-[1px] bg-charcoal" />

            <p className="text-ink text-base leading-relaxed font-sans font-light">
              {BRAND.name} mendedikasikan karya pada kesantunan dan kenyamanan hidup. Melalui busana muslimah kontemporer, kami menghadirkan siluet anggun berbahan serat alami yang sejuk dan ramah untuk keseharian maupun perayaan.
            </p>

            <p className="text-muted text-sm leading-relaxed font-sans">
              Lini kost wanita menghadirkan D’Rhea Syariah Guest House sebagai pilihan hunian khusus wanita. Sementara layanan katering menyajikan hidangan perjamuan autentik untuk momen berharga Anda.
            </p>

            {/* Stats row: show only items that have a value; hide "Berdiri" when foundedYear is null */}
            <div className="pt-4 border-t border-line grid grid-cols-3 gap-6 text-left">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block">3</span>
                <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Lini Usaha</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block">100%</span>
                <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Bahan Pilihan</span>
              </div>
              {BRAND.foundedYear ? (
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-charcoal block">{BRAND.foundedYear}</span>
                  <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Berdiri</span>
                </div>
              ) : (
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-charcoal block">24/7</span>
                  <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Layanan Tamu</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kost Wanita Highlight */}
      <section className="bg-surface-2 border-t border-line section-padding">
        <div className="site-container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="space-y-5">
            <span className="label-editorial text-indigo block">D’Rhea Syariah Guest House</span>
            <h2 className="font-section-title text-charcoal">Kost Eksklusif Wanita</h2>
            <p className="text-ink text-base leading-relaxed">
              Kenali lini hunian khusus wanita dari {BRAND.name}. Detail kamar, tarif, dan lokasi
              akan dilengkapi setelah mendapatkan informasi resmi dari pengelola.
            </p>
            <Link to="/kost-wanita" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-indigo font-medium hover:underline">
              Lihat Halaman Kost <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <img src="/d-rhea-syariah-logo.png" alt="Logo D’Rhea Syariah Guest House" className="w-full max-w-[520px] h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <KateringInquiryModal
        isOpen={Boolean(selectedPackage)}
        initialPackage={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </div>
  );
};
