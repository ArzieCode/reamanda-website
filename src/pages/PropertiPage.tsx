import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import type { PropertyListing, PropertyStatusType } from '../data/properti';
import { PropertyInquiryModal } from '../components/modals/PropertyInquiryModal';
import { Modal } from '../components/ui/Modal';
import { BRAND } from '../config/brand';
import { ArrowRight, MapPin, Edit2 } from 'lucide-react';

export const PropertiPage: React.FC = () => {
  const { properties, isEditMode, updateProperty } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);

  // Active filter category: 'Semua' | 'Hotel' | 'Rumah' | 'Ruko' | 'Tanah'
  const activeCategory = searchParams.get('kategori') || 'Semua';
  const categories = ['Semua', 'Hotel', 'Rumah', 'Ruko', 'Tanah'];

  const filteredProperties = useMemo(() => {
    if (activeCategory === 'Semua') return properties;
    return properties.filter((p) => p.type === activeCategory);
  }, [properties, activeCategory]);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      updateProperty(editingProperty);
      setEditingProperty(null);
    }
  };

  const getStatusBadgeClass = (status: PropertyStatusType) => {
    switch (status) {
      case 'Tersedia':
        return 'bg-status-available text-white';
      case 'Sudah DP':
        return 'bg-status-deposit text-white';
      case 'Sudah Ditempati':
        return 'bg-status-occupied text-white';
      default:
        return 'bg-muted text-white';
    }
  };

  return (
    <div className="w-full bg-sand">
      {/* 1. Properti Hero with Indigo Accent */}
      <section className="relative w-full h-[65vh] min-h-[460px] max-h-[640px] bg-charcoal flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage
            slot="properti-hero"
            aspectRatio="custom"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-overlay-indigo" />
        </div>

        <div className="site-container relative z-10 text-white space-y-4">
          <span className="label-editorial text-white/90 block">
            {BRAND.name} Living & Hospitality
          </span>
          <h1 className="font-display text-white max-w-3xl font-light">
            Ruang Teduh Berarsitektur Santun
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-lg font-sans font-light leading-relaxed">
            Menghadirkan peristirahatan boutique hotel berkonsep privat, hunian arsitektural keluarga di kawasan prestisius, serta properti komersial bernilai investasi tinggi.
          </p>
          <div className="pt-2">
            <a
              href="#listing"
              className="px-6 py-3 bg-white text-indigo hover:bg-white/90 text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <span>Lihat Properti Pilihan</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Philosophy & Value Proposition */}
      <section className="py-16 site-container border-b border-line bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-4 space-y-2">
            <span className="label-editorial text-indigo block">01. Privasi Terjaga</span>
            <h3 className="font-serif text-charcoal text-xl">Harmoni Ruang Keluarga</h3>
            <p className="text-muted text-sm leading-relaxed">
              Tata ruang arsitektur dirancang khusus untuk kenyamanan keluarga muslimah tanpa kompromi privasi.
            </p>
          </div>
          <div className="p-4 space-y-2 border-y md:border-y-0 md:border-x border-line">
            <span className="label-editorial text-indigo block">02. Lokasi Strategis</span>
            <h3 className="font-serif text-charcoal text-xl">Pusat Budaya & Bisnis</h3>
            <p className="text-muted text-sm leading-relaxed">
              Terletak di kawasan utama seperti Dharmawangsa, Kemang, Senopati, hingga keindahan lembah Ubud.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <span className="label-editorial text-indigo block">03. Nilai Berkelanjutan</span>
            <h3 className="font-serif text-charcoal text-xl">Legalitas Pasti & Aman</h3>
            <p className="text-muted text-sm leading-relaxed">
              Seluruh aset memiliki sertifikat hak milik resmi, izin pariwisata lengkap, dan pengelolaan profesional.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Listings Section Header & Category Filters */}
      <section id="listing" className="section-padding site-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-line">
          <div>
            <span className="label-editorial text-indigo block mb-1">
              Koleksi Properti & Akomodasi
            </span>
            <h2 className="font-section-title text-charcoal">
              Aset Properti Pilihan
            </h2>
            <p className="text-xs text-muted font-sans mt-1">
              Menampilkan {filteredProperties.length} unit akomodasi dan properti investasi
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'Semua') {
                      setSearchParams({});
                    } else {
                      setSearchParams({ kategori: cat });
                    }
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans whitespace-nowrap border transition-colors ${
                    isActive
                      ? 'bg-indigo text-white border-indigo font-medium'
                      : 'bg-white text-ink border-line hover:border-indigo'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Listing Grid (6 properties with 3 images each & badges) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-line p-5 flex flex-col justify-between hover:border-indigo transition-colors relative group"
              style={{ borderRadius: '2px' }}
            >
              {/* Inline Admin Edit trigger */}
              {isEditMode && (
                <button
                  onClick={() => setEditingProperty(prop)}
                  className="absolute top-3 right-3 z-20 p-1.5 bg-indigo text-white hover:opacity-90"
                  style={{ borderRadius: '2px' }}
                  title="Edit data properti ini"
                >
                  <Edit2 size={13} />
                </button>
              )}

              <div>
                {/* Main Image with Status Badge */}
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-surface-2">
                  <SmartImage
                    slot={prop.imageSlots[0]}
                    alt={prop.name}
                    aspectRatio="4:3"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-2 left-2 px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-normal z-10 ${getStatusBadgeClass(
                      prop.status
                    )}`}
                    style={{ borderRadius: '2px' }}
                  >
                    {prop.status}
                  </span>
                </div>

                {/* 2 Small Gallery Thumbnails for the 3-image manifest requirement */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="aspect-[16/9] overflow-hidden bg-surface-2 border border-line">
                    <SmartImage
                      slot={prop.imageSlots[1]}
                      alt={`${prop.name} tampilan 2`}
                      aspectRatio="16:9"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[16/9] overflow-hidden bg-surface-2 border border-line">
                    <SmartImage
                      slot={prop.imageSlots[2]}
                      alt={`${prop.name} tampilan 3`}
                      aspectRatio="16:9"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Property Meta */}
                <div className="flex items-center justify-between text-xs font-sans text-muted mb-1">
                  <span className="uppercase tracking-wider font-medium text-indigo">
                    {prop.type}
                  </span>
                  <span>{prop.landArea}</span>
                </div>

                <h3 className="font-serif text-charcoal text-xl sm:text-2xl font-light mb-1 leading-snug">
                  {prop.name}
                </h3>

                <p className="text-xs text-muted font-sans flex items-center gap-1 mb-3">
                  <MapPin size={12} className="stroke-[1.25]" />
                  <span>{prop.location}</span>
                </p>

                <p className="text-xs text-ink font-sans leading-relaxed mb-4 line-clamp-3">
                  {prop.description}
                </p>

                {/* Specs / Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {prop.highlights.slice(0, 2).map((hl, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-surface text-ink text-[11px] font-sans border border-line"
                    >
                      {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="border-t border-line pt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted font-sans">
                    {prop.priceType === 'sewa' ? 'Tarif Inap:' : 'Harga Properti:'}
                  </span>
                  <span className="font-serif text-indigo text-lg font-medium">
                    {prop.priceFormatted}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="w-full py-2.5 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.16em] font-sans transition-opacity flex items-center justify-center gap-2"
                  style={{ borderRadius: '2px' }}
                >
                  <span>
                    {prop.priceType === 'sewa' ? 'Reservasi Akomodasi' : 'Ajukan Penawaran & Survei'}
                  </span>
                  <ArrowRight size={13} className="stroke-[1.25]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry / Booking Modal */}
      <PropertyInquiryModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Admin Inline Edit Modal */}
      {editingProperty && (
        <Modal
          id="admin-edit-property-modal"
          isOpen={Boolean(editingProperty)}
          onClose={() => setEditingProperty(null)}
          maxWidth="md"
          title={`Edit Properti: ${editingProperty.name}`}
          eyebrow="Mode Administrator"
        >
          <form onSubmit={handleEditSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Nama Properti</label>
              <input
                type="text"
                value={editingProperty.name}
                onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>

            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Status Ketersediaan</label>
              <select
                value={editingProperty.status}
                onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-line text-sm bg-white text-ink focus:border-indigo focus:outline-none"
                style={{ borderRadius: '2px' }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sudah DP">Sudah DP</option>
                <option value="Sudah Ditempati">Sudah Ditempati</option>
              </select>
            </div>

            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Format Tarif / Harga</label>
              <input
                type="text"
                value={editingProperty.priceFormatted}
                onChange={(e) => setEditingProperty({ ...editingProperty, priceFormatted: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 border border-line text-muted hover:text-charcoal transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo text-white uppercase tracking-wider transition-opacity hover:opacity-90 font-medium"
                style={{ borderRadius: '2px' }}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
