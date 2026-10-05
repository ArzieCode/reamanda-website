// ============================================================
// Modal — Jadwalkan Kunjungan Properti
// Booking form with date, time, contact, notes
// ============================================================
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import type { Property } from '../../types/properti';
import { schedulePropertyVisit } from '../../services/visit';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function ScheduleVisitModal({ isOpen, onClose, property }: ScheduleVisitModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone) setPhone(user.phone);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !visitDate || !visitTime) {
      showToast('Mohon lengkapi seluruh formulir yang diwajibkan.', 'error');
      return;
    }

    setSubmitting(true);
    const res = await schedulePropertyVisit({
      propertyId: property.id,
      propertyName: property.name,
      name,
      phone,
      email,
      visitDate,
      visitTime,
      notes,
    });
    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      showToast(res.message, 'success');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.5)' }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Jadwalkan Kunjungan ke ${property.name}`}
      >
        <div
          className="pointer-events-auto w-full max-w-lg bg-bg border border-line p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <p className="nav-label text-indigo-brand" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                SURVEI LOKASI LANGSUNG
              </p>
              <h2 className="font-cormorant font-light text-2xl text-charcoal">
                Jadwalkan Kunjungan
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup formulir kunjungan"
            >
              <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-surface border border-line text-xs font-light text-muted space-y-1" style={{ fontFamily: 'Jost, sans-serif' }}>
            <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>{property.name}</p>
            <p>{property.location} · {property.type}</p>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-surface border border-available text-available mx-auto flex items-center justify-center text-xl">
                ✓
              </div>
              <p className="font-cormorant font-light text-2xl text-charcoal">
                Jadwal Kunjungan Dikonfirmasi
              </p>
              <p className="text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                Konsultan properti kami akan menghubungi Anda melalui WhatsApp di nomor <strong>{phone}</strong> sebelum kunjungan pada <strong>{visitDate} pukul {visitTime} WIB</strong>.
              </p>
              <button
                onClick={onClose}
                className="nav-label px-6 py-3 bg-charcoal text-white hover:opacity-85 transition-opacity mt-4 focus-visible:outline-none"
                style={{ fontSize: '11px', letterSpacing: '0.14em' }}
              >
                SELESAI
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama calon pembeli"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    WHATSAPP / TELEPON *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-underline min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    TANGGAL KUNJUNGAN *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="input-underline min-h-[44px] pr-8"
                      required
                    />
                    <Calendar size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    WAKTU KUNJUNGAN *
                  </label>
                  <div className="relative">
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="input-underline min-h-[44px] pr-8 bg-transparent"
                      required
                    >
                      <option value="09:00">09:00 WIB (Pagi)</option>
                      <option value="10:30">10:30 WIB (Pagi)</option>
                      <option value="13:30">13:30 WIB (Siang)</option>
                      <option value="15:00">15:00 WIB (Sore)</option>
                      <option value="16:30">16:30 WIB (Sore)</option>
                    </select>
                    <Clock size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  CATATAN TAMBAHAN (OPSIONAL)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informasi pendamping, kendaraan survei, atau pertanyaan khusus..."
                  rows={3}
                  className="input-underline resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full nav-label min-h-[44px] py-4 text-white transition-opacity hover:opacity-85 disabled:opacity-50 mt-4 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  backgroundColor: 'var(--indigo-brand)',
                }}
              >
                {submitting ? 'MENGAJUKAN JADWAL...' : 'KONFIRMASI JADWAL SURVEI'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
