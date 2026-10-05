// ============================================================
// Page — Cara Pemesanan (/cara-pemesanan)
// Guide for busana, properti, and katering ordering workflows
// ============================================================
import { Link } from 'react-router-dom';
import { ShoppingBag, Gavel, Utensils } from 'lucide-react';

export default function CaraPemesananPage() {
  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        PANDUAN LENGKAP
      </p>
      <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-8 leading-tight">
        Cara Pemesanan & Transaksi
      </h1>

      <p className="text-sm font-light text-muted leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px' }}>
        RiaMiranda menyediakan alur pemesanan yang sederhana, aman, dan transparan untuk seluruh lini bisnis kami. Silakan pilih kategori panduan yang ingin Anda ketahui:
      </p>

      <div className="space-y-12">
        {/* 1. Busana */}
        <div className="border border-line bg-surface p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <ShoppingBag size={20} color="var(--caramel-deep)" />
            <h2 className="font-cormorant font-light text-2xl text-charcoal">
              1. Belanja Busana Muslimah
            </h2>
          </div>
          <ol className="list-decimal pl-5 space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            <li>Pilih busana yang Anda sukai dari menu <Link to="/busana" className="text-charcoal font-medium underline">Busana</Link> atau filter berdasarkan koleksi.</li>
            <li>Buka halaman rincian produk, pilih ukuran (*size*) serta varian warna yang diinginkan.</li>
            <li>Klik tombol <strong>+ TAMBAH KE KERANJANG</strong> atau <strong>BELI SEKARANG</strong> untuk langsung menuju pembayaran.</li>
            <li>Gunakan kode voucher promo jika tersedia (misalnya: <code>RIAFIRST</code> untuk gratis ongkir).</li>
            <li>Isi formulir alamat pengiriman dan selesaikan transaksi dengan QRIS, Bank Transfer, atau Kartu Kredit.</li>
          </ol>
        </div>

        {/* 2. Properti */}
        <div className="border border-line bg-surface p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <Gavel size={20} color="var(--indigo-brand)" />
            <h2 className="font-cormorant font-light text-2xl text-charcoal">
              2. Mengikuti Lelang Properti
            </h2>
          </div>
          <ol className="list-decimal pl-5 space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            <li>Masuk ke akun Anda atau lakukan pendaftaran cepat pada tab <Link to="/properti" className="text-charcoal font-medium underline">Properti</Link>.</li>
            <li>Kaji informasi sertifikat, luas tanah, dan spesifikasi bangunan pada halaman rincian aset.</li>
            <li>Anda dapat menekan tombol <strong>JADWALKAN KUNJUNGAN</strong> untuk melakukan survei lokasi langsung didampingi tim kami.</li>
            <li>Masukkan nilai tawaran yang lebih tinggi dari penawaran tertinggi saat ini ditambah kelipatan minimal.</li>
            <li>Jika lelang selesai dan Anda menjadi penawar tertinggi, tim legal kami akan segera memproses verifikasi berkas PPJB.</li>
          </ol>
        </div>

        {/* 3. Katering */}
        <div className="border border-line bg-surface p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <Utensils size={20} color="var(--caramel-deep)" />
            <h2 className="font-cormorant font-light text-2xl text-charcoal">
              3. Pemesanan Paket Katering
            </h2>
          </div>
          <ol className="list-decimal pl-5 space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            <li>Telusuri varian paket unggulan pada halaman <Link to="/katering" className="text-charcoal font-medium underline">Katering</Link>.</li>
            <li>Klik paket untuk melihat daftar menu lengkap (*inclusions*) dan minimal jumlah porsi.</li>
            <li>Isi <strong>Formulir Konsultasi</strong> dengan tanggal acara dan estimasi jumlah tamu, atau tekan <strong>CHAT VIA WHATSAPP</strong> untuk penawaran langsung.</li>
            <li>Tim perjamuan kami akan menyusun rincian jadwal penyajian dan uji rasa (*food tasting*).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
