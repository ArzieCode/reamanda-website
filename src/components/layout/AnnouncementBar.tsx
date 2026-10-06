// ============================================================
// Announcement Bar — 40px high, single line, centred
// Truncates with ellipsis on mobile, 12px, letter-spacing 0.12em
// Rotation pausable on hover
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    text: 'GRATIS ONGKIR UNTUK PEMBELIAN DI ATAS RP 500.000 • KODE: RIAFIRST',
    link: '/busana',
  },
  {
    text: 'KOLEKSI LUMINARA 2024 — KINI TERSEDIA DI SEMUA KATEGORI',
    link: '/busana/koleksi/luminara',
  },
  {
    text: 'PROGRAM LOYALITAS RIAMIRANDA — KUMPULKAN POIN SETIAP PEMBELIAN',
    link: '/rewards',
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = announcements[index];

  return (
    <div
      className="w-full flex items-center justify-center px-4 border-b transition-colors duration-300"
      style={{
        height: 'var(--announcement-height)',
        backgroundColor: 'var(--color-bg-announcement)',
        borderColor: 'var(--color-border-subtle)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Link
        to={current.link}
        key={index}
        className="nav-label text-center truncate max-w-full hover:underline transition-opacity duration-300 focus-visible:outline-none"
        style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: 'var(--color-text-on-dark)',
        }}
        aria-label={current.text}
      >
        {current.text}
      </Link>
    </div>
  );
}
