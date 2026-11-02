import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Bed, Bath, Maximize2, Check } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { EditableText } from '../components/cms/EditableText';
import { propertyService } from '../services/properti';
import type { Property } from '../types/properti';
import { Modal } from '../components/ui/Modal';
import { useOverlay } from '../context/OverlayContext';
import { clientGalleryService, polishedClientPhotoSrc } from '../services/client-gallery';
import { ClientPhotoGallery } from '../components/ui/ClientPhotoGallery';

export const KostWanitaPage: React.FC = () => {
  const { properties, isVisitorPreview } = useAdmin();
  const { isStaff } = useAuth();
  const { showToast } = useOverlay();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [clientPhotos] = useState(() => clientGalleryService.getPhotos('kost'));
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  const visibleProperties = properties.filter((prop) => (isStaff && !isVisitorPreview) || prop.isPublished);

  const submitVisit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProperty || !visitorName.trim() || !visitorPhone.trim() || !visitDate || !visitTime) return;
    propertyService.requestVisit({
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      customerName: visitorName.trim(),
      customerPhone: visitorPhone.trim(),
      requestedDate: visitDate,
      requestedTime: visitTime,
    });
    setSelectedProperty(null);
    setVisitorName('');
    setVisitorPhone('');
    setVisitDate('');
    setVisitTime('');
    showToast('Permintaan kunjungan berhasil disimpan.');
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'tersedia':
        return <span className="bg-status-available text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Tersedia</span>;
      case 'terisi':
      case 'ditempati':
        return <span className="bg-status-occupied text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Terisi Penuh</span>;
      case 'dp':
        return <span className="bg-status-deposit text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Sudah DP</span>;
      case 'perawatan':
        return <span className="bg-muted text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Dalam Perawatan</span>;
      case 'belum_dikonfirmasi':
        return <span className="bg-charcoal/80 text-white px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-full">Ketersediaan dikonfirmasi</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-surface">
      {/* 1. Editorial hero with CMS copy */}
      <section className="site-container grid grid-cols-1 lg:grid-cols-2 border-b border-line">
        <div className="space-y-6 py-20 lg:py-28 lg:pr-16 editorial-enter">
          <span className="label-editorial text-indigo block"><EditableText contentKey="kost.tag" defaultText="Properti & Akomodasi Syariah" /></span>

          <div className="inline-flex items-center gap-3" aria-label="Logo D’Rhea Syariah Guest House">
            <img src="/d-rhea-syariah-mark.png" alt="" className="w-16 sm:w-20 h-auto object-contain" />
            <span className="font-serif text-charcoal text-xl sm:text-2xl leading-tight">
              D’Rhea Syariah <span className="block font-sans text-xs uppercase tracking-[0.18em] text-indigo mt-1">Guest House</span>
            </span>
          </div>

          <h1 className="font-display text-charcoal lg:!text-[clamp(3.5rem,5vw,5.5rem)]">
            <EditableText contentKey="kost.hero.title" defaultText="Hunian syariah khusus wanita." as="span" />
          </h1>

          <p className="text-ink text-base sm:text-lg leading-relaxed max-w-lg">
            <EditableText
              contentKey="kost.hero.desc"
              defaultText="Akomodasi Rheamanda Group di Jl. Jatipadang Utara No. 63, Pasar Minggu, Jakarta Selatan. Bangunan 3 lantai dengan 14 kamar, mengutamakan kenyamanan, keamanan, dan privasi penghuni wanita."
              as="span"
              multiline
            />
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="#foto-akomodasi"
              className="inline-flex min-h-11 items-center gap-2 border-b border-indigo text-indigo text-xs uppercase tracking-[0.16em] font-sans hover:opacity-70 transition-opacity"
            >
              Galeri Foto <ArrowDown size={15} />
            </a>
            <a
              href="#daftar-kamar"
              className="inline-flex min-h-11 items-center gap-2 border-b border-indigo text-indigo text-xs uppercase tracking-[0.16em] font-sans hover:opacity-70 transition-opacity"
            >
              Pilihan Kamar <ArrowDown size={15} />
            </a>
            <a
              href="#informasi-kost"
              className="inline-flex min-h-11 items-center gap-2 border-b border-indigo text-indigo text-xs uppercase tracking-[0.16em] font-sans hover:opacity-70 transition-opacity"
            >
              Informasi Kost
            </a>
          </div>
        </div>

        <div className="relative min-h-[330px] lg:min-h-[550px] overflow-hidden bg-indigo editorial-enter editorial-delay">
          <img
            src="/client-photos/polished/kost/kost-23.webp"
            alt="Kamar modern dengan jendela besar di akomodasi D’Rhea Syariah, dokumentasi klien"
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[24%_center]"
          />
        </div>
      </section>

      <section id="foto-akomodasi" className="section-padding bg-surface scroll-mt-20">
        <div className="site-container">
          <span className="label-editorial text-indigo block mb-2">Dokumentasi dari Klien</span>
          <h2 className="font-section-title text-charcoal mb-3">Foto Akomodasi</h2>
          <p className="text-sm text-muted max-w-2xl mb-10">
            Pilihan foto dari folder akomodasi yang dibagikan klien. Foto belum dikaitkan dengan tipe kamar atau ketersediaan tertentu.
          </p>
          <ClientPhotoGallery photos={clientPhotos} title="Foto Akomodasi" />
        </div>
      </section>

      {/* 2. Room Listings Section */}
      <section id="daftar-kamar" className="bg-white border-y border-line section-padding scroll-mt-20">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="label-editorial text-indigo block mb-2">Pilihan Kamar</span>
            <h2 className="font-section-title text-charcoal">
              <EditableText contentKey="kost.rooms.title" defaultText="Standard & Deluxe D’Rhea Syariah" as="span" />
            </h2>
            <p className="text-sm text-muted mt-4">Tarif mengacu pada profil terbaru dari klien; foto kamar merupakan dokumentasi akomodasi, bukan penanda tipe kamar tertentu. Ketersediaan dan harga akhir dikonfirmasi oleh pengelola.</p>
            <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-surface border border-line overflow-hidden flex flex-col justify-between group hover:border-indigo transition-colors rounded-[2px] relative"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                    <img
                      src={polishedClientPhotoSrc(prop.images[0] || '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      {getStatusBadge(prop.status)}
                    </div>
                    <div className="absolute top-3 right-3 z-10 bg-charcoal/80 text-white backdrop-blur-xs px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-wider rounded-[2px]">
                      {prop.type === 'kost' || prop.type === 'Kost Eksklusif' ? 'Kost Putri' : prop.type === 'guest_house' ? 'Guest House' : prop.type}
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
                        <span>{prop.bedrooms ?? '—'} Kamar</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath size={13} className="text-muted" />
                        <span>{prop.bathrooms ?? '—'} KM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 size={13} className="text-muted" />
                        <span>{prop.area ? `${prop.area} m²` : '—'}</span>
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
                      {formatRupiah(prop.price ?? prop.startingPrice)}
                      {prop.period && <span className="text-xs font-sans text-muted font-normal">/{prop.period === 'bulanan' ? 'bln' : prop.period === 'tahunan' ? 'tahun' : 'malam'}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProperty(prop)}
                    className="px-4 py-2 bg-charcoal text-white hover:bg-indigo text-xs uppercase tracking-wider font-sans transition-colors rounded-[2px]"
                  >
                    Ajukan Kunjungan
                  </button>
                </div>
              </div>
            ))}
          </div>
          {visibleProperties.length === 0 && (
            <p className="text-center text-sm text-muted font-sans">Informasi kamar resmi belum tersedia. Silakan kembali setelah pengelola mengonfirmasinya.</p>
          )}
        </div>
      </section>

      {/* 3. Identity and confirmed-information notice */}
      <section id="informasi-kost" className="bg-white border-y border-line section-padding scroll-mt-20">
        <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <div className="space-y-4">
            <span className="label-editorial text-indigo block">D’Rhea Syariah Guest House</span>
            <h2 className="font-section-title text-charcoal">
              <EditableText contentKey="kost.info.title" defaultText="Kenyamanan dan keamanan penghuni" as="span" />
            </h2>
            <p className="text-ink text-base leading-relaxed">
              <EditableText
                contentKey="kost.info.desc"
                defaultText="Unit akomodasi Rheamanda dirancang untuk menciptakan lingkungan yang tertata, aman, dan kondusif bagi penghuni wanita. Setiap detail fasilitas mencerminkan nilai-nilai syariah yang menjadi fondasi usaha ini."
                as="span"
                multiline
              />
            </p>
          </div>

          <div className="border border-line bg-surface p-6 sm:p-8 space-y-5">
            <h3 className="font-serif text-charcoal text-2xl">
              <EditableText contentKey="kost.box.title" defaultText="Informasi kamar" as="span" />
            </h3>
            <p className="text-sm text-ink leading-relaxed">Lokasi akomodasi: Jl. Jatipadang Utara No. 63, Pasar Minggu, Jakarta Selatan. Profil klien mencantumkan kamar Standard 3 × 3 m dan Deluxe 3 × 5 m, serta sewa harian mulai Rp300.000 per hari.</p>
            <p className="text-sm text-ink leading-relaxed">Fasilitas kamar: Kamar mandi dalam, Smart TV, queen bed, tempat pakaian, meja & kursi, water heater, internet, dan Listrik token (ditanggung penyewa). Fasilitas bersama: area komunal, reception area, rooftop barbecue, dan pantry lantai 2.</p>
            <div className="border-t border-line pt-5 text-sm text-ink">
              <span className="label-editorial text-indigo block mb-2">Info & Reservasi D’Rhea Syariah</span>
              <a className="block hover:text-indigo" href="tel:082208236988">0822 0823 6988</a>
              <a className="block hover:text-indigo" href="tel:087882572717">0878 8257 2717</a>
            </div>
            <p className="text-xs text-muted leading-relaxed border-t border-line pt-5">Permintaan kunjungan bukan konfirmasi kamar atau tarif.</p>
          </div>
        </div>
        </div>
      </section>

      {/* 4. Link to Katering */}
      <section className="site-container py-16 text-center border-t border-line">
        <span className="label-editorial text-muted block mb-2">Jelajahi Rheamanda</span>
        <Link to="/katering" className="inline-flex items-center gap-2 text-charcoal hover:text-indigo text-sm font-sans">
          Lihat layanan katering <ArrowRight size={16} />
        </Link>
      </section>

      <Modal id="kost-visit-modal" isOpen={Boolean(selectedProperty)} onClose={() => setSelectedProperty(null)} title="Ajukan Kunjungan Kamar" maxWidth="sm">
        <form onSubmit={submitVisit} className="space-y-4 text-sm font-sans">
          <p className="text-ink">{selectedProperty?.name} — jadwal dan ketersediaan menunggu konfirmasi pengelola.</p>
          <label className="block">Nama lengkap<input required value={visitorName} onChange={(event) => setVisitorName(event.target.value)} className="mt-1 w-full border border-line p-2" /></label>
          <label className="block">Nomor telepon<input required type="tel" value={visitorPhone} onChange={(event) => setVisitorPhone(event.target.value)} className="mt-1 w-full border border-line p-2" /></label>
          <label className="block">Tanggal kunjungan<input required type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} className="mt-1 w-full border border-line p-2" /></label>
          <label className="block">Waktu kunjungan<input required type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} className="mt-1 w-full border border-line p-2" /></label>
          <button type="submit" className="w-full bg-charcoal text-white px-4 py-3 text-xs uppercase tracking-wider hover:bg-indigo">Kirim Permintaan</button>
        </form>
      </Modal>
    </div>
  );
};
