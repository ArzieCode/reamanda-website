// ============================================================
// Footer — 4 columns + newsletter + payment row
// ============================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Informasi',
    links: [
      { label: 'Tentang Kami', href: '/' },
      { label: 'Karir', href: '/' },
      { label: 'Press & Media', href: '/' },
      { label: 'Sustainability', href: '/' },
    ],
  },
  {
    title: 'Jelajahi',
    links: [
      { label: 'Busana Muslimah', href: '/busana' },
      { label: 'Properti & Hotel', href: '/properti' },
      { label: 'Katering', href: '/katering' },
      { label: 'Koleksi Terbaru', href: '/busana' },
    ],
  },
  {
    title: 'Dukungan',
    links: [
      { label: 'Cara Pemesanan', href: '/' },
      { label: 'Pengiriman & Retur', href: '/' },
      { label: 'Syarat & Ketentuan', href: '/' },
      { label: 'Kebijakan Privasi', href: '/' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'WhatsApp', href: 'https://wa.me/6281234567890' },
];

const paymentMethods = ['QRIS', 'Visa', 'Mastercard', 'BCA', 'BRI', 'OVO', 'GoPay'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        {/* Top row: wordmark + newsletter */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div>
            <p
              className="font-cormorant text-2xl tracking-widest uppercase font-light mb-2"
              style={{ color: 'var(--charcoal)', letterSpacing: '0.25em' }}
            >
              RiaMiranda
            </p>
            <p className="text-sm font-jost font-light" style={{ color: 'var(--muted)' }}>
              Jakarta, est. 2009
            </p>
          </div>

          <div className="max-w-sm w-full">
            <p
              className="nav-label mb-4"
              style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}
            >
              LANGGANAN NEWSLETTER
            </p>
            {subscribed ? (
              <p className="text-sm font-light" style={{ color: 'var(--caramel)' }}>
                Terima kasih! Anda telah berlangganan.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0 border-b" style={{ borderColor: 'var(--line)' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat email Anda"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-light py-2"
                  style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                  required
                />
                <button
                  type="submit"
                  className="nav-label px-0 pb-2 transition-opacity duration-400 hover:opacity-60"
                  style={{ fontSize: '10px', color: 'var(--caramel)', letterSpacing: '0.16em' }}
                >
                  DAFTAR
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-column links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <p
                className="nav-label mb-5"
                style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}
              >
                {col.title.toUpperCase()}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-opacity duration-400 hover:opacity-60"
                      style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p
              className="nav-label mb-5"
              style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}
            >
              IKUTI KAMI
            </p>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light transition-opacity duration-400 hover:opacity-60"
                    style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: copyright + payment methods */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--line)' }}
        >
          <p
            className="text-xs font-light"
            style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.06em' }}
          >
            © 2024 RiaMiranda. Hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="nav-label px-2 py-1 border"
                style={{
                  fontSize: '9px',
                  color: 'var(--muted)',
                  borderColor: 'var(--line)',
                  letterSpacing: '0.1em',
                  borderRadius: 2,
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
