import React, { useState } from 'react';
import type { PropertyListing } from '../../data/properti';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { BRAND } from '../../config/brand';
import { Modal } from '../ui/Modal';
import { CheckCircle, MessageCircle, ArrowRight, Calendar, Users, DollarSign, Check } from 'lucide-react';

interface PropertyInquiryModalProps {
  property: PropertyListing | null;
  onClose: () => void;
}

export const PropertyInquiryModal: React.FC<PropertyInquiryModalProps> = ({ property, onClose }) => {
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

  if (!property) return null;

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
      isOpen={Boolean(property)}
      onClose={onClose}
      isDirty={isDirty}
      maxWidth="720px"
    >
      {confirmedId ? (
        <div className="text-center py-6 sm:py-8 space-y-6">
          <div className="w-14 h-14 bg-surface flex items-center justify-center mx-auto text-indigo border border-line" style={{ borderRadius: '2px' }}>
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

          <div className="p-4 bg-surface border border-line max-w-md mx-auto text-left text-xs font-sans space-y-1.5" style={{ borderRadius: '2px' }}>
            <div className="flex justify-between">
              <span className="text-muted">Properti:</span>
              <span className="text-charcoal font-medium">{property.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Nama:</span>
              <span className="text-charcoal font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Kontak WhatsApp:</span>
              <span className="text-charcoal font-medium">{whatsapp}</span>
            </div>
            {isRental ? (
              <div className="flex justify-between">
                <span className="text-muted">Periode & Tamu:</span>
                <span className="text-charcoal font-medium">{checkIn || 'TBD'} s/d {checkOut || 'TBD'} ({guests})</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-muted">Survei / Tawaran:</span>
                <span className="text-charcoal font-medium">{surveyDate || 'Segera'} · {offerAmount || property.priceFormatted}</span>
              </div>
            )}
          </div>

          <div className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.16em] font-sans transition-opacity inline-flex items-center justify-center gap-2 font-medium"
              style={{ borderRadius: '2px' }}
            >
              <MessageCircle size={16} className="stroke-[1.25]" />
              <span>Lanjut via WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-6 border border-line text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:bg-surface transition-colors inline-flex items-center justify-center gap-1.5"
              style={{ borderRadius: '2px' }}
            >
              <Check size={14} className="stroke-[1.5]" />
              <span>Selesai</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Eyebrow and Form Header */}
          <div className="mb-6 pr-10">
            <span className="label-editorial text-indigo block mb-1">
              {BRAND.wordmark} HOSPITALITY & LIVING
            </span>
            <h3 className="font-serif text-charcoal text-2xl sm:text-3xl font-light mb-1.5">
              {isRental ? `Reservasi: ${property.name}` : `Ajukan Penawaran / Survei: ${property.name}`}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
              {isRental
                ? `Format tarif acuan: ${property.priceFormatted}. Layanan concierge siap mengonfirmasi ketersediaan kamar.`
                : `Harga patokan: ${property.priceFormatted}. Tim representatif akan mengontak Anda untuk kunjungan fisik.`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama pemesan atau peminat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
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
                  className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                  style={{ borderRadius: '2px' }}
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
                      className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                      style={{ borderRadius: '2px' }}
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
                      className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                      style={{ borderRadius: '2px' }}
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
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                    style={{ borderRadius: '2px' }}
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
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                    style={{ borderRadius: '2px' }}
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
                    className="w-full px-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                    style={{ borderRadius: '2px' }}
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
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
            </div>

            <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border border-line text-xs uppercase tracking-wider text-muted hover:text-charcoal font-sans transition-colors order-2 sm:order-1"
                style={{ borderRadius: '2px' }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity flex items-center justify-center gap-2 font-medium order-1 sm:order-2"
                style={{ borderRadius: '2px' }}
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
