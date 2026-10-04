// ============================================================
// HeroCarousel — 3 slides, numeric pagination, auto-advance 5s
// Stacked grid cell, charcoal overlay 0.45, darker warm placeholder
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Placeholder from '../ui/Placeholder';

const slides = [
  {
    eyebrow: 'KOLEKSI LUMINARA 2024',
    headline: 'Keanggunan yang Mengalir, Kesederhanaan yang Berbicara',
    path: '/busana/koleksi/luminara',
    cta: 'LIHAT KOLEKSI',
  },
  {
    eyebrow: 'TERRA — TANAH YANG MENGHIDUPI',
    headline: 'Merayakan Kecantikan Wanita Indonesia Modern',
    path: '/busana/koleksi/terra',
    cta: 'JELAJAHI TERRA',
  },
  {
    eyebrow: 'KOLABORASI EKSKLUSIF',
    headline: 'Sebuah Kolaborasi yang Lahir dari Rasa',
    path: '/busana/koleksi/kolaborasi-nara',
    cta: 'LIHAT KOLABORASI',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden grid grid-cols-1 grid-rows-1"
      style={{ minHeight: 'clamp(520px, 80svh, 860px)' }}
    >
      {slides.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.eyebrow}
            className="col-start-1 row-start-1 w-full h-full relative transition-opacity duration-700 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {/* Background placeholder with darker tone */}
            <div className="absolute inset-0 w-full h-full">
              <Placeholder
                ratio="16/9"
                dark={true}
                label={slide.eyebrow}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Flat charcoal overlay (rgba(79,77,74,0.45)) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              style={{ backgroundColor: 'rgba(79, 77, 74, 0.45)' }}
            >
              <p
                className="nav-label text-white mb-5 select-none"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                {slide.eyebrow}
              </p>
              <h1
                className="font-cormorant font-light text-white mb-8 max-w-3xl leading-snug"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.04em' }}
              >
                {slide.headline}
              </h1>
              <Link
                to={slide.path}
                className="nav-label text-white border-b pb-1 min-h-[44px] inline-flex items-center transition-opacity duration-400 hover:opacity-75"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Numeric pagination: min 44px tap target, readable white */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-11 h-11 flex items-center justify-center transition-all duration-400 focus-visible:outline-none"
              aria-label={`Slide ${i + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <span
                className="nav-label"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  borderBottom: isActive ? '1px solid #ffffff' : 'none',
                  paddingBottom: isActive ? '2px' : '0',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
