// ============================================================
// Katering Page (/katering)
// ============================================================
import React, { useState } from 'react';
import Placeholder from '../components/ui/Placeholder';
import { sendInquiry, WHATSAPP_NUMBER } from '../services/katering';
import type { InquiryData } from '../types/katering';
import { Star, ChevronDown } from 'lucide-react';
import { formatRupiah } from '../utils/format';

const packages = [
  {
    name: 'Nasi Box',
    price: 35000,
    unit: 'porsi',
    minOrder: 50,
    minUnit: 'porsi',
    inclusions: ['Nasi putih / merah pilihan', 'Lauk utama (ayam/daging)', 'Sayur tumis', 'Buah segar', 'Air mineral'],
    description: 'Pilihan praktis untuk seminar, rapat, dan acara internal kantor. Dikemas rapi dalam kotak ramah lingkungan.',
  },
  {
    name: 'Prasmanan',
    price: 85000,
    unit: 'porsi',
    minOrder: 100,
    minUnit: 'porsi',
    inclusions: ['5 pilihan lauk utama', '2 sajian sayur', 'Dessert tradisional', 'Minuman dingin & panas', 'Dekorasi meja prasmanan'],
    description: 'Cocok untuk pernikahan, syukuran, dan acara keluarga besar. Disajikan hangat langsung di lokasi Anda.',
  },
  {
    name: 'Tumpeng / Acara Khusus',
    price: 1500000,
    unit: 'set',
    minOrder: 1,
    minUnit: 'set',
    inclusions: ['Tumpeng nasi kuning tradisional lengkap', '7 lauk pilihan premium', 'Alas daun pisang segar', 'Dekorasi kembang & hasil bumi', 'Tim pelayanan'],
    description: 'Untuk momen spesial yang tak terlupakan — ulang tahun, selamatan, wisuda, dan perayaan adat.',
  },
];

const menuItems = [
  { name: 'Nasi Liwet Spesial', ratio: '1/1' as const },
  { name: 'Rendang Daging Sapi', ratio: '3/4' as const },
  { name: 'Tumis Kangkung Terasi', ratio: '1/1' as const },
  { name: 'Es Teh Pandan', ratio: '3/4' as const },
  { name: 'Tumpeng Mini Nasi Kuning', ratio: '3/4' as const },
  { name: 'Aneka Satay Combo', ratio: '1/1' as const },
];

const steps = [
  { num: '01', title: 'Hubungi Kami', text: 'Via WhatsApp atau formulir di bawah halaman ini.' },
  { num: '02', title: 'Konsultasi Menu', text: 'Diskusikan kebutuhan, menu, dan detail acara Anda bersama tim kami.' },
  { num: '03', title: 'Konfirmasi & DP', text: 'Setujui penawaran dan lakukan pembayaran uang muka 50%.' },
  { num: '04', title: 'Siap Tepat Waktu', text: 'Katering kami hadir di lokasi Anda tepat waktu, siap saji.' },
];

const events = [
  'Pengajian & Majelis Taklim',
  'Pernikahan & Resepsi',
  'Rapat & Acara Kantor',
  'Arisan & Gathering',
  'Ulang Tahun & Syukuran',
];

const faqs = [
  { q: 'Berapa minimal pemesanan nasi box?', a: 'Minimal pemesanan nasi box adalah 50 porsi. Untuk jumlah di bawah itu, silakan konsultasikan kebutuhan Anda dengan tim kami.' },
  { q: 'Apakah tersedia pilihan menu halal?', a: 'Seluruh menu RiaMiranda Katering menggunakan bahan-bahan halal bersertifikat. Kami berkomitmen pada standar kebersihan dan kehalalan tertinggi.' },
  { q: 'Bagaimana sistem pembayaran?', a: 'Pembayaran dilakukan dalam dua tahap: uang muka (DP) 50% saat konfirmasi pesanan, dan pelunasan H-3 sebelum acara.' },
  { q: 'Apakah tersedia layanan dekorasi?', a: 'Untuk paket Prasmanan dan Tumpeng, dekorasi dasar sudah termasuk. Dekorasi tambahan dan custom dapat didiskusikan dengan biaya terpisah.' },
  { q: 'Berapa jauh jangkauan pengiriman?', a: 'Kami melayani area Jabodetabek dan sekitarnya. Untuk lokasi di luar area tersebut, silakan hubungi kami untuk penawaran khusus.' },
];

