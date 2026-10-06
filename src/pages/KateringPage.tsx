// ============================================================
// Katering Page (/katering)
// Package cards open detail modal, WhatsApp CTA, Inquiry form with validation, FAQ accordion
// ============================================================
import React, { useState } from 'react';
import Placeholder from '../components/ui/Placeholder';
import { packages, faqs, menuItems, type CateringPackage } from '../data/katering';
import { sendInquiry, type InquiryData, WHATSAPP_NUMBER } from '../services/katering';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { ChevronDown, Star, MessageCircle, Eye } from 'lucide-react';
import PackageDetailModal from '../components/modals/PackageDetailModal';

const testimoni = [
  {
    quote: 'Pernikahan putri kami berjalan begitu khidmat dan seluruh tamu memuji hidangan prasmanannya. Rasa rendang dan sup kimlonya autentik.',
    name: 'Ibu Ratna Dewi',
    city: 'Jakarta Selatan',
    event: 'Resepsi Pernikahan (800 porsi)',
  },
  {
    quote: 'Penyajian tumpeng mini untuk syukuran kantor sangat rapi dan estetik. Kemasannya mewah, tidak mengecewakan.',
    name: 'Bapak Hendra W.',
    city: 'Tangerang Selatan',
    event: 'Syukuran Kantor (120 porsi)',
  },
  {
    quote: 'Pelayanan konsultan katering RiaMiranda sangat teliti dan sigap saat koordinasi di hari H. Terima kasih banyak!',
    name: 'Sarah & Fikri',
    city: 'Bandung',
    event: 'Akad Nikah & Intimate Dinner',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left transition-opacity duration-400 hover:opacity-75 focus-visible:outline-none"
      >
        <span className="font-light text-charcoal text-sm sm:text-base" style={{ fontFamily: 'Jost' }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.25}
          color="var(--caramel-deep)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease', flexShrink: 0, marginLeft: 16 }}
        />
      </button>
      {open && (
        <p className="pb-5 font-light leading-relaxed text-muted text-xs sm:text-sm" style={{ fontFamily: 'Jost', lineHeight: 1.85 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function KateringPage() {
  const { format } = useCurrency();
  const { showToast } = useToast();

  const [form, setForm] = useState<InquiryData>({ nama: '', tanggalAcara: '', jumlahPorsi: 0, catatan: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Selected package detail modal state
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'jumlahPorsi' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.tanggalAcara || !form.jumlahPorsi) {
      setFormError('Mohon lengkapi seluruh kolom wajib yang bertanda bintang (*).');
      return;
    }
    setFormError('');
    setSubmitting(true);
    await sendInquiry(form);
    setSubmitting(false);
    setSubmitted(true);
    showToast('Formulir konsultasi Anda berhasil terkirim!', 'success');
  };

  const handleSelectPackageForInquiry = (pkg: CateringPackage) => {
    setForm((prev) => ({
      ...prev,
      jumlahPorsi: prev.jumlahPorsi || pkg.minOrder,
      catatan: `Tertarik dengan ${pkg.name}. ${prev.catatan || ''}`.trim(),
    }));
    // Smooth scroll down to inquiry section
    document.getElementById('inquiry-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Paket "${pkg.name}" telah dipilih dalam formulir.`, 'info');
  };

  return (
    <>
      {/* Hero with editorial dark gradient overlay */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: 'clamp(520px, 80svh, 860px)' }}
      >
        <div className="absolute inset-0 w-full h-full">
          <Placeholder ratio="16/9" dark={true} label="Katering RiaMiranda" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-500"
          style={{
            background: 'var(--color-hero-overlay)',
          }}
        >
          <p className="nav-label mb-4 select-none" style={{ fontSize: '11px', letterSpacing: '0.24em', color: 'var(--caramel-deep)' }}>
            KATERING RIAMIRANDA
          </p>
          <h1
            className="font-cormorant font-light mb-8 max-w-3xl leading-snug drop-shadow-sm text-[#F7F4EE]"
            style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.25rem)', letterSpacing: '0.04em' }}
          >
            Cita Rasa Terbaik untuk Setiap Momen Istimewa
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo RiaMiranda Katering, saya ingin konsultasi kebutuhan acara.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              <MessageCircle size={16} />
              KONSULTASI VIA WHATSAPP
            </a>
            <button
              onClick={() => document.getElementById('inquiry-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hero-secondary"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              ISI FORM KONSULTASI
            </button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-screen-lg mx-auto px-5 sm:px-8 py-16 md:py-24 text-center">
        <p
          className="font-light leading-relaxed max-w-2xl mx-auto text-ink"
          style={{ fontFamily: 'Jost', fontSize: '16px', lineHeight: 2 }}
        >
          RiaMiranda Katering hadir untuk merayakan momen penting Anda bersama orang-orang tercinta.
          Dengan resep warisan nusantara dan bahan-bahan segar pilihan bersertifikasi halal, kami menghadirkan kehangatan sajian dalam skala perjamuan profesional.
        </p>
      </section>

      {/* Paket Unggulan — Clicking opens detail modal */}
      <section className="border-t border-line">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
          <p className="nav-label text-center mb-16 text-muted" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            PAKET UNGGULAN PERJAMUAN
          </p>

          <div className="space-y-8">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                onClick={() => setSelectedPackage(pkg)}
                className="grid grid-cols-1 md:grid-cols-2 border border-line bg-bg hover:border-charcoal transition-colors cursor-pointer group shadow-xs"
              >
                <div
                  className={`py-10 px-6 sm:px-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-line ${i % 2 !== 0 ? 'md:order-2' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="nav-label text-caramel-deep text-[10px]" style={{ letterSpacing: '0.18em' }}>
                        PAKET {String(i + 1).padStart(2, '0')}
                      </p>
                      <span className="flex items-center gap-1 nav-label text-muted text-[10px] group-hover:text-charcoal transition-colors">
                        <Eye size={13} />
                        LIHAT DETAIL
                      </span>
                    </div>

                    <h3 className="font-cormorant font-light mb-3 text-charcoal group-hover:text-caramel-deep transition-colors" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
                      {pkg.name}
                    </h3>
                    <p className="font-light mb-6 leading-relaxed text-muted text-sm" style={{ fontFamily: 'Jost', lineHeight: 1.8 }}>
                      {pkg.description}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2">
                      <span className="font-light text-caramel-deep text-2xl" style={{ fontFamily: 'Jost' }}>
                        mulai {format(pkg.price)}
                      </span>
                      <span className="font-light text-muted text-sm" style={{ fontFamily: 'Jost' }}>
                        /{pkg.unit}
                      </span>
                    </div>
                    <p className="nav-label text-muted text-[9px]" style={{ letterSpacing: '0.12em' }}>
                      Minimal Pemesanan: {pkg.minOrder} {pkg.minUnit}
                    </p>
                  </div>
                </div>

                <div className={`py-10 px-6 sm:px-10 flex flex-col justify-center bg-surface ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                  <p className="nav-label mb-5 text-charcoal text-[10px]" style={{ letterSpacing: '0.16em' }}>
                    MENU & FASILITAS TERMASUK
                  </p>
                  <ul className="space-y-3">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span style={{ color: 'var(--caramel-deep)', marginTop: 2, flexShrink: 0 }}>—</span>
                        <span className="font-light text-ink text-sm" style={{ fontFamily: 'Jost', fontSize: '14px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 mt-6 border-t border-line flex items-center justify-between">
                    <span className="nav-label text-[10px] text-caramel-deep group-hover:underline">
                      KLIK UNTUK KONSULTASI PAKET INI →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Gallery — masonry-style */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <p className="nav-label text-center mb-10 text-muted" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          GALERI HIDANGAN PERJAMUAN
        </p>
        <div className="columns-2 md:columns-3 gap-4 space-y-0">
          {menuItems.map((item) => (
            <div key={item.name} className="break-inside-avoid mb-4">
              <Placeholder ratio={item.ratio} label={item.name} className="w-full" />
              <p className="nav-label mt-2 text-center text-muted" style={{ fontSize: '10px', letterSpacing: '0.14em' }}>
                {item.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section className="bg-surface border-t border-b border-line">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
          <p className="nav-label text-center mb-12 text-muted" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            KATA PELANGGAN KAMI
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimoni.map((t, i) => (
              <div key={i} className="flex flex-col bg-bg p-8 border border-line">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill="var(--caramel)" color="var(--caramel)" strokeWidth={0} />
                  ))}
                </div>
                <blockquote
                  className="font-cormorant font-light mb-6 flex-1 leading-relaxed text-charcoal italic"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                >
                  "{t.quote}"
                </blockquote>
                <div>
                  <p className="nav-label text-charcoal text-[10px]" style={{ letterSpacing: '0.14em' }}>{t.name}</p>
                  <p className="text-xs font-light text-muted mt-0.5" style={{ fontFamily: 'Jost', fontSize: '11px' }}>
                    {t.city} · {t.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-screen-lg mx-auto px-5 sm:px-8 py-16 md:py-24">
        <p className="nav-label text-center mb-12 text-muted" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          PERTANYAAN UMUM SEPUTAR KATERING
        </p>
        <div className="border-t border-line">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-section" className="border-t border-line bg-surface">
        <div className="max-w-screen-md mx-auto px-5 sm:px-8 pt-16 md:pt-24 pb-28 md:pb-36">
          <p className="nav-label text-center mb-4 text-caramel-deep" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            FORMULIR KONSULTASI
          </p>
          <h2 className="font-cormorant font-light text-center mb-12 text-charcoal" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
            Ceritakan Kebutuhan Acara Anda
          </h2>

          {submitted ? (
            <div className="text-center py-12 border border-line bg-bg p-8">
              <p className="font-cormorant font-light text-2xl mb-4 text-caramel-deep">
                Terima Kasih, {form.nama}!
              </p>
              <p className="font-light text-ink text-sm mb-6" style={{ fontFamily: 'Jost', fontSize: '15px' }}>
                Formulir konsultasi Anda telah terkirim ke tim jamuan kami. Kami akan menghubungi Anda untuk rincian penawaran dan jadwal uji rasa (*food tasting*).
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ nama: '', tanggalAcara: '', jumlahPorsi: 0, catatan: '' });
                }}
                className="nav-label px-6 py-2.5 border border-charcoal text-charcoal hover:bg-surface text-xs"
              >
                KIRIM PERMINTAAN LAIN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 border border-line bg-bg p-6 sm:p-10 shadow-xs">
              <div>
                <label className="nav-label block mb-2 text-muted text-[9px]" style={{ letterSpacing: '0.14em' }}>
                  NAMA LENGKAP PENYELENGGARA *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="nav-label block mb-2 text-muted text-[9px]" style={{ letterSpacing: '0.14em' }}>
                    TANGGAL PELAKSANAAN ACARA *
                  </label>
                  <input
                    type="date"
                    name="tanggalAcara"
                    value={form.tanggalAcara}
                    onChange={handleChange}
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="nav-label block mb-2 text-muted text-[9px]" style={{ letterSpacing: '0.14em' }}>
                    ESTIMASI JUMLAH PORSI / TAMU *
                  </label>
                  <input
                    type="number"
                    name="jumlahPorsi"
                    value={form.jumlahPorsi || ''}
                    onChange={handleChange}
                    placeholder="Contoh: 150"
                    min={1}
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="nav-label block mb-2 text-muted text-[9px]" style={{ letterSpacing: '0.14em' }}>
                  CATATAN TAMBAHAN ATAU MENU PILIHAN
                </label>
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleChange}
                  placeholder="Ceritakan jenis acara (resepsi, akad, aqiqah, rapat kantor), preferensi hidangan, atau lokasi acara..."
                  rows={4}
                  className="input-underline resize-none"
                />
              </div>

              {formError && (
                <p className="text-sm font-light text-occupied" style={{ fontFamily: 'Jost' }}>
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="nav-label w-full min-h-[44px] py-4 text-white transition-opacity duration-400 hover:opacity-85 disabled:opacity-50 focus-visible:outline-none"
                style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.16em', backgroundColor: 'var(--caramel)' }}
              >
                {submitting ? 'MENGIRIMKAN KONSULTASI...' : 'KIRIM FORMULIR KONSULTASI'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={Boolean(selectedPackage)}
        onClose={() => setSelectedPackage(null)}
        pkg={selectedPackage}
        onSelectInquiry={handleSelectPackageForInquiry}
      />
    </>
  );
}
