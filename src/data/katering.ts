// ============================================================
// Mock Data — Katering RiaMiranda
// Packages, FAQs, Menu Items
// ============================================================

export interface CateringPackage {
  id: string;
  name: string;
  price: number;
  startingPrice: number;
  unit: string;
  minOrder: number;
  minimumOrder: number;
  minUnit: string;
  minimumUnit: string;
  inclusions: string[];
  description: string;
}

export const packages: CateringPackage[] = [
  {
    id: 'pkg-1',
    name: 'Paket Prasmanan Nusantara',
    price: 85000,
    startingPrice: 85000,
    unit: 'porsi',
    minOrder: 100,
    minimumOrder: 100,
    minUnit: 'porsi',
    minimumUnit: 'porsi',
    description: 'Menu prasmanan lengkap dengan resep masakan tradisional Padang dan Jawa pilihan terbaik.',
    inclusions: [
      'Nasi Putih Pandan Wangi & Nasi Liwet Gurih',
      'Rendang Daging Sapi Dapur RiaMiranda',
      'Ayam Bakar Madu / Ayam Goreng Lengkuas',
      'Sambal Goreng Ati Kentang Kapri',
      'Sup Kimlo Pengantin Segar',
      'Kerupuk Udang, Sambal Bajak, Lalapan',
      'Puding Karamel, Buah Potong Segar, Es Dawet',
      'Meja buffet dekorasi kain tenun & peralatan saji lengkap',
    ],
  },
  {
    id: 'pkg-2',
    name: 'Paket Tumpeng Mini Syukuran',
    price: 55000,
    startingPrice: 55000,
    unit: 'pax',
    minOrder: 30,
    minimumOrder: 30,
    minUnit: 'pax',
    minimumUnit: 'pax',
    description: 'Sajian tumpeng mini personal yang higienis dalam kemasan estetik eksklusif RiaMiranda.',
    inclusions: [
      'Nasi Kuning Harum Gurih Beras Organik',
      'Ayam Suwir Pedas Manis / Empal Daging',
      'Telur Balado & Orek Tempe Manis',
      'Urap Sayuran Bumbu Kelapa Gurih',
      'Perkedel Kentang Lembut',
      'Sambal Goreng & Serundeng Kelapa',
      'Kemasan Mika Elegan dengan Sendok Kayu & Kartu Ucapan',
    ],
  },
  {
    id: 'pkg-3',
    name: 'Paket Resepsi Pernikahan Megah',
    price: 135000,
    startingPrice: 135000,
    unit: 'porsi',
    minOrder: 300,
    minimumOrder: 300,
    minUnit: 'porsi',
    minimumUnit: 'porsi',
    description: 'Solusi perjamuan pernikahan komprehensif mencakup hidangan utama buffet dan gubukan favorit.',
    inclusions: [
      'Buffet Utama 8 Varian Menu Premium',
      'Stall Kambing Guling Bumbu Kecap Pedas (2 ekor)',
      'Stall Siomay Bandung & Bakwan Malang Asli',
      'Stall Zuppa Soup Hangat',
      'Dessert Corner: Puding Sutra, Mini Cakes, Es Kopyor',
      'Pelayanan Pramusaji Berseragam Rapi & Protokol Kebersihan',
      'Uji Rasa (Food Tasting) untuk 6 Orang Keluarga',
    ],
  },
];

export const faqs = [
  {
    q: 'Berapa hari minimal pemesanan dilakukan sebelum acara?',
    a: 'Untuk paket tumpeng mini dan nasi box minimal 3 hari sebelum acara. Untuk acara pernikahan dan perjamuan besar di atas 300 porsi, kami menyarankan pemesanan 1–3 bulan sebelumnya untuk memastikan ketersediaan tanggal dan jadwal food tasting.',
  },
  {
    q: 'Apakah semua makanan RiaMiranda Katering dijamin halal?',
    a: 'Seluruh bahan baku, daging sapi, ayam, dan bumbu dapur kami bersertifikasi halal 100% dari MUI dan diproses di dapur sentral yang bersih dan memenuhi standar higienitas BPOM.',
  },
  {
    q: 'Apakah bisa melakukan penyesuaian (custom) menu?',
    a: 'Tentu. Tim konsultan kami dengan senang hati membantu menyesuaikan variasi menu sesuai selera keluarga, kebutuhan vegetarian, atau pantangan alergi tamu undangan.',
  },
  {
    q: 'Bagaimana sistem pembayaran dan pelunasannya?',
    a: 'Pembayaran DP sebesar 30% dilakukan saat konfirmasi pemesanan, 40% setelah sesi food tasting, dan sisa pelunasan diselesaikan selambatnya H-7 sebelum hari pelaksanaan acara.',
  },
];

export const menuItems = [
  { name: 'Rendang Sapi Dapur RiaMiranda', ratio: '4/3' },
  { name: 'Ayam Goreng Lengkuas Rempah', ratio: '3/4' },
  { name: 'Tumpeng Mini Estetik Eksklusif', ratio: '1/1' },
  { name: 'Sup Kimlo Kaldu Ayam Kampung', ratio: '4/3' },
  { name: 'Sate Lilit Ikan Tenggiri Khas Bali', ratio: '3/4' },
  { name: 'Aneka Dessert Sutra & Buah Segar', ratio: '1/1' },
];