const testimoni = [
  {
    quote: 'Katering RiaMiranda benar-benar luar biasa. Makanannya enak, penyajiannya rapi, dan timnya sangat profesional. Tamu-tamu kami sampai menanyakan kontak katering setelah acara.',
    name: 'Hana Putri',
    city: 'Jakarta Selatan',
    event: 'Pernikahan',
  },
  {
    quote: 'Sudah dua kali kami memesan nasi box untuk acara kantor, dan hasilnya selalu memuaskan. Porsinya pas, menunya bervariasi, dan pengirimannya tepat waktu.',
    name: 'Bapak Darmawan',
    city: 'Jakarta Pusat',
    event: 'Acara Kantor',
  },
  {
    quote: 'Tumpeng untuk ulang tahun ibu saya sangat cantik dan lezat. Dekorasinya indah dan semua lauk terasa autentik. Sangat direkomendasikan!',
    name: 'Siti Rahayu',
    city: 'Depok',
    event: 'Syukuran',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left transition-opacity duration-400 hover:opacity-70"
      >
        <span className="font-light" style={{ color: 'var(--charcoal)', fontFamily: 'Jost', fontSize: '15px' }}>
          {q}
        </span>
        <ChevronDown size={16} strokeWidth={1.25} color="var(--caramel)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease', flexShrink: 0, marginLeft: 16 }} />
      </button>
      {open && (
        <p className="pb-5 font-light leading-relaxed" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.85 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function KateringPage() {
  const [form, setForm] = useState<InquiryData>({ nama: '', tanggalAcara: '', jumlahPorsi: 0, catatan: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'jumlahPorsi' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.tanggalAcara || !form.jumlahPorsi) {
      setFormError('Mohon lengkapi semua kolom yang diperlukan.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    await sendInquiry(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative w-full -mt-[136px]" style={{ minHeight: 480 }}>
        <Placeholder ratio="16/9" label="Katering RiaMiranda" className="w-full" style={{ minHeight: 480 }} />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ backgroundColor: 'rgba(152,114,69,0.35)' }}
        >
          <p className="nav-label text-white mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            KATERING RIAMIRANDA
          </p>
          <h1
            className="font-cormorant font-light text-white mb-8 max-w-2xl leading-snug"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', letterSpacing: '0.04em' }}
          >
            Cita Rasa Terbaik untuk Setiap Momen Istimewa
          </h1>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-label px-8 py-4 text-white transition-opacity duration-400 hover:opacity-80"
            style={{ fontSize: '10px', letterSpacing: '0.18em', backgroundColor: 'var(--caramel)' }}
          >
            KONSULTASI VIA WHATSAPP
          </a>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-screen-lg mx-auto px-6 py-20 text-center">
        <p
          className="font-light leading-relaxed"
          style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '16px', lineHeight: 2, maxWidth: 640, margin: '0 auto' }}
        >
          RiaMiranda Katering hadir untuk merayakan momen penting Anda bersama orang-orang tercinta.
          Dengan resep autentik dan bahan-bahan segar pilihan, kami menghadirkan cita rasa rumahan yang hangat dalam skala profesional.
          Dari pengajian sederhana hingga pernikahan besar, setiap hidangan kami racik dengan sepenuh hati.
        </p>
      </section>

      {/* Paket Unggulan */}
      <section className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-20">
          <p className="nav-label text-center mb-16" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
            PAKET UNGGULAN
          </p>
          <div className="space-y-0">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`grid grid-cols-1 md:grid-cols-2 border-b ${i % 2 === 0 ? '' : ''}`}
                style={{ borderColor: 'var(--line)' }}
              >
                <div
                  className={`py-12 px-10 flex flex-col justify-center border-r ${i % 2 !== 0 ? 'md:order-2' : ''}`}
                  style={{ borderColor: 'var(--line)' }}
                >
                  <p className="nav-label mb-4" style={{ fontSize: '10px', color: 'var(--caramel)', letterSpacing: '0.2em' }}>
                    PAKET {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-cormorant font-light mb-3" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', color: 'var(--charcoal)' }}>
                    {pkg.name}
                  </h3>
                  <p className="font-light mb-6 leading-relaxed" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.8 }}>
                    {pkg.description}
                  </p>
                  <div className="mb-6">
                    <span className="font-light" style={{ color: 'var(--caramel)', fontFamily: 'Jost', fontSize: '20px' }}>
                      mulai dari {formatRupiah(pkg.price)}
                    </span>
                    <span className="font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '13px' }}>
                      /{pkg.unit}
                    </span>
                  </div>
                  <p className="nav-label" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em' }}>
                    Min. {pkg.minOrder} {pkg.minUnit}
                  </p>
                </div>
                <div className={`py-12 px-10 flex flex-col justify-center ${i % 2 !== 0 ? 'md:order-1' : ''}`} style={{ backgroundColor: 'var(--surface)' }}>
                  <p className="nav-label mb-5" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>
                    SUDAH TERMASUK
                  </p>
                  <ul className="space-y-3">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span style={{ color: 'var(--caramel)', marginTop: 2, flexShrink: 0 }}>—</span>
                        <span className="font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Gallery — masonry-style */}
      <section className="max-w-screen-xl mx-auto px-6 pb-20">
        <p className="nav-label text-center mb-10" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
          GALERI HIDANGAN
        </p>
        <div className="columns-2 md:columns-3 gap-4 space-y-0">
          {menuItems.map((item) => (
            <div key={item.name} className="break-inside-avoid mb-4">
              <Placeholder ratio={item.ratio} label={item.name} className="w-full" />
              <p className="nav-label mt-2 text-center" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                {item.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Pemesanan */}
      <section className="border-t border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-20">
          <p className="nav-label text-center mb-14" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
            CARA PEMESANAN
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {steps.map((step) => (
              <div key={step.num} className="px-8 py-4 text-center" style={{ borderColor: 'var(--line)' }}>
                <p className="font-cormorant font-light mb-4" style={{ fontSize: '3rem', color: 'var(--caramel)' }}>
                  {step.num}
                </p>
                <p className="nav-label mb-3" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>
                  {step.title.toUpperCase()}
                </p>
                <p className="font-light leading-relaxed" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '13px', lineHeight: 1.75 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acara yang Dilayani */}
      <section className="max-w-screen-lg mx-auto px-6 py-20">
        <p className="nav-label text-center mb-12" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
          ACARA YANG KAMI LAYANI
        </p>
        <div className="border-t" style={{ borderColor: 'var(--line)' }}>
          {events.map((event) => (
            <div
              key={event}
              className="flex items-center justify-center py-5 border-b"
              style={{ borderColor: 'var(--line)' }}
            >
              <span className="font-cormorant font-light" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: 'var(--charcoal)', letterSpacing: '0.04em' }}>
                {event}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-20">
          <p className="nav-label text-center mb-12" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
            KATA PELANGGAN KAMI
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimoni.map((t, i) => (
              <div key={i} className="flex flex-col bg-bg p-8" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill="var(--caramel)" color="var(--caramel)" strokeWidth={0} />
                  ))}
                </div>
                <blockquote
                  className="font-cormorant font-light mb-6 flex-1 leading-relaxed"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--charcoal)', fontStyle: 'italic' }}
                >
                  "{t.quote}"
                </blockquote>
                <div>
                  <p className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>{t.name}</p>
                  <p className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '11px' }}>
                    {t.city} · {t.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-screen-lg mx-auto px-6 py-20">
        <p className="nav-label text-center mb-12" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}>
          PERTANYAAN UMUM
        </p>
        <div className="border-t" style={{ borderColor: 'var(--line)' }}>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="border-t" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-screen-md mx-auto px-6 py-20">
          <p className="nav-label text-center mb-4" style={{ fontSize: '10px', color: 'var(--caramel)', letterSpacing: '0.2em' }}>
            FORMULIR KONSULTASI
          </p>
          <h2 className="font-cormorant font-light text-center mb-12" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'var(--charcoal)' }}>
            Ceritakan Kebutuhan Anda
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <p className="font-cormorant font-light text-2xl mb-4" style={{ color: 'var(--caramel)' }}>
                Terima kasih!
              </p>
              <p className="font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '15px' }}>
                Pesan Anda telah terkirim. Tim kami akan menghubungi Anda segera.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="nav-label block mb-2" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="input-underline"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-2" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  TANGGAL ACARA *
                </label>
                <input
                  type="date"
                  name="tanggalAcara"
                  value={form.tanggalAcara}
                  onChange={handleChange}
                  className="input-underline"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-2" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  JUMLAH PORSI *
                </label>
                <input
                  type="number"
                  name="jumlahPorsi"
                  value={form.jumlahPorsi || ''}
                  onChange={handleChange}
                  placeholder="Estimasi jumlah porsi"
                  min={1}
                  className="input-underline"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-2" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  CATATAN TAMBAHAN
                </label>
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleChange}
                  placeholder="Ceritakan jenis acara, preferensi menu, atau pertanyaan lainnya..."
                  rows={4}
                  className="input-underline resize-none"
                />
              </div>

              {formError && (
                <p className="text-sm font-light" style={{ color: 'var(--occupied)', fontFamily: 'Jost' }}>
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="nav-label w-full py-4 text-white transition-opacity duration-400 hover:opacity-80 disabled:opacity-50"
                style={{ fontSize: '11px', letterSpacing: '0.18em', backgroundColor: 'var(--caramel)' }}
              >
                {submitting ? 'MENGIRIM...' : 'KIRIM PESAN'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
