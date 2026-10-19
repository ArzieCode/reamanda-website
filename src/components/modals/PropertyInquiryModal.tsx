import React, { useState, useEffect } from 'react';
import type { PropertyListing } from '../../data/properti';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { BRAND } from '../../config/brand';
import { Modal } from '../ui/Modal';
import { CheckCircle, MessageCircle, ArrowRight, Calendar, Users, DollarSign, Check } from 'lucide-react';

export interface PropertyInquiryModalProps {
  property: PropertyListing | null;
  onClose: () => void;
  isOpen?: boolean;
}

export const PropertyInquiryModal: React.FC<PropertyInquiryModalProps> = ({
  property,
  onClose,
  isOpen: propIsOpen,
}) => {
  const { settings, addOrder } = useAdmin();
  const { showToast } = useOverlay();

  // Form states
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Tamu');
  const [surveyDate, setSurveyDate] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(property);

  useEffect(() => {
    if (!isOpen) {
      setConfirmedId(null);
    }
  }, [isOpen]);

  if (!property || !isOpen) return null;

  const isRental = property.priceType === 'sewa';

  const isDirty = Boolean(
    !confirmedId &&
      (name.trim().length > 0 ||
        whatsapp.trim().length > 0 ||
        checkIn.length > 0 ||
        checkOut.length > 0 ||
        surveyDate.length > 0 ||
        offerAmount.trim().length > 0 ||
        notes.trim().length > 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) {
      return;
    }

    const summary = isRental
      ? `Reservasi ${property.name} (${checkIn || 'TBD'} s/d ${checkOut || 'TBD'}, ${guests})`
      : `Survei/Penawaran ${property.name} (Tgl: ${surveyDate || 'Segera'}, Tawaran: ${offerAmount || property.priceFormatted})`;

    const newId = addOrder({
      type: 'properti',
      customerName: name.trim(),
      whatsapp: whatsapp.trim(),
      summary,
      totalAmountFormatted: isRental ? property.priceFormatted : (offerAmount || property.priceFormatted),
      itemsOrDetails: {
        propertyId: property.id,
        propertyName: property.name,
        propertyType: property.type,
        isRental,
        checkIn,
        checkOut,
        guests,
        surveyDate,
        offerAmount,
        notes,
      },
    });

    setConfirmedId(newId);
    showToast('Permintaan reservasi/survei properti berhasil dikirim.');
  };

  const getWhatsappMessage = () => {
    if (!confirmedId) return '';
    const text = isRental
      ? `Halo ${BRAND.name} Living, saya mengajukan permintaan reservasi:
ID Permintaan: ${confirmedId}
Properti: ${property.name} (${property.location})
Nama Tamu: ${name}
WhatsApp: ${whatsapp}
Check-in: ${checkIn || '-'}
Check-out: ${checkOut || '-'}
Jumlah Tamu: ${guests}
Catatan: ${notes || '-'}

Mohon informasi ketersediaan tanggal dan tata cara konfirmasi deposit. Terima kasih.`
      : `Halo ${BRAND.name} Living, saya mengajukan penawaran/survei properti:
ID Permintaan: ${confirmedId}
Properti: ${property.name} (${property.location})
Nama Peminat: ${name}
WhatsApp: ${whatsapp}
Rencana Survei: ${surveyDate || '-'}
Nilai Penawaran: ${offerAmount || property.priceFormatted}
Catatan Tambahan: ${notes || '-'}

Mohon konfirmasi jadwal temu dengan tim representatif ${BRAND.name}. Terima kasih.`;

    return encodeURIComponent(text);
  };

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${getWhatsappMessage()}`;

  return (
    <Modal
      id="property-inquiry-modal"
      isOpen={isOpen}
      onClose={onClose}
      isDirty={isDirty}
      maxWidth="720px"
    >
      {confirmedId ? (
        <div className="text-center py-6 sm:py-8 space-y-6">
          <div className="w-14 h-14 bg-surface flex items-center justify-center mx-auto text-indigo border border-line rounded-[2px]">
            <CheckCircle size={32} className="stroke-[1.25]" />
          </div>

          <div className="space-y-2">
            <span className="label-editorial text-indigo block">
              {isRental ? 'Permintaan Reservasi Terkirim' : 'Permintaan Survei & Penawaran Terkirim'}
            </span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light">
              {isRental ? 'Pengajuan Reservasi Diterima' : 'Penawaran Berhasil Disimpan'}
            </h3>
            <p className="text-sm text-ink max-w-md mx-auto font-sans leading-relaxed">
              Nomor referensi Anda adalah <strong className="font-semibold text-charcoal">{confirmedId}</strong>.
              Tim Hospitality {BRAND.name} akan segera memandu Anda.
            </p>
          </div>

          <div className="p-4 bg-surface border border-line max-w-md mx-auto text-left text-xs font-sans space-y-1.5 rounded-[2px]">
            <div className="flex justify-between">
              <span className="text-muted">Properti:</span>
              <span className="text-charcoal font-medium">{property.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tipe / Lokasi:</span>
              <span className="text-charcoal font-medium">{property.type} · {property.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Pemohon:</span>
              <span className="text-charcoal font-medium">{name} ({whatsapp})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Rincian:</span>
              <span className="text-indigo font-medium font-serif">
                {isRental ? `${checkIn || 'TBD'} s/d ${checkOut || 'TBD'}` : (offerAmount || property.priceFormatted)}
              </span>
            </div>
          </div>

          <div className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.16em] font-sans transition-opacity inline-flex items-center justify-center gap-2 font-medium rounded-[2px]"
            >
              <MessageCircle size={16} className="stroke-[1.25]" />
              <span>Konfirmasi via WhatsApp</span>
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
          {/* Header */}
          <div className="mb-6 pr-12">
            <span className="label-editorial text-indigo block mb-1">
              {BRAND.wordmark} LIVING & HOSPITALITY
            </span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light mb-1.5">
              {isRental ? 'Reservasi Akomodasi Santun' : 'Formulir Survei & Bidding Properti'}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
              {property.name} — {property.location} ({property.priceFormatted})
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nama Pemohon / Tamu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                />
              </div>
            </div>

            {isRental ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                      <Calendar size={12} />
                      Tanggal Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                      <Calendar size={12} />
                      Tanggal Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                    <Users size={12} />
                    Jumlah Tamu Dewasa & Anak
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                  >
                    <option value="1 Tamu">1 Tamu (Single Occupancy)</option>
                    <option value="2 Tamu">2 Tamu (Pasangan/Keluarga Inti)</option>
                    <option value="3-4 Tamu">3 - 4 Tamu (Suite Keluarga)</option>
                    <option value="Rombongan (>4)">Rombongan / Extended Stay</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                    <Calendar size={12} />
                    Rencana Tanggal Survei Lapangan
                  </label>
                  <input
                    type="date"
                    value={surveyDate}
                    onChange={(e) => setSurveyDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans flex items-center gap-1">
                    <DollarSign size={12} />
                    Nilai Penawaran (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder={`Patokan: ${property.priceFormatted}`}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Permintaan Khusus / Catatan
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Permintaan lantai rendah, akses kursi roda, atau waktu survei saat akhir pekan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white rounded-[2px]"
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
                className="w-full sm:w-auto px-8 py-3 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity flex items-center justify-center gap-2 font-medium order-1 sm:order-2 rounded-[2px]"
              >
                <span>{isRental ? 'Kirim Permintaan Reservasi' : 'Kirim Pengajuan Survei & Penawaran'}</span>
                <ArrowRight size={14} className="stroke-[1.25]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
