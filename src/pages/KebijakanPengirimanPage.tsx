// ============================================================
// Page — Kebijakan Pengiriman (/kebijakan-pengiriman)
// Delivery coverage, courier options, tracking and SLA
// ============================================================
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

export default function KebijakanPengirimanPage() {
  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        LAYANAN PELANGGAN
      </p>
      <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-8 leading-tight">
        Kebijakan Pengiriman
      </h1>

      <div className="space-y-10 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.85 }}>
        <p>
          RiaMiranda berkomitmen menghadirkan pengalaman berbelanja yang tenang dan terpercaya. Kami memastikan setiap busana dan produk dikemas dengan standar kebersihan tinggi dan dikirimkan menggunakan mitra logistik resmi terpercaya.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-line py-8">
          <div>
            <Truck size={20} color="var(--caramel-deep)" className="mb-2" />
            <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>GRATIS ONGKIR</p>
            <p className="text-xs text-muted">Untuk transaksi busana di atas Rp 500.000 ke seluruh Indonesia.</p>
          </div>
          <div>
            <Clock size={20} color="var(--caramel-deep)" className="mb-2" />
            <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>PENGIRIMAN CEPAT</p>
            <p className="text-xs text-muted">Pesanan sebelum pukul 15.00 WIB dikirim pada hari kerja yang sama.</p>
          </div>
          <div>
            <ShieldCheck size={20} color="var(--caramel-deep)" className="mb-2" />
            <p className="nav-label text-charcoal mb-1" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>ASURANSI PENUH</p>
            <p className="text-xs text-muted">Semua paket terlindungi dari risiko hilang atau rusak selama transit.</p>
          </div>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            Mitra Ekspedisi & Estimasi Waktu
          </h2>
          <p className="mb-4">
            Kami bermitra dengan ekspedisi resmi terkemuka:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li><strong>JNE Express (Reguler & YES):</strong> Estimasi 1–3 hari kerja untuk kota besar, 3–5 hari untuk wilayah kepulauan.</li>
            <li><strong>SiCepat Ekspres (BEST & Reguler):</strong> Estimasi 1–2 hari kerja untuk Pulau Jawa dan Bali.</li>
            <li><strong>Paxel (Sameday Delivery):</strong> Pengiriman khusus hari yang sama untuk area Jabodetabek, Bandung, dan Surabaya.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            Pelacakan Resi Pengiriman
          </h2>
          <p>
            Nomor resi pengiriman otomatis diperbarui dan dikirimkan melalui email serta tercantum pada menu <Link to="/akun/pesanan" className="text-caramel-deep underline">Riwayat Pesanan</Link> di akun Anda segera setelah kurir memindai paket di fasilitas logistik kami.
          </p>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            Pengiriman Internasional
          </h2>
          <p>
            Untuk pelanggan di Malaysia, Singapura, dan Brunei Darussalam, pengiriman dilayani melalui DHL Express dan Pos Indonesia EMS dengan estimasi 3–7 hari kerja. Bea masuk dan pajak kepabeanan lokal menjadi tanggung jawab penerima.
          </p>
        </div>

        <div className="pt-6 border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted">
            <HelpCircle size={15} />
            <span>Butuh bantuan pengiriman khusus? Hubungi tim logistik kami.</span>
          </div>
          <Link
            to="/kontak"
            className="nav-label text-xs text-caramel-deep hover:underline"
            style={{ fontSize: '10px', letterSpacing: '0.12em' }}
          >
            HUBUNGI KAMI →
          </Link>
        </div>
      </div>
    </div>
  );
}
