// ============================================================
// Page — Kontak Kami (/kontak)
// Working form wired through sendInquiry service
// ============================================================
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { sendInquiry, WHATSAPP_NUMBER } from '../services/katering';
import { useToast } from '../context/ToastContext';

export default function KontakPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('busana');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Mohon lengkapi nama, email, dan pesan Anda.', 'error');
      return;
    }

    setSubmitting(true);
    await sendInquiry({
      nama: name,
      tanggalAcara: new Date().toISOString().split('T')[0],
      jumlahPorsi: 1,
      catatan: `[Kontak Website - Kategori: ${subject}] Email: ${email}, Telp: ${phone}. Pesan: ${message}`,
    });
    setSubmitting(false);
    setSubmitted(true);
    showToast('Pesan Anda berhasil terkirim. Tim kami akan segera merespons!', 'success');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          HUBUNGI KAMI
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Layanan Konsultasi & Informasi
        </h1>
        <p className="text-sm font-light text-muted mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          Kami selalu siap mendengarkan pertanyaan, saran, atau kebutuhan pesanan khusus Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="space-y-8 p-6 sm:p-8 bg-surface border border-line">
          <div>
            <p className="nav-label text-charcoal mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
              KANTOR PUSAT
            </p>
            <p className="flex items-start gap-2.5 text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
              <MapPin size={16} className="text-caramel-deep flex-shrink-0 mt-0.5" />
              Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190
            </p>
          </div>

          <div>
            <p className="nav-label text-charcoal mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
              TELEPON & WHATSAPP
            </p>
            <div className="space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              <p className="flex items-center gap-2.5">
                <Phone size={14} className="text-caramel-deep" /> (021) 7234-8899 (Hunting)
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle size={14} className="text-caramel-deep" /> +{WHATSAPP_NUMBER} (Chat Konsultan)
              </p>
            </div>
          </div>

          <div>
            <p className="nav-label text-charcoal mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
              EMAIL RESMI
            </p>
            <div className="space-y-1 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              <p className="flex items-center gap-2.5"><Mail size={14} className="text-caramel-deep" /> info@riamiranda.com</p>
              <p className="flex items-center gap-2.5"><Mail size={14} className="text-caramel-deep" /> cs@riamiranda.com</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 border border-line bg-bg">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <p className="font-cormorant font-light text-3xl text-charcoal">
                Terima Kasih Atas Pesan Anda
              </p>
              <p className="text-sm font-light text-muted max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                Pesan Anda telah kami terima dan diteruskan ke tim terkait. Konsultan kami akan menghubungi Anda melalui email atau WhatsApp dalam 1x24 jam kerja.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="nav-label min-h-[44px] px-6 py-3 border border-charcoal text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
                style={{ fontSize: '10px', letterSpacing: '0.14em' }}
              >
                KIRIM PESAN LAINNYA
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    NAMA LENGKAP *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    NOMOR TELEPON / WHATSAPP
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="input-underline min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    TOPIK KEBUTUHAN
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-underline min-h-[44px] bg-transparent"
                  >
                    <option value="busana">Koleksi Busana Muslimah</option>
                    <option value="properti">Lelang & Investasi Properti</option>
                    <option value="katering">Pemesanan & Menu Katering</option>
                    <option value="kemitraan">Kemitraan & Kerjasama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  PESAN ATAU PERTANYAAN ANDA *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan secara lengkap kebutuhan Anda..."
                  rows={5}
                  className="input-underline resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full nav-label min-h-[44px] py-4 text-white hover:opacity-85 transition-opacity disabled:opacity-50 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  backgroundColor: 'var(--charcoal)',
                }}
              >
                {submitting ? 'MENGIRIMKAN PESAN...' : 'KIRIMKAN PESAN KONSULTASI'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
