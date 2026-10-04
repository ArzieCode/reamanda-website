import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-28 text-center">
      <p
        className="nav-label mb-4"
        style={{ fontSize: '11px', color: 'var(--caramel)', letterSpacing: '0.2em' }}
      >
        404 · HALAMAN TIDAK DITEMUKAN
      </p>
      <h1
        className="font-cormorant font-light mb-6"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--charcoal)' }}
      >
        Halaman yang Anda Cari Tidak Tersedia
      </h1>
      <p
        className="font-light leading-relaxed mb-10 max-w-md mx-auto"
        style={{ color: 'var(--ink)', fontFamily: 'Jost, sans-serif', fontSize: '15px' }}
      >
        Mungkin tautan yang Anda tuju telah berpindah atau tidak lagi aktif. Silakan kembali ke beranda untuk menjelajahi koleksi kami.
      </p>
      <Link
        to="/"
        className="nav-label inline-block px-8 py-4 text-white transition-opacity duration-400 hover:opacity-80"
        style={{
          fontSize: '10px',
          letterSpacing: '0.18em',
          backgroundColor: 'var(--charcoal)',
        }}
      >
        KEMBALI KE BERANDA
      </Link>
    </div>
  );
}
