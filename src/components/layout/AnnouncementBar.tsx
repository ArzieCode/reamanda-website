// ============================================================
// Announcement Bar — rotating 3 messages, charcoal bg
// ============================================================
import React, { useState, useEffect } from 'react';

const messages = [
  'GRATIS ONGKIR UNTUK PEMBELIAN DI ATAS RP 500.000 • KODE: RIAFIRST',
  'KOLEKSI LUMINARA 2024 — KINI TERSEDIA DI SEMUA KATEGORI',
  'PROGRAM LOYALTY RIAMIRANDA — KUMPULKAN POIN SETIAP PEMBELIAN',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 40, backgroundColor: 'var(--charcoal)' }}
    >
      <p
        key={index}
        className="nav-label text-white text-center px-4 transition-opacity duration-500"
        style={{ fontSize: '10px', letterSpacing: '0.16em' }}
      >
        {messages[index]}
      </p>
    </div>
  );
}
