// ============================================================
// Landing Page (/)
// ============================================================
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Placeholder from '../components/ui/Placeholder';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const businessLines = [
  {
    label: 'BUSANA MUSLIMAH',
    title: 'Mode yang Merayakan Keanggunan',
    description:
      'Koleksi busana muslimah yang dirancang untuk wanita Indonesia modern — elegan, nyaman, dan timeless.',
    path: '/busana',
    accent: 'var(--charcoal)',
    imageLeft: true,
  },
  {
    label: 'PROPERTI & HOTEL',
    title: 'Investasi Properti Terpilih',
    description:
      'Platform lelang properti eksklusif — hotel, hunian, dan komersial pilihan di lokasi strategis.',
    path: '/properti',
    accent: 'var(--indigo-brand)',
    imageLeft: false,
  },
  {
    label: 'KATERING',
    title: 'Cita Rasa untuk Setiap Momen',
    description:
      'Layanan katering profesional untuk pengajian, pernikahan, dan acara korporat — dengan sentuhan khas masakan Indonesia.',
    path: '/katering',
    accent: 'var(--caramel)',
    imageLeft: true,
  },
];

export default function HomePage() {
  const aboutRef = useFadeIn();
  const valuesRef = useFadeIn();
  const bizRef = useFadeIn();

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: 'clamp(520px, 80svh, 860px)' }}>
        <div className="absolute inset-0 w-full h-full">
          <Placeholder ratio="16/9" dark={true} label="RiaMiranda — Beranda" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ backgroundColor: 'rgba(79, 77, 74, 0.45)' }}
        >
          <h1
            className="font-cormorant font-light text-white max-w-3xl leading-snug mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.04em' }}
          >
            Elegan, Tulus, dan Abadi
          </h1>
          <Link
            to="/busana"
            className="nav-label text-white border-b pb-1 min-h-[44px] inline-flex items-center transition-opacity duration-400 hover:opacity-75"
            style={{ fontSize: '11px', letterSpacing: '0.2em', borderColor: 'rgba(255,255,255,0.8)' }}
          >
            KENALI KAMI
          </Link>
        </div>
      </section>

      {/* Tentang RiaMiranda */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <div ref={aboutRef} className="fade-in grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Portrait image, offset left */}
          <div className="md:translate-y-8">
            <Placeholder ratio="3/4" label="Indria Miranda" className="w-full max-w-sm mx-auto md:mx-0" />
          </div>

          {/* Text */}
          <div className="md:pt-12">
            <p
              className="nav-label mb-5"
              style={{ fontSize: '10px', color: 'var(--caramel-deep)', letterSpacing: '0.2em' }}
            >
              TENTANG RIAMIRANDA
            </p>
            <h2
              className="font-cormorant font-light mb-8 leading-snug"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--charcoal)' }}
            >
              Lebih dari Satu Dekade Menemani Wanita Indonesia
            </h2>
            <div className="space-y-4 mb-10">
              <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '15px', lineHeight: 1.85 }}>
                RiaMiranda lahir di Jakarta pada tahun 2009, digagas oleh Indria Miranda — perancang yang percaya bahwa busana muslimah dapat sekaligus feminin, modern, dan bermartabat.
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '15px', lineHeight: 1.85 }}>
                Lulusan ESMOD Jakarta angkatan 2008, Indria terlebih dahulu berkarir sebagai fashion stylist profesional sebelum akhirnya meluncurkan label sendiri setahun kemudian. Perjalanan itulah yang membentuk mata dan rasa yang tajam: memahami tubuh wanita, memilih kain yang jatuh sempurna, dan merancang siluet yang mengangkat kepercayaan diri.
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '15px', lineHeight: 1.85 }}>
                Hari ini, RiaMiranda hadir dalam tiga lini — busana, properti, dan katering — namun semua berakar pada satu filosofi: kejujuran dalam kualitas, keindahan dalam kesederhanaan.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-0 border-t border-b py-6" style={{ borderColor: 'var(--line)' }}>
              {[
                { num: '2009', label: 'Berdiri' },
                { num: '3', label: 'Lini Bisnis' },
                { num: '15+', label: 'Tahun Berkarya' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex-1 text-center"
                  style={{
                    borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <p
                    className="font-cormorant font-light"
                    style={{ fontSize: '2rem', color: 'var(--charcoal)' }}
                  >
                    {stat.num}
                  </p>
                  <p className="nav-label mt-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    {stat.label.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Kami */}
      <section
        className="border-t border-b py-16 md:py-24"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
          <div ref={valuesRef} className="fade-in grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {[
              {
                label: 'KUALITAS',
                text: 'Setiap helai kain dipilih dengan teliti untuk memastikan kenyamanan dan keindahan sepanjang hari.',
              },
              {
                label: 'KEANGGUNAN',
                text: 'Desain yang timeless dan feminin, terinspirasi dari keindahan wanita Indonesia modern.',
              },
              {
                label: 'KEPERCAYAAN',
                text: 'Lebih dari satu dekade menemani perjalanan gaya wanita muslimah Indonesia.',
              },
            ].map((v) => (
              <div
                key={v.label}
                className="px-6 md:px-8 py-8"
                style={{ borderColor: 'var(--line)' }}
              >
                <p
                  className="nav-label mb-4"
                  style={{ fontSize: '10px', color: 'var(--caramel-deep)', letterSpacing: '0.2em' }}
                >
                  {v.label}
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.8 }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lini Bisnis */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 md:pt-24 pb-28 md:pb-36">
        <div ref={bizRef} className="fade-in">
          <p
            className="nav-label text-center mb-16"
            style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em' }}
          >
            LINI BISNIS KAMI
          </p>
          <div className="space-y-24">
            {businessLines.map((biz) => (
              <div
                key={biz.label}
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
                  biz.imageLeft ? '' : 'md:grid-flow-dense'
                }`}
              >
                {/* Image */}
                <div className={biz.imageLeft ? '' : 'md:col-start-2'}>
                  <Placeholder ratio="3/4" label={biz.label} className="w-full max-w-sm mx-auto" />
                </div>

                {/* Text */}
                <div className={`${biz.imageLeft ? '' : 'md:col-start-1 md:row-start-1'} flex flex-col justify-center px-4`}>
                  <p
                    className="nav-label mb-4"
                    style={{ fontSize: '10px', letterSpacing: '0.2em', color: biz.accent === 'var(--caramel)' ? 'var(--caramel-deep)' : biz.accent }}
                  >
                    {biz.label}
                  </p>
                  <h3
                    className="font-cormorant font-light mb-5 leading-snug"
                    style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'var(--charcoal)' }}
                  >
                    {biz.title}
                  </h3>
                  <p
                    className="font-light leading-relaxed mb-8"
                    style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.85 }}
                  >
                    {biz.description}
                  </p>
                  <Link
                    to={biz.path}
                    className="nav-label inline-flex items-center gap-2 border-b pb-1 min-h-[44px] w-fit transition-opacity duration-400 hover:opacity-60"
                    style={{ fontSize: '11px', letterSpacing: '0.16em', color: biz.accent === 'var(--caramel)' ? 'var(--caramel-deep)' : biz.accent, borderColor: biz.accent === 'var(--caramel)' ? 'var(--caramel-deep)' : biz.accent }}
                  >
                    JELAJAHI →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
