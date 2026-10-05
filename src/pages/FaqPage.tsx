// ============================================================
// Page — FAQ (Pertanyaan yang Sering Diajukan) (/faq)
// Categorized accordions: Busana, Properti, Katering, Pembayaran
// ============================================================
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItemData {
  q: string;
  a: string;
}

const FAQ_SECTIONS: { category: string; items: FaqItemData[] }[] = [
  {
    category: 'BUSANA & PEMESANAN ONLINE',
    items: [
      {
        q: 'Bagaimana cara mengetahui ukuran busana yang tepat?',
        a: 'Setiap halaman produk dilengkapi dengan tombol "Panduan Ukuran" yang merinci lingkar dada, panjang badan, dan panjang lengan dalam satuan sentimeter. Anda juga dapat berkonsultasi dengan tim CS kami jika ragu.',
      },
      {
        q: 'Apakah warna produk di foto 100% sama dengan aslinya?',
        a: 'Kami mengupayakan reproduksi warna seakurat mungkin di layar dengan pencahayaan studio alami. Namun, perbedaan resolusi dan kalibrasi layar perangkat Anda dapat menyebabkan sedikit variasi rona warna.',
      },
      {
        q: 'Berapa lama proses pengiriman pesanan busana?',
        a: 'Pesanan yang terkonfirmasi sebelum pukul 14.00 WIB dikirim pada hari kerja yang sama. Estimasi waktu tiba untuk Jabodetabek adalah 1-2 hari kerja, dan kota lain di Indonesia 2-4 hari kerja.',
      },
    ],
  },
  {
    category: 'LELANG PROPERTI & HOTEL',
    items: [
      {
        q: 'Bagaimana mekanisme lelang properti di RiaMiranda?',
        a: 'Lelang diselenggarakan secara daring transparan. Calon pembeli wajib masuk ke akun resmi untuk mengajukan penawaran yang melebihi penawaran tertinggi saat ini ditambah kelipatan minimum yang ditentukan.',
      },
      {
        q: 'Apakah calon peserta lelang dapat melakukan survei lokasi?',
        a: 'Tentu. Anda dapat mengklik tombol "Jadwalkan Kunjungan" pada halaman detail properti untuk menentukan tanggal dan jam survei dengan didampingi konsultan properti kami.',
      },
      {
        q: 'Apa yang dimaksud dengan status Sudah DP dan Ditempati?',
        a: 'Status "Sudah DP" menandakan bahwa pemenang lelang sedang dalam tahap penyelesaian uang muka sehingga penawaran ditutup. Status "Sudah Ditempati" menandakan transaksi telah tuntas dan properti telah diserahterimakan.',
      },
    ],
  },
  {
    category: 'LAYANAN KATERING',
    items: [
      {
        q: 'Berapa batas minimal pemesanan nasi box dan prasmanan?',
        a: 'Minimal pemesanan nasi box adalah 50 porsi, dan paket prasmanan adalah 100 porsi. Untuk pesanan khusus skala keluarga di bawah batas minimal, silakan konsultasikan via WhatsApp.',
      },
      {
        q: 'Apakah semua hidangan dijamin halal?',
        a: 'Seluruh bahan baku, bumbu, hingga peralatan dapur katering RiaMiranda telah memenuhi sertifikasi halal resmi dan standar kebersihan tertinggi.',
      },
      {
        q: 'Kapan batas waktu pelunasan pemesanan katering?',
        a: 'Uang muka (DP) sebesar 50% dibayarkan saat konfirmasi tanggal, dan pelunasan wajib diselesaikan paling lambat H-3 sebelum tanggal pelaksanaan acara.',
      },
    ],
  },
  {
    category: 'PEMBAYARAN, RETUR, & PRIVASI',
    items: [
      {
        q: 'Metode pembayaran apa saja yang didukung?',
        a: 'Kami menerima QRIS (GoPay, OVO, ShopeePay, BCA, dll), Virtual Account BCA, Mandiri, BRI, BNI, serta Kartu Kredit/Debit berlogo Visa dan Mastercard.',
      },
      {
        q: 'Bagaimana ketentuan penukaran dan retur produk?',
        a: 'Retur atau penukaran ukuran diperkenankan dalam waktu 14 hari sejak barang diterima, dengan syarat tag label masih terpasang rapi, pakaian belum dicuci, dan tidak rusak.',
      },
    ],
  },
];

function FaqRow({ item }: { item: FaqItemData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left hover:opacity-75 transition-opacity focus-visible:outline-none"
      >
        <span className="font-light text-charcoal pr-4" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px' }}>
          {item.q}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.25}
          color="var(--caramel-deep)"
          className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', lineHeight: 1.8 }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          PUSAT BANTUAN
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-sm font-light text-muted mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          Temukan jawaban cepat seputar pemesanan busana, lelang properti, layanan katering, dan kebijakan garansi.
        </p>
      </div>

      <div className="space-y-12 max-w-3xl">
        {FAQ_SECTIONS.map((sec) => (
          <div key={sec.category} className="border-t-2 border-charcoal pt-6">
            <h2 className="nav-label text-charcoal font-medium mb-4" style={{ fontSize: '12px', letterSpacing: '0.16em' }}>
              {sec.category}
            </h2>
            <div>
              {sec.items.map((item, idx) => (
                <FaqRow key={idx} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
