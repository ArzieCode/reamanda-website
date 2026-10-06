// ============================================================
// Footer — 4 columns + newsletter + payment row
// All links lead to real pages, newsletter validation & service
// ============================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../../services/newsletter';
import { useToast } from '../../context/ToastContext';

const columns = [
  {
    title: 'Informasi',
    links: [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Karier', href: '/karier' },
      { label: 'Press & Media', href: '/media' },
      { label: 'Lokasi Toko', href: '/lokasi-toko' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
  },
  {
    title: 'Jelajahi',
    links: [
      { label: 'Busana Muslimah', href: '/busana' },
      { label: 'Koleksi Luminara', href: '/busana/koleksi/luminara' },
      { label: 'Properti & Hotel', href: '/properti' },
      { label: 'Katering Perjamuan', href: '/katering' },
      { label: 'Loyalty & Rewards', href: '/rewards' },
    ],
  },
  {
    title: 'Bantuan & Kebijakan',
    links: [
      { label: 'Kontak Kami', href: '/kontak' },
      { label: 'FAQ (Tanya Jawab)', href: '/faq' },
      { label: 'Cara Pemesanan', href: '/cara-pemesanan' },
      { label: 'Kebijakan Pengiriman', href: '/kebijakan-pengiriman' },
      { label: 'Kebijakan Pengembalian', href: '/kebijakan-pengembalian' },
      { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
      { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
      { label: 'Program Afiliasi', href: '/afiliasi' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/riamiranda' },
  { label: 'TikTok', href: 'https://tiktok.com/@riamirandaofficial' },
  { label: 'YouTube', href: 'https://youtube.com/@riamiranda' },
  { label: 'WhatsApp', href: 'https://wa.me/6281234567890' },
];

const paymentMethods = ['QRIS', 'Visa', 'Mastercard', 'BCA', 'BRI', 'OVO', 'GoPay'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribedMessage, setSubscribedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage('');
    const res = await subscribeNewsletter(email);
    setLoading(false);

    if (res.success) {
      setSubscribedMessage(res.message);
      showToast(res.message, 'success');
      setEmail('');
    } else {
      setErrorMessage(res.message);
      showToast(res.message, 'error');
    }
  };

  return (
    <footer
      className="border-t mt-16 md:mt-24 transition-colors duration-300"
      style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-footer)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 md:pt-24 pb-28 md:pb-36">
        {/* Top row: wordmark + newsletter */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div>
            <Link
              to="/"
              className="font-cormorant text-2xl tracking-widest uppercase font-light mb-2 block hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-text-on-dark)', letterSpacing: '0.25em' }}
            >
              RiaMiranda
            </Link>
            <p className="text-sm font-jost font-light" style={{ color: 'var(--color-text-secondary-on-dark)' }}>
              Jakarta, est. 2009 · Keanggunan Muslimah & Gaya Hidup Holistik
            </p>
          </div>

          <div className="max-w-sm w-full">
            <p
              className="nav-label mb-3"
              style={{ fontSize: '10px', color: 'var(--color-text-on-dark)', letterSpacing: '0.16em' }}
            >
              LANGGANAN BULETIN EKSKLUSIF
            </p>
            {subscribedMessage ? (
              <p className="text-xs font-light" style={{ color: 'var(--caramel-deep)' }}>
                {subscribedMessage}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-1">
                <div className="flex gap-0 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Alamat email Anda"
                    className="flex-1 bg-transparent border-none outline-none text-sm font-light py-2 min-h-[44px]"
                    style={{ color: 'var(--color-text-on-dark)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="nav-label px-2 min-h-[44px] transition-opacity duration-400 hover:opacity-60 disabled:opacity-40"
                    style={{ fontSize: '11px', color: 'var(--caramel-deep)', letterSpacing: '0.16em' }}
                  >
                    {loading ? 'MEMPROSES...' : 'DAFTAR'}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-[11px] font-light mt-1" style={{ color: 'var(--occupied)', fontFamily: 'Jost, sans-serif' }}>
                    {errorMessage}
                  </p>
                )}
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
                style={{ fontSize: '10px', color: 'var(--color-text-on-dark)', letterSpacing: '0.16em' }}
              >
                {col.title.toUpperCase()}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-colors duration-300 hover:text-[#F7F4EE] block"
                      style={{ color: 'var(--color-text-secondary-on-dark)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
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
              style={{ fontSize: '10px', color: 'var(--color-text-on-dark)', letterSpacing: '0.16em' }}
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
                    className="text-sm font-light transition-colors duration-300 hover:text-[#F7F4EE] block"
                    style={{ color: 'var(--color-text-secondary-on-dark)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
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
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <p
            className="text-xs font-light text-center md:text-left"
            style={{ color: 'var(--color-text-secondary-on-dark)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.06em' }}
          >
            © 2024 RiaMiranda (PT Miranda Mode Indonesia). Hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="nav-label px-2.5 py-1 border"
                style={{
                  fontSize: '9px',
                  color: 'var(--color-text-secondary-on-dark)',
                  borderColor: 'var(--color-border-subtle)',
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
