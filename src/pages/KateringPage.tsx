import React, { useState } from 'react';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import { INITIAL_KATERING_PACKAGES, INITIAL_KATERING_DISHES, type KateringPackageItem, type KateringDishItem } from '../data/katering';
import { KateringInquiryModal } from '../components/modals/KateringInquiryModal';
import { Modal } from '../components/ui/Modal';
import { BRAND } from '../config/brand';
import { ArrowRight, Check, Edit2 } from 'lucide-react';
import { ClientPhotoGallery } from '../components/ui/ClientPhotoGallery';
import { CateringPostCard } from '../components/ui/CateringPostCard';
import { clientGalleryService } from '../services/client-gallery';
import { contentService } from '../services/content';
import { useImageSrc } from '../hooks/useImageSrc';

export const KateringPage: React.FC = () => {
  const { packages, dishes, settings, isEditMode, updatePackage, updateDish } = useAdmin();

  const [selectedPackage, setSelectedPackage] = useState<KateringPackageItem | null>(null);
  const [selectedDish, setSelectedDish] = useState<KateringDishItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Edit states for admin
  const [editingPackage, setEditingPackage] = useState<KateringPackageItem | null>(null);
  const [editingDish, setEditingDish] = useState<KateringDishItem | null>(null);
  const [mealPhotos] = useState(() => clientGalleryService.getPhotos('lunchBox'));
  const [snackPhotos] = useState(() => clientGalleryService.getPhotos('snackBox'));
  const mealHeroSrc = useImageSrc(mealPhotos[0]?.src);
  const snackHeroSrc = useImageSrc(snackPhotos[0]?.src);
  const [posts] = useState(() => contentService.getSections('catering_post').filter((post) => post.isVisible));
  // Hide untouched mock packages and prices; preserve anything the admin edited.
  const publishedPackages = packages.filter((pkg) =>
    !INITIAL_KATERING_PACKAGES.some((sample) => sample.id === pkg.id && JSON.stringify(sample) === JSON.stringify(pkg))
  );
  const publishedDishes = dishes.filter((dish) =>
    !INITIAL_KATERING_DISHES.some((sample) => sample.id === dish.id && JSON.stringify(sample) === JSON.stringify(dish))
  );

  const handleEditPackageSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      updatePackage(editingPackage);
      setEditingPackage(null);
    }
  };

  const handleEditDishSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDish) {
      updateDish(editingDish);
      setEditingDish(null);
    }
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const directWaUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Halo ${BRAND.name} Katering, saya ingin berkonsultasi mengenai paket katering perjamuan.`
  )}`;
  const hasConfirmedWhatsapp = Boolean(settings.whatsappNumber && settings.whatsappNumber !== '6281234567890');

  return (
    <div className="w-full bg-surface">
      <section className="grid lg:grid-cols-[1.05fr_0.95fr] bg-charcoal text-white overflow-hidden">
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-10 sm:py-20 lg:py-24 editorial-enter">
          <img src="/catering-logo.png" alt="Logo Rheamanda Catering" className="w-36 sm:w-56 h-auto object-contain brightness-0 invert mb-5 sm:mb-8" />
          <span className="label-editorial text-[#DEC893]">Rheamanda Catering · Sajian untuk setiap momen</span>
          <h1 className="font-display !text-[clamp(3rem,5vw,5.25rem)] !text-white mt-5 sm:mt-7 mb-4 sm:mb-6 max-w-2xl">Sajian yang dekat dengan <em className="font-light text-[#E2CCA0]">momen Anda.</em></h1>
          <p className="text-white text-base sm:text-lg leading-relaxed max-w-xl">
            Nasi dan lunch box, snack box, serta kebutuhan acara yang dapat disesuaikan. Jelajahi dokumentasi sajian kami, lalu konsultasikan pilihan dan penawaran terkini dengan pengelola.
          </p>
          <div className="mt-6 sm:mt-9 flex flex-wrap gap-3">
            <a href="#paket" className="min-h-12 px-6 bg-[#E2CCA0] text-charcoal hover:bg-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
              Jelajahi layanan <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#foto-katering" className="min-h-12 px-6 border border-white/60 text-white hover:bg-white hover:text-charcoal text-sm inline-flex items-center transition-colors">
              Lihat galeri sajian
            </a>
          </div>
          <div className="mt-8 sm:mt-14 pt-4 sm:pt-5 border-t border-white/25 text-sm text-white/70">Pilihan menu, jumlah, dan harga dikonfirmasi langsung bersama pengelola.</div>
        </div>
        <div className="relative min-h-[340px] sm:min-h-[480px] lg:min-h-[640px] bg-surface-2">
          {mealHeroSrc ? (
            <SmartImage src={mealHeroSrc} alt={mealPhotos[0].alt} aspectRatio="custom" className="absolute inset-0 h-full" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center font-serif text-4xl text-charcoal">Sajian Rheamanda Catering</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal/70 to-transparent pointer-events-none" />
          {mealHeroSrc && <span className="absolute bottom-6 left-6 sm:left-10 label-editorial text-white drop-shadow-md">Dokumentasi sajian Rheamanda</span>}
        </div>
      </section>

      <section id="paket" className="section-padding site-container scroll-mt-20">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="label-editorial text-caramel-deep block mb-3">Pilih sesuai kebutuhan</span>
          <h2 className="font-section-title text-charcoal mb-4">Untuk pertemuan kecil hingga perayaan bersama.</h2>
          <p className="text-base text-muted">Galeri menampilkan dokumentasi sajian, bukan daftar paket dengan komposisi atau harga tetap. Pilih kategori untuk melihat ragam tampilannya.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {[
            { number: '01', title: 'Nasi & Lunch Box', description: 'Sajian praktis untuk rapat, perjalanan, dan acara.', href: '#nasi-box', image: mealHeroSrc, alt: mealPhotos[0]?.alt },
            { number: '02', title: 'Snack Box', description: 'Kudapan, buah, dan sajian pendamping untuk beragam kesempatan.', href: '#snack-box', image: snackHeroSrc, alt: snackPhotos[0]?.alt },
            { number: '03', title: 'Kebutuhan Acara', description: 'Konsultasikan sajian acara, pesanan banyak, dan pilihan frozen food.', href: '#cara-pesan', image: '', alt: '' },
          ].map((category) => (
            <a key={category.number} href={category.href} className="group min-w-0 bg-white border border-line hover:border-caramel-deep transition-colors flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-surface-2 relative">
                {category.image ? <img src={category.image} alt={category.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" /> : <div className="w-full h-full bg-charcoal flex items-center justify-center p-8"><img src="/catering-logo.png" alt="" className="max-w-44 max-h-32 object-contain brightness-0 invert" /></div>}
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <span className="label-editorial text-caramel-deep text-xs">{category.number} / Katering</span>
                <h3 className="font-serif text-3xl text-charcoal mt-3 mb-2">{category.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">{category.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-caramel-deep">Lihat selengkapnya <ArrowRight size={15} aria-hidden="true" /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="foto-katering" className="section-padding bg-white border-y border-line scroll-mt-20">
        <div className="site-container">
          <span className="label-editorial text-caramel-deep block mb-3">Dari dapur Rheamanda</span>
          <h2 className="font-section-title text-charcoal mb-4">Lihat sajian lebih dekat.</h2>
          <p className="text-base text-muted max-w-2xl mb-12">Dokumentasi asli dari klien, dikelompokkan menurut sajian yang tampak pada foto. Detail menu, ketersediaan, dan harga dapat dikonfirmasi saat konsultasi.</p>
          <div id="nasi-box" className="mb-14">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5 border-b border-line pb-4">
              <h3 className="font-serif text-charcoal text-3xl sm:text-4xl">Nasi & Lunch Box</h3>
              <span className="text-sm text-muted">Sajian lengkap · dokumentasi klien</span>
            </div>
            {mealPhotos.length > 0 ? <ClientPhotoGallery photos={mealPhotos} title="Foto Nasi dan Lunch Box" /> : <p className="text-muted">Foto dokumentasi belum tersedia. Konsultasikan pilihan nasi box dengan pengelola.</p>}
          </div>
          <div id="snack-box">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5 border-b border-line pb-4">
              <h3 className="font-serif text-charcoal text-3xl sm:text-4xl">Snack Box & Pendamping</h3>
              <span className="text-sm text-muted">Kudapan, buah, dan minuman</span>
            </div>
            {snackPhotos.length > 0 ? <ClientPhotoGallery photos={snackPhotos} title="Foto Snack Box dan Sajian Pendamping" /> : <p className="text-muted">Foto dokumentasi belum tersedia. Konsultasikan pilihan snack box dengan pengelola.</p>}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section id="postingan-katering" className="section-padding site-container">
          <span className="label-editorial text-caramel-deep block mb-2">Kabar & Cerita</span>
          <h2 className="font-section-title text-charcoal mb-10">Postingan Rheamanda Catering</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <CateringPostCard key={post.id} post={post} />)}
          </div>
        </section>
      )}


      {publishedPackages.length > 0 && <section id="penawaran" className="section-padding site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-editorial text-caramel-deep block mb-1">
            Paket Perhelatan Pilihan
          </span>
          <h2 className="font-section-title text-charcoal">
            Penawaran dari Pengelola
          </h2>
          <p className="text-muted text-sm mt-2">
            Konfirmasi isi paket, harga, dan ketersediaan sebelum memesan.
          </p>
          <div className="w-12 h-[1px] bg-caramel-deep mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {publishedPackages.map((pkg: any) => (
            <div
              key={pkg.id}
              className="bg-white border border-line p-6 flex flex-col justify-between hover:border-caramel-deep transition-colors relative group"
              style={{ borderRadius: '2px' }}
            >
              {/* Inline Admin Edit */}
              {isEditMode && (
                <button
                  onClick={() => setEditingPackage(pkg)}
                  className="absolute top-4 right-4 z-20 p-1.5 bg-indigo text-white hover:opacity-90"
                  style={{ borderRadius: '2px' }}
                  title="Edit data paket ini"
                >
                  <Edit2 size={13} />
                </button>
              )}

              <div>
                <div className="aspect-[16/9] overflow-hidden mb-6 bg-surface-2 border border-line">
                  <SmartImage
                    slot={pkg.imageSlot}
                    alt={pkg.name}
                    aspectRatio="16:9"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                <span className="label-editorial text-caramel-deep block mb-1">
                  {pkg.minOrder}
                </span>

                <h3 className="font-serif text-charcoal text-2xl font-light mb-2">
                  {pkg.name}
                </h3>

                <p className="text-xs text-muted font-sans leading-relaxed mb-4">
                  {pkg.description}
                </p>

                <div className="bg-surface p-3.5 border border-line mb-6 space-y-2">
                  <span className="label-editorial text-[10px] text-muted block">
                    Sorotan Menu Termasuk:
                  </span>
                  <ul className="space-y-1.5 text-xs font-sans text-ink">
                    {pkg.menuHighlights.slice(0, 4).map((h: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={13} className="text-caramel-deep shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-line pt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted font-sans uppercase tracking-wider">
                    Tarif Acuan:
                  </span>
                  <span className="font-serif text-caramel-deep text-lg font-medium">
                    {pkg.startingPrice}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setSelectedDish(null);
                    setInquiryModalOpen(true);
                  }}
                  className="w-full py-3 bg-caramel-deep text-white hover:bg-caramel text-xs uppercase tracking-[0.16em] font-sans transition-colors flex items-center justify-center gap-2"
                  style={{ borderRadius: '2px' }}
                >
                  <span>Pesan / Konsultasi Paket</span>
                  <ArrowRight size={13} className="stroke-[1.25]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {/* Explicitly edited menu entries only. */}
      {publishedDishes.length > 0 && <section id="menu" className="bg-white border-y border-line section-padding">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="label-editorial text-caramel-deep block mb-1">
                Koleksi Resep Warisan
              </span>
              <h2 className="font-section-title text-charcoal">
                Daftar Menu Hidangan Pilihan
              </h2>
              <p className="text-xs text-muted font-sans mt-1">
                Dapat dipesan per porsi satuan, bento box, atau pelengkap buffet
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPackage(null);
                setSelectedDish(null);
                setInquiryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-caramel-deep hover:underline font-medium"
            >
              <span>Konsultasikan Menu Kustom</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedDishes.map((dish: any) => (
              <div
                key={dish.id}
                className="bg-surface border border-line p-4 flex flex-col justify-between hover:border-caramel-deep transition-colors relative group"
                style={{ borderRadius: '2px' }}
              >
                {/* Admin edit button */}
                {isEditMode && (
                  <button
                    onClick={() => setEditingDish(dish)}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-indigo text-white hover:opacity-90"
                    style={{ borderRadius: '2px' }}
                    title="Edit menu ini"
                  >
                    <Edit2 size={12} />
                  </button>
                )}

                <div>
                  <div className="aspect-square overflow-hidden mb-4 bg-surface-2 border border-line">
                    <SmartImage
                      slot={dish.imageSlot}
                      alt={dish.name}
                      aspectRatio="1:1"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>

                  <span className="label-editorial text-muted text-[10px] block mb-1">
                    {dish.category} · {dish.paxInfo}
                  </span>

                  <h3 className="font-serif text-charcoal text-lg font-normal leading-tight mb-2">
                    {dish.name}
                  </h3>

                  <p className="text-xs text-ink font-sans leading-relaxed mb-4 line-clamp-3">
                    {dish.description}
                  </p>
                </div>

                <div className="border-t border-line pt-3 flex items-center justify-between">
                  <span className="font-serif text-charcoal text-base">
                    {formatRupiah(dish.pricePerPax)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDish(dish);
                      setSelectedPackage(null);
                      setInquiryModalOpen(true);
                    }}
                    className="text-xs uppercase tracking-wider font-sans text-caramel-deep hover:underline flex items-center gap-1"
                  >
                    <span>Pilih</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* 4. Cara Pemesanan (#cara-pesan) */}
      <section id="cara-pesan" className="section-padding site-container">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="label-editorial text-caramel-deep block mb-1">
            Panduan Reservasi
          </span>
          <h2 className="font-section-title text-charcoal">
            Rencanakan Sajian Sesuai Kebutuhan
          </h2>
          <div className="w-12 h-[1px] bg-caramel-deep mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">01</span>
            <h3 className="font-serif text-xl text-charcoal">Tentukan Kebutuhan</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Tentukan jenis sajian, tanggal, dan perkiraan jumlah tamu atau kotak.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">02</span>
            <h3 className="font-serif text-xl text-charcoal">Minta Katalog</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Rincian menu, jadwal, dan layanan untuk acara perlu dikonfirmasi langsung dengan pengelola.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">03</span>
            <h3 className="font-serif text-xl text-charcoal">Konfirmasi Penawaran</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Konfirmasi komposisi, jumlah, biaya, dan mekanisme pemesanan dengan pengelola.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">04</span>
            <h3 className="font-serif text-xl text-charcoal">Atur Pengantaran</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Diskusikan waktu serta lokasi pengantaran sesuai kebutuhan acara.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Kontak Khusus Katering (#kontak) */}
      <section id="kontak" className="bg-surface-2 border-t border-line py-16">
        <div className="site-container max-w-2xl text-center space-y-6">
          <span className="label-editorial text-caramel-deep block">Layanan Konsultasi Langsung</span>
          <h2 className="font-section-title text-charcoal">
            Rencanakan Perjamuan Anda Bersama Kami
          </h2>
          <p className="text-sm text-ink font-sans leading-relaxed">
            Informasi kontak resmi untuk konsultasi katering akan ditambahkan setelah dikonfirmasi oleh pengelola.
          </p>
          {hasConfirmedWhatsapp && <div className="pt-2">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-caramel-deep text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <span>Hubungi Konsultan via WhatsApp</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </a>
          </div>}
        </div>
      </section>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <KateringInquiryModal
          isOpen={inquiryModalOpen}
          initialPackage={selectedPackage}
          initialDish={selectedDish}
          onClose={() => {
            setInquiryModalOpen(false);
            setSelectedPackage(null);
            setSelectedDish(null);
          }}
        />
      )}

      {/* Admin Edit Package Modal */}
      {editingPackage && (
        <Modal
          id="admin-edit-package-modal"
          isOpen={Boolean(editingPackage)}
          onClose={() => setEditingPackage(null)}
          maxWidth="md"
          title={`Edit Paket Katering: ${editingPackage.name}`}
          eyebrow="Mode Administrator"
        >
          <form onSubmit={handleEditPackageSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Nama Paket</label>
              <input
                type="text"
                value={editingPackage.name}
                onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Tarif Acuan</label>
              <input
                type="text"
                value={editingPackage.startingPrice}
                onChange={(e) => setEditingPackage({ ...editingPackage, startingPrice: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Minimal Pemesanan</label>
              <input
                type="text"
                value={editingPackage.minOrder}
                onChange={(e) => setEditingPackage({ ...editingPackage, minOrder: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
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

      {/* Admin Edit Dish Modal */}
      {editingDish && (
        <Modal
          id="admin-edit-dish-modal"
          isOpen={Boolean(editingDish)}
          onClose={() => setEditingDish(null)}
          maxWidth="md"
          title={`Edit Menu Hidangan: ${editingDish.name}`}
          eyebrow="Mode Administrator"
        >
          <form onSubmit={handleEditDishSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Nama Menu</label>
              <input
                type="text"
                value={editingDish.name}
                onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Harga (Rp)</label>
              <input
                type="number"
                value={editingDish.pricePerPax}
                onChange={(e) => setEditingDish({ ...editingDish, pricePerPax: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block text-muted mb-1 uppercase tracking-wider">Keterangan Porsi</label>
              <input
                type="text"
                value={editingDish.paxInfo}
                onChange={(e) => setEditingDish({ ...editingDish, paxInfo: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingDish(null)}
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
