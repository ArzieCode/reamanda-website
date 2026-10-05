// ============================================================
// Announcement Bar — rotating 3 messages with real links
// Charcoal bg, single line truncated on mobile, min 44px safe tap target
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = announcements[index];

  return (
    <div
      className="w-full flex items-center justify-center px-4"
      style={{ height: 40, backgroundColor: 'var(--charcoal)' }}
    >
      <Link
        to={current.link}
        key={index}
        className="nav-label text-white text-center truncate max-w-full hover:underline transition-opacity duration-500 focus-visible:outline-none"
        style={{ fontSize: '10px', letterSpacing: '0.16em' }}
        aria-label={current.text}
      >
        {current.text}
      </Link>
    </div>
  );
}
