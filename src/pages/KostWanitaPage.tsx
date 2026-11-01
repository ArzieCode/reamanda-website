import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Bed, Bath, Maximize2, Check, Phone, Shield, Sparkles } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { EditableText } from '../components/cms/EditableText';
import { CardActionToolbar } from '../components/cms/CardActionToolbar';
import { propertyService } from '../services/properti';
import type { Property } from '../types/properti';
import { PropertyInquiryModal } from '../components/modals/PropertyInquiryModal';

export const KostWanitaPage: React.FC = () => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const [properties, setProperties] = useState<Property[]>(() => propertyService.getProperties());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const canEdit = isEditMode && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'tersedia':
        return <span className="bg-status-available text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Tersedia</span>;
      case 'terisi':
        return <span className="bg-status-occupied text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Terisi Penuh</span>;
      case 'perawatan':
        return <span className="bg-muted text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Dalam Perawatan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-surface">
      {/* 1. Header Hero */}
      <section className="site-container section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border border-indigo/30 bg-indigo/5 px-3 py-1 text-indigo text-[11px] uppercase tracking-[0.2em] font-sans">
            <Sparkles size={12} />
            <EditableText contentKey="kost.tag" defaultText={`Lini Hunian ${BRAND.name}`} />
          </div>

          <h1 className="font-display text-charcoal">
            <EditableText contentKey="kost.hero.title" defaultText="Kost Eksklusif Wanita" as="span" />
          </h1>

          <p className="text-ink text-base sm:text-lg leading-relaxed max-w-lg font-sans font-light">
            <EditableText
              contentKey="kost.hero.desc"
              defaultText="D’Rhea Syariah Guest House adalah nama tempat untuk lini kost eksklusif wanita Rea Manda. Hunian aman, nyaman, dan bernuansa syariah dengan fasilitas modern dan pengawasan 24 jam."
              as="span"
              multiline
            />
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#daftar-kamar"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-charcoal text-white text-xs uppercase tracking-[0.16em] font-sans hover:bg-indigo transition-colors rounded-[2px]"
            >
              Pilihan Kamar <ArrowDown size={15} />
            </a>
            <a
              href="#informasi-kost"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-line text-charcoal text-xs uppercase tracking-[0.16em] font-sans hover:border-charcoal transition-colors rounded-[2px]"
            >
              Tentang D’Rhea Syariah
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 bg-white border border-line rounded-[2px] shadow-sm">
          <img
            src="/d-rhea-syariah-logo.png"
            alt="Logo D’Rhea Syariah Guest House"
            className="w-full max-w-[460px] h-auto object-contain"
          />
        </div>
      </section>

      {/* 2. Room Listings Section */}
      <section id="daftar-kamar" className="bg-white border-y border-line section-padding scroll-mt-20">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="label-editorial text-indigo block mb-2">Tipe & Ketersediaan Kamar</span>
            <h2 className="font-section-title text-charcoal">
              <EditableText contentKey="kost.rooms.title" defaultText="Pilihan Kamar Kost & Guest House" as="span" />
            </h2>
            <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-surface border border-line overflow-hidden flex flex-col justify-between group hover:border-indigo transition-colors rounded-[2px] relative"
              >
                {canEdit && (
                  <CardActionToolbar
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isVisible={true}
                  />
                )}

                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      {getStatusBadge(prop.status)}
                    </div>
                    <div className="absolute top-3 right-3 z-10 bg-charcoal/80 text-white backdrop-blur-xs px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-[2px]">
                      {prop.type === 'kost' ? 'Kost Putri' : prop.type === 'guest_house' ? 'Guest House' : 'Homestay'}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-sans uppercase tracking-widest text-muted block mb-1">
                      {prop.location}
                    </span>
                    <h3 className="font-serif text-charcoal text-xl mb-2 font-normal">
                      {prop.name}
                    </h3>
                    <p className="text-xs text-muted font-sans leading-relaxed mb-4 line-clamp-2">
                      {prop.description}
                    </p>

                    {/* Room Attributes */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-line/60 text-xs font-sans text-ink mb-4">
                      <div className="flex items-center gap-1.5">
                        <Bed size={13} className="text-muted" />
                        <span>{prop.bedrooms || 1} Kamar</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath size={13} className="text-muted" />
                        <span>{prop.bathrooms || 1} KM Dalam</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 size={13} className="text-muted" />
                        <span>{prop.area ? `${prop.area} m²` : '3x4 m'}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1 mb-4 text-xs font-sans text-muted">
                      {prop.features?.slice(0, 3).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check size={12} className="text-status-available shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-line/60 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted block">Tarif</span>
                    <div className="font-serif text-charcoal text-lg font-medium">
                      {formatRupiah(prop.price || prop.startingPrice || 0)}
                      <span className="text-xs font-sans text-muted font-normal">/{prop.period === 'bulanan' ? 'bln' : 'malam'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProperty(prop)}
                    className="px-4 py-2 bg-charcoal text-white hover:bg-indigo text-xs uppercase tracking-wider font-sans transition-colors rounded-[2px]"
                  >
                    Konsultasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detail Info & Rules */}
      <section id="informasi-kost" className="section-padding site-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <div className="space-y-4">
            <span className="label-editorial text-indigo block">D’Rhea Syariah Guest House</span>
            <h2 className="font-section-title text-charcoal">
              <EditableText contentKey="kost.info.title" defaultText="Komitmen Keamanan & Kenyamanan Santun" as="span" />
            </h2>
            <div className="w-12 h-[1px] bg-charcoal" />
            <p className="text-ink text-base leading-relaxed font-sans font-light">
              <EditableText
                contentKey="kost.info.desc"
                defaultText="D’Rhea Syariah Guest House didesain khusus bagi mahasiswi dan karyawati muslimah yang mengutamakan ketenangan belajar dan beristirahat. Lingkungan asri, bebas asap rokok, dan dikelola secara amanah."
                as="span"
                multiline
              />
            </p>

            <div className="space-y-3 pt-2 font-sans text-sm">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-indigo shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-charcoal">Keamanan 24 Jam & CCTV</div>
                  <div className="text-xs text-muted">Akses gerbang kartu pintar dengan penjagaan keamanan terpadu.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-indigo shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-charcoal">Pengelola Siaga</div>
                  <div className="text-xs text-muted">Staf pengelola siap membantu perawatan fasilitas dan kebersihan umum harian.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-line bg-white p-6 sm:p-8 space-y-5 rounded-[2px] shadow-sm">
            <h3 className="font-serif text-charcoal text-2xl">
              <EditableText contentKey="kost.box.title" defaultText="Ketentuan & Tata Tertib Hunian" as="span" />
            </h3>
            <ul className="text-xs font-sans text-ink leading-relaxed space-y-2.5 list-disc pl-4">
              <li>Khusus putri (mahasiswi/karyawati dengan identitas KTP & kartu pengenal yang sah).</li>
              <li>Tamu pria dilarang masuk ke dalam kamar tidur; ruang tamu bersama disediakan di lantai dasar.</li>
              <li>Jam malam santun berlaku pukul 22.00 WIB untuk menjaga kenyamanan seluruh penghuni.</li>
              <li>Dilarang keras merokok, membawa hewan peliharaan, serta zat terlarang di seluruh area hunian.</li>
              <li>Setiap kamar dilengkapi meteran listrik token mandiri untuk fleksibilitas penghuni.</li>
            </ul>
            <div className="pt-4 border-t border-line text-xs text-muted font-sans flex items-center justify-between">
              <span>Konsultasi & Kunjungan:</span>
              <span className="font-medium text-charcoal">Senin – Sabtu, 08:00 – 17:00 WIB</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Link to Katering */}
      <section className="site-container py-16 text-center border-t border-line">
        <span className="label-editorial text-muted block mb-2">Jelajahi Ekosistem Santun</span>
        <Link to="/katering" className="inline-flex items-center gap-2 text-charcoal hover:text-indigo text-sm font-sans font-medium">
          Lihat Layanan Katering & Perjamuan <ArrowRight size={16} />
        </Link>
      </section>

      {/* Property Inquiry Modal */}
      <PropertyInquiryModal
        property={selectedProperty as any}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};
