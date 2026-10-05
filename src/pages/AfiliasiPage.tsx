// ============================================================
// Page — Program Afiliasi (/afiliasi)
// Affiliate partner program, commission structure, registration form
// ============================================================
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Award, Share2, DollarSign, CheckCircle } from 'lucide-react';

export default function AfiliasiPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !instagram) {
      showToast('Mohon lengkapi formulir pendaftaran afiliasi.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Pendaftaran program afiliasi berhasil dikirim! Tim kami akan meninjau akun Anda.', 'success');
  };

  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          KOLABORASI KREATIF
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-4 leading-tight">
          Program Afiliasi RiaMiranda
        </h1>
        <p className="text-sm font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
          Bagikan inspirasi gaya busana muslimah Anda dan raih komisi menarik dari setiap pembelian yang dilakukan melalui tautan rekomendasi Anda.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="border border-line p-6 bg-surface text-center">
          <Share2 size={24} color="var(--caramel-deep)" className="mx-auto mb-3" />
          <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px' }}>BAGIKAN TAUTAN</p>
          <p className="text-xs text-muted">Dapatkan tautan unik untuk busana dan koleksi pilihan Anda.</p>
        </div>
        <div className="border border-line p-6 bg-surface text-center">
          <DollarSign size={24} color="var(--caramel-deep)" className="mx-auto mb-3" />
          <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px' }}>KOMISI HINGGA 10%</p>
          <p className="text-xs text-muted">Penghasilan pasif dari setiap transaksi yang berhasil.</p>
        </div>
        <div className="border border-line p-6 bg-surface text-center">
          <Award size={24} color="var(--caramel-deep)" className="mx-auto mb-3" />
          <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px' }}>AKSES EKSKLUSIF</p>
          <p className="text-xs text-muted">Undangan ke peragaan busana & produk rilis awal.</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="border border-line p-6 sm:p-8 bg-bg">
        <h2 className="font-cormorant font-light text-2xl text-charcoal mb-6 pb-3 border-b border-line text-center">
          Formulir Pendaftaran Afiliasi
        </h2>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle size={36} color="var(--available)" className="mx-auto" />
            <p className="font-cormorant font-light text-2xl text-charcoal">
              Terima Kasih atas Minat Anda
            </p>
            <p className="text-xs text-muted font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
              Tim kemitraan kami akan meninjau profil media sosial Anda dan mengirimkan tautan dasbor afiliasi ke <strong>{email}</strong> dalam 1–2 hari kerja.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
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
              <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                ALAMAT EMAIL AKTIF *
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

            <div>
              <label className="nav-label block mb-1 text-[9px] text-muted" style={{ letterSpacing: '0.14em' }}>
                AKUN INSTAGRAM / TIKTOK *
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username_anda"
                className="input-underline min-h-[44px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full nav-label min-h-[44px] py-4 bg-charcoal text-white hover:opacity-85 transition-opacity mt-4 focus-visible:outline-none"
              style={{ fontSize: '11px', letterSpacing: '0.16em' }}
            >
              KIRIM PENDAFTARAN AFILIASI
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
