import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { BRAND } from '../../config/brand';
import type { KateringPackageItem, KateringDishItem } from '../../data/katering';
import { Modal } from '../ui/Modal';
import { CheckCircle, MessageCircle, ArrowRight, Calendar, Users, MapPin, Utensils, Check } from 'lucide-react';

export interface KateringInquiryModalProps {
  isOpen: boolean;
  initialPackage?: KateringPackageItem | null;
  initialDish?: KateringDishItem | null;
  onClose: () => void;
}

export const KateringInquiryModal: React.FC<KateringInquiryModalProps> = ({
  isOpen,
  initialPackage,
  initialDish,
  onClose,
}) => {
  const { settings, addOrder, packages } = useAdmin();
  const { showToast } = useOverlay();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [paxCount, setPaxCount] = useState('100 Pax');
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    initialPackage ? initialPackage.id : packages[0]?.id || 'custom'
  );
  const [customMenuNotes, setCustomMenuNotes] = useState(
    initialDish ? `Ingin menambahkan menu: ${initialDish.name} (${initialDish.paxInfo})` : ''
  );
  const [location, setLocation] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  // Update initial selections if props change
  useEffect(() => {
    if (initialPackage) {
      setSelectedPkgId(initialPackage.id);
    } else if (packages[0]) {
      setSelectedPkgId(packages[0].id);
    }
    if (initialDish) {
      setCustomMenuNotes(`Ingin menambahkan menu: ${initialDish.name} (${initialDish.paxInfo})`);
    }
  }, [initialPackage, initialDish, packages]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmedId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultNotes = initialDish
    ? `Ingin menambahkan menu: ${initialDish.name} (${initialDish.paxInfo})`
    : '';

  const isDirty = Boolean(
    !confirmedId &&
      (name.trim().length > 0 ||
        whatsapp.trim().length > 0 ||
        location.trim().length > 0 ||
        eventDate.length > 0 ||
        (customMenuNotes.trim().length > 0 && customMenuNotes !== defaultNotes))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !location.trim()) {
      return;
    }

    const pkg = packages.find((p) => p.id === selectedPkgId);
    const packageName = pkg ? pkg.name : 'Pilihan Kustom Menu';
    const summary = `${packageName} (${paxCount}, Tanggal: ${eventDate || 'Menyesuaikan'}, Lokasi: ${location})`;

    const newId = addOrder({
      type: 'katering',
      customerName: name.trim(),
      whatsapp: whatsapp.trim(),
      summary,
      totalAmountFormatted: pkg ? pkg.startingPrice : 'Estimasi Kustom',
      itemsOrDetails: {
        packageId: selectedPkgId,
        packageName,
        eventDate,
        paxCount,
        location,
        customMenuNotes,
      },
    });

    setConfirmedId(newId);
    showToast('Permintaan katering berhasil dikirim.');
  };

  const getWhatsappMessage = () => {
    if (!confirmedId) return '';
    const pkg = packages.find((p) => p.id === selectedPkgId);
    const text = `Halo ${BRAND.name} Katering & Perjamuan, saya mengajukan permintaan katering:
ID Permintaan: ${confirmedId}
Nama: ${name}
WhatsApp: ${whatsapp}
Paket/Menu: ${pkg ? pkg.name : 'Menu Kustom'}
Jumlah Porsi: ${paxCount}
Tanggal Acara: ${eventDate || 'Belum pasti'}
Lokasi Acara: ${location}
Catatan Menu/Kebutuhan Khusus: ${customMenuNotes || '-'}

Mohon informasi penawaran resmi, ketersediaan jadwal, dan prosedur test food. Terima kasih.`;

    return encodeURIComponent(text);
  };

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${getWhatsappMessage()}`;

  return (
    <Modal
      id="katering-inquiry-modal"
      isOpen={isOpen}
      onClose={onClose}
      isDirty={isDirty}
      maxWidth="720px"
    >
      {confirmedId ? (
        <div className="text-center py-6 sm:py-8 space-y-6">
          <div className="w-14 h-14 bg-surface flex items-center justify-center mx-auto text-caramel-deep border border-line rounded-[2px]">
            <CheckCircle size={32} className="stroke-[1.25]" />
          </div>

          <div className="space-y-2">
            <span className="label-editorial text-muted block">Permintaan Diterima</span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
              Permintaan Katering Dicatat
            </h3>
            <p className="text-sm text-ink max-w-md mx-auto font-sans leading-relaxed">
              Nomor referensi Anda adalah <strong className="font-semibold text-charcoal">{confirmedId}</strong>.
              Tim Tata Perjamuan {BRAND.name} siap menyusun menu istimewa untuk hari bahagia Anda.
            </p>
          </div>

          <div className="p-4 bg-surface border border-line max-w-md mx-auto text-left text-xs font-sans space-y-1.5 rounded-[2px]">
            <div className="flex justify-between">
              <span className="text-muted">Nama:</span>
              <span className="text-charcoal font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">WhatsApp:</span>
              <span className="text-charcoal font-medium">{whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Porsi / Tanggal:</span>
              <span className="text-charcoal font-medium">{paxCount} · {eventDate || 'Menyesuaikan'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Lokasi Acara:</span>
              <span className="text-charcoal font-medium">{location}</span>
            </div>
          </div>

          <div className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-caramel-deep text-white hover:opacity-90 text-xs uppercase tracking-[0.16em] font-sans transition-opacity inline-flex items-center justify-center gap-2 font-medium rounded-[2px]"
            >
              <MessageCircle size={16} className="stroke-[1.25]" />
              <span>Hubungi via WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-6 border border-line text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:bg-surface transition-colors inline-flex items-center justify-center gap-1.5 rounded-[2px]"
            >
              <Check size={14} className="stroke-[1.5]" />
              <span>Selesai</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Eyebrow and Form Header */}
          <div className="mb-6 pr-12">
            <span className="label-editorial text-caramel-deep block mb-1">
              {BRAND.wordmark} KATERING
            </span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light mb-1.5">
              Formulir Permintaan Katering
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
              Konsultasi menu pernikahan, jamuan korporasi, syukuran aqiqah, dan hantaran keluarga.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid 2 cols on >= 640px, 1 col below */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nama Penyelenggara *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda atau Perusahaan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                  <Utensils size={12} />
                  Pilihan Paket Katering
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.startingPrice})
                    </option>
                  ))}
                  <option value="custom">Pilihan Kustom / Menu Khusus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                  <Users size={12} />
                  Estimasi Jumlah Porsi / Pax
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 300 Pax / 50 Box"
                  value={paxCount}
                  onChange={(e) => setPaxCount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                  <Calendar size={12} />
                  Tanggal Acara
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                  <MapPin size={12} />
                  Lokasi / Gedung Acara *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung Arsip, Jakarta Barat"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Preferensi Menu Tambahan / Catatan Khusus
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Ingin menambahkan stall Kambing Guling & Es Doger, atau menu ramah lansia"
                value={customMenuNotes}
                onChange={(e) => setCustomMenuNotes(e.target.value)}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-caramel-deep focus:outline-none bg-white rounded-[2px]"
              />
            </div>

            {/* Sticky Actions bar inside panel on mobile */}
            <div className="sticky bottom-0 bg-white border-t border-line pt-3 pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:pt-4 sm:border-t sm:static z-20 flex flex-col sm:flex-row items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border border-line text-xs uppercase tracking-wider text-muted hover:text-charcoal font-sans transition-colors order-2 sm:order-1 rounded-[2px]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-caramel-deep text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity flex items-center justify-center gap-2 font-medium order-1 sm:order-2 rounded-[2px]"
              >
                <span>Kirim Permintaan Katering</span>
                <ArrowRight size={14} className="stroke-[1.25]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
