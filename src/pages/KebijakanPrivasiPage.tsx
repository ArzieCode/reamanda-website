// ============================================================
// Page — Kebijakan Privasi (/kebijakan-privasi)
// Customer privacy, data usage, security protocols
// ============================================================
export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-8 py-12 md:py-20 pb-28 md:pb-36">
      <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        PERLINDUNGAN DATA
      </p>
      <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-8 leading-tight">
        Kebijakan Privasi
      </h1>

      <div className="space-y-8 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.85 }}>
        <p>
          RiaMiranda (PT Miranda Mode Indonesia) menghargai kepercayaan Anda dan berkomitmen menjaga kerahasiaan seluruh data pribadi yang Anda percayakan kepada kami, sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) Republik Indonesia.
        </p>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-muted mb-2">
            Kami mengumpulkan data yang Anda berikan secara sukarela saat:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>Membuat akun member RiaMiranda Privilege (nama, email, nomor telepon).</li>
            <li>Melakukan transaksi checkout (alamat pengiriman, pilihan kurir, preferensi pembayaran).</li>
            <li>Mengajukan penawaran lelang properti atau formulir reservasi kunjungan survei.</li>
            <li>Mengirimkan konsultasi menu katering atau berlangganan buletin berkala.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            2. Penggunaan Informasi
          </h2>
          <p className="text-muted leading-relaxed">
            Data pribadi Anda hanya digunakan untuk keperluan pemrosesan pesanan, pengiriman paket fisik, verifikasi identitas penawar lelang properti, komunikasi pelayanan pelanggan, dan pengiriman informasi promo eksklusif apabila Anda telah memberikan persetujuan berlangganan.
          </p>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            3. Keamanan Data & Pihak Ketiga
          </h2>
          <p className="text-muted leading-relaxed">
            Kami tidak pernah menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak luar yang tidak terafiliasi. Kerjasama dengan mitra logistik (JNE, SiCepat, Paxel) dan penyedia saluran pembayaran (Bank Transfer, QRIS) dilakukan melalui protokol terenkripsi SSL 256-bit standar industri perbankan.
          </p>
        </div>

        <div>
          <h2 className="font-cormorant font-light text-2xl text-charcoal mb-3">
            4. Hak Pengguna
          </h2>
          <p className="text-muted leading-relaxed">
            Anda berhak mengakses, memperbarui, atau mengajukan permohonan penghapusan riwayat akun dan data kontak Anda kapan pun melalui pengaturan akun atau menghubungi tim kepatuhan data kami di privasi@riamiranda.com.
          </p>
        </div>

        <p className="text-xs text-muted pt-6 border-t border-line">
          Terakhir diperbarui: 1 Oktober 2024 · PT Miranda Mode Indonesia
        </p>
      </div>
    </div>
  );
}
