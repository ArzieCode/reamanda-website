// ============================================================
// Page — Syarat & Ketentuan (/syarat-ketentuan)
// General terms of service, payment, auction bidding rules
// ============================================================
export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        KETENTUAN LAYANAN
      </p>
      <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-8 leading-tight">
        Syarat & Ketentuan
      </h1>

      <div className="space-y-8 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.85 }}>
        <p>
          Selamat datang di platform resmi RiaMiranda. Dengan mengakses situs web ini serta melakukan transaksi belanja busana, keikutsertaan lelang properti, atau reservasi katering, Anda menyetujui syarat dan ketentuan berikut.
        </p>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            1. Transaksi Belanja Busana Muslimah
          </h2>
          <p className="text-muted leading-relaxed">
            Harga yang tertera pada produk busana adalah harga final dalam mata uang Rupiah (IDR) atau mata uang yang dikonversikan melalui selektor situs. Ketersediaan stok produk bersifat langsung (*real-time*). Pesanan yang belum diselesaikan pembayarannya dalam kurun waktu 2 jam akan otomatis dibatalkan sistem.
          </p>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            2. Aturan & Kode Etik Lelang Properti
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>Penawar wajib memiliki akun terverifikasi dan berusia minimal 21 tahun atau telah cakap hukum.</li>
            <li>Setiap penawaran lelang yang diajukan bersifat mengikat dan tidak dapat dibatalkan sepihak.</li>
            <li>Nilai penawaran harus memenuhi kelipatan kenaikan minimum yang telah ditentukan untuk masing-masing unit aset.</li>
            <li>Pemenang lelang dengan penawaran tertinggi saat batas waktu berakhir wajib membayar uang muka (DP) minimal 10% dalam 3 hari kerja sebelum penandatanganan PPJB di hadapan Notaris.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            3. Ketentuan Layanan Katering
          </h2>
          <p className="text-muted leading-relaxed">
            Pemesanan katering membutuhkan konfirmasi ketersediaan tanggal acara dari konsultan katering RiaMiranda. Pembayaran uang muka 50% dilakukan saat *final booking*, dan sisa pelunasan diselesaikan selambatnya 7 hari kalender sebelum hari pelaksanaan acara.
          </p>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            4. Hak Cipta & Kekayaan Intelektual
          </h2>
          <p className="text-muted leading-relaxed">
            Seluruh motif cetak kain (*pattern print*), tipografi, gambar, dan nama koleksi (termasuk LUMINARA dan TERRA) dilindungi oleh undang-undang hak cipta Republik Indonesia. Dilarang keras meniru atau memperbanyak motif busana RiaMiranda tanpa izin tertulis dari manajemen PT Miranda Mode Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
