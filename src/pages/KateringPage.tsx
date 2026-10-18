import React, { useState } from 'react';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import type { KateringPackageItem, KateringDishItem } from '../data/katering';
import { KateringInquiryModal } from '../components/modals/KateringInquiryModal';
import { Modal } from '../components/ui/Modal';
import { BRAND } from '../config/brand';
import { ArrowRight, Check, Edit2 } from 'lucide-react';

export const KateringPage: React.FC = () => {
  const { packages, dishes, settings, isEditMode, updatePackage, updateDish } = useAdmin();

  const [selectedPackage, setSelectedPackage] = useState<KateringPackageItem | null>(null);
  const [selectedDish, setSelectedDish] = useState<KateringDishItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Edit states for admin
  const [editingPackage, setEditingPackage] = useState<KateringPackageItem | null>(null);
  const [editingDish, setEditingDish] = useState<KateringDishItem | null>(null);

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

  return (
    <div className="w-full bg-surface">
      {/* 1. Katering Hero with Caramel-Deep Accent */}
      <section className="relative w-full h-[65vh] min-h-[460px] max-h-[640px] bg-charcoal flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage
            slot="katering-hero"
            aspectRatio="custom"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="site-container relative z-10 text-white space-y-4">
          <span className="label-editorial text-white/90 block">
            {BRAND.name} Katering & Perjamuan Adat
          </span>
          <h1 className="font-display text-white max-w-3xl font-light">
            Cita Rasa Nusantara dalam Suasana Khidmat
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-lg font-sans font-light leading-relaxed">
            Menyajikan keagungan bumbu rempah autentik Minang dan Nusantara untuk perhelatan pernikahan, jamuan resmi korporasi, tumpeng syukuran, dan hantaran keluarga.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#paket"
              className="px-6 py-3 bg-white text-caramel-deep hover:bg-white/90 text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <span>Pilihan Paket Perjamuan</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </a>
            <a
              href="#menu"
              className="px-6 py-3 bg-transparent border border-white/60 text-white hover:bg-white hover:text-charcoal text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2"
              style={{ borderRadius: '2px' }}
            >
              <span>Daftar Menu Hidangan</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Three Main Packages (#paket) */}
      <section id="paket" className="section-padding site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-editorial text-caramel-deep block mb-1">
            Paket Perhelatan Pilihan
          </span>
          <h2 className="font-section-title text-charcoal">
            Tiga Konsep Layanan Jamuan
          </h2>
          <p className="text-muted text-sm mt-2">
            Disiapkan oleh koki berpengalaman dengan standar higienis tinggi dan bahan baku segar bergaransi halal.
          </p>
          <div className="w-12 h-[1px] bg-caramel-deep mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
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
                    {pkg.menuHighlights.slice(0, 4).map((h, i) => (
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
      </section>

      {/* 3. Dish Menu Grid (#menu) - 8 dishes with SmartImage, pax info, description */}
      <section id="menu" className="bg-white border-y border-line section-padding">
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
            {dishes.map((dish) => (
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
      </section>

      {/* 4. Cara Pemesanan (#cara-pesan) */}
      <section id="cara-pesan" className="section-padding site-container">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="label-editorial text-caramel-deep block mb-1">
            Panduan Reservasi
          </span>
          <h2 className="font-section-title text-charcoal">
            Empat Langkah Menuju Perjamuan Sempurna
          </h2>
          <div className="w-12 h-[1px] bg-caramel-deep mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">01</span>
            <h3 className="font-serif text-xl text-charcoal">Pilih Paket & Menu</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Tentukan paket resepsi, jamuan bento korporat, atau tumpeng sesuai tanggal dan perkiraan tamu.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">02</span>
            <h3 className="font-serif text-xl text-charcoal">Konsultasi & Test Food</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Tim perjamuan kami menyusun penawaran resmi dan menjadwalkan sesi cicip menu di galeri Senopati.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">03</span>
            <h3 className="font-serif text-xl text-charcoal">Konfirmasi & DP</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Penguncian tanggal acara dengan deposit resmi dan penandatanganan lembar kerja teknis tata meja.
            </p>
          </div>

          <div className="bg-white border border-line p-6 space-y-3">
            <span className="font-serif text-3xl text-caramel-deep block font-light">04</span>
            <h3 className="font-serif text-xl text-charcoal">Pelaksanaan Khidmat</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Tim pramusaji santun kami tiba 3 jam sebelum acara untuk penataan meja buffet dan layanan terbaik.
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
            Hubungi konsultan katering {BRAND.name} untuk mendiskusikan kebutuhan anggaran, tema dekorasi meja, atau pilihan menu alergen khusus.
          </p>
          <div className="pt-2">
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
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <KateringInquiryModal
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
