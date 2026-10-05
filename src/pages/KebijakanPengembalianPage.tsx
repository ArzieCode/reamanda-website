// ============================================================
// Page — Kebijakan Pengembalian (/kebijakan-pengembalian)
// 14-day exchange & return terms, conditions, procedures
// ============================================================
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function KebijakanPengembalianPage() {
  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        GARANSI KEPUASAN
      </p>
      <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-8 leading-tight">
        Kebijakan Pengembalian & Penukaran
      </h1>

      <div className="space-y-10 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.85 }}>
        <p>
          Kepuasan Anda dalam mengenakan karya RiaMiranda adalah prioritas utama kami. Apabila ukuran yang diterima kurang pas atau produk yang tiba tidak sesuai dengan pesanan Anda, kami memfasilitasi penukaran barang dalam jangka waktu <strong>14 hari kerja</strong> sejak pesanan diterima.
        </p>

        {/* Requirements Box */}
        <div className="border border-line bg-surface p-6 space-y-4">
          <p className="nav-label text-charcoal flex items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
            <CheckCircle size={16} color="var(--available)" />
            SYARAT PRODUK YANG DAPAT DITUKAR / DIKEMBALIKAN:
          </p>
          <ul className="space-y-2 text-xs text-muted" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            <li>• Produk dalam kondisi baru, belum pernah dicuci, dan belum pernah dipakai bepergian.</li>
            <li>• Seluruh label merek (*tag*) dan kemasan eksklusif asli RiaMiranda masih utuh terpasang.</li>
            <li>• Menunjukkan bukti transaksi atau nomor pesanan resmi.</li>
            <li>• Permohonan diajukan maksimal 14 hari setelah status resi kurir dinyatakan "Terkirim".</li>
          </ul>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            Pengecualian Penukaran
          </h2>
          <div className="flex items-start gap-3 p-4 border border-line bg-bg text-xs text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
            <AlertCircle size={18} color="var(--occupied)" className="flex-shrink-0 mt-0.5" />
            <p>
              Produk pada kategori <strong>Final Sale</strong>, promosi *Clearance Bazaar*, atau barang gratis dari promosi voucher tidak dapat ditukar atau diuangkan kembali, kecuali terdapat cacat produksi dari pabrik saat kemasan pertama kali dibuka.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-4">
            Alur 3 Langkah Penukaran
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border border-line p-5">
              <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>LANGKAH 01</p>
              <h3 className="font-cormorant text-lg text-charcoal mb-1">Hubungi Tim Layanan</h3>
              <p className="text-xs text-muted">Kirimkan foto produk dan nomor pesanan via WhatsApp resmi atau email layanan kami.</p>
            </div>
            <div className="border border-line p-5">
              <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>LANGKAH 02</p>
              <h3 className="font-cormorant text-lg text-charcoal mb-1">Kirim Balik Produk</h3>
              <p className="text-xs text-muted">Kirimkan produk ke RiaMiranda Head Office Warehouse dengan nomor tiket penukaran.</p>
            </div>
            <div className="border border-line p-5">
              <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>LANGKAH 03</p>
              <h3 className="font-cormorant text-lg text-charcoal mb-1">Produk Pengganti</h3>
              <p className="text-xs text-muted">Produk ukuran baru dikirimkan atau dana dikembalikan (refund) dalam 2–3 hari kerja.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-line flex items-center justify-between">
          <span className="text-xs text-muted">Ingin konsultasi ukuran sebelum memesan kembali?</span>
          <Link
            to="/faq"
            className="nav-label text-xs text-caramel-deep hover:underline"
            style={{ fontSize: '10px', letterSpacing: '0.12em' }}
          >
            BACA FAQ PANDUAN →
          </Link>
        </div>
      </div>
    </div>
  );
}
