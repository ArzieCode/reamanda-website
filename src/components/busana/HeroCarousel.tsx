// ============================================================
// HeroCarousel — 3 slides, numeric pagination, auto-advance 5s
// ============================================================
import React, { useState, useEffect } from 'react';
import Placeholder from '../ui/Placeholder';

const slides = [
  { headline: 'Keanggunan yang Mengalir, Kesederhanaan yang Berbicara', sub: 'Koleksi Luminara 2024' },
  { headline: 'Merayakan Kecantikan Wanita Indonesia Modern', sub: 'Terra — Tanah yang Menghidupi' },
  { headline: 'Sebuah Kolaborasi yang Lahir dari Rasa', sub: 'Kolaborasi Nara Studio' },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 136px)' }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[800ms]"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {/* Background placeholder */}
          <div className="w-full h-full" style={{ backgroundColor: 'var(--surface)' }}>
            <Placeholder ratio="16/9" label={slide.sub} className="w-full h-full object-cover" />
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ backgroundColor: 'rgba(77,73,70,0.18)' }}>
            <h1
              className="font-cormorant font-light text-white mb-6 max-w-2xl leading-snug"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '0.04em' }}
            >
              {slide.headline}
            </h1>
            <p
              className="nav-label text-white mb-10 opacity-90"
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}
            >
              {slide.sub.toUpperCase()}
            </p>
            <a
              href="/busana"
              className="nav-label text-white border-b pb-0.5 transition-opacity duration-400 hover:opacity-70"
              style={{ fontSize: '11px', letterSpacing: '0.2em', borderColor: 'rgba(255,255,255,0.7)' }}
            >
              LIHAT KOLEKSI
            </a>
          </div>
        </div>
      ))}

      {/* Numeric pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="nav-label text-white transition-opacity duration-400"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              opacity: i === active ? 1 : 0.45,
              fontWeight: i === active ? 400 : 300,
            }}
            aria-label={`Slide ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
