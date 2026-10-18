export interface KateringPackageItem {
  id: string;
  name: string;
  tagline: string;
  startingPrice: string;
  minOrder: string;
  imageSlot: string;
  description: string;
  menuHighlights: string[];
  servicesIncluded: string[];
}

export interface KateringDishItem {
  id: string;
  name: string;
  category: 'Nasi' | 'Lauk Utama' | 'Pelengkap' | 'Penutup' | 'Kudapan';
  paxInfo: string;
  pricePerPax: number;
  imageSlot: string;
  description: string;
}

export const INITIAL_KATERING_PACKAGES: KateringPackageItem[] = [
  {
    id: 'pkg-1',
    name: 'Paket Pernikahan & Resepsi Santun',
    tagline: 'Perjamuan agung dengan tata meja adat dan sajian prasmanan berkelas',
    startingPrice: 'Mulai Rp 185.000 / pax',
    minOrder: 'Minimal 200 pax',
    imageSlot: 'pkg-nikah',
    description: 'Menyajikan kekayaan bumbu rempah Nusantara dalam konsep buffet ramah tamu. Dilengkapi stall kuliner khas Minang dan Jawa serta tim pramusaji berseragam santun.',
    menuHighlights: [
      'Nasi Pandan Wangi & Nasi Minang',
      'Rendang Daging Sapi 8 Jam Payakumbuh',
      'Ayam Panggang Bumbu Rujak Kenari',
      'Kakap Merah Saus Asam Padeh',
      'Sup Kimlo Pengantin Sari Laut',
      'Stall Kambing Guling & Sate Padang',
      'Pondokan Es Doger & Puding Mutiara',
    ],
    servicesIncluded: [
      'Dekorasi meja prasmanan bunga segar',
      'Peralatan makan porselen premium & pemanas chafing dish tembaga',
      'Pramusaji terlatih & kapten acara berseragam',
      'Test food gratis untuk 4 orang setelah DP',
    ],
  },
  {
    id: 'pkg-2',
    name: 'Paket Jamuan Korporat & Seminar',
    tagline: 'Solusi sajian bento box higienis & coffee break berkelas eksekutif',
    startingPrice: 'Mulai Rp 75.000 / bento',
    minOrder: 'Minimal 30 box / pax',
    imageSlot: 'pkg-korporat',
    description: 'Pilihan tepat untuk rapat direksi, peluncuran produk, konferensi kerja, atau seminar. Dikemas dalam box bento ramah lingkungan bersegel higienis dengan ketepatan waktu tinggi.',
    menuHighlights: [
      'Nasi Liwet Beras Organik Cianjur',
      'Empal Daging Serundeng Gurih Manis',
      'Ayam Bakar Madu Kalasan Lembut',
      'Tumis Buncis Daging Cincang XO Halal',
      'Tahu Tempe Bacem Gula Kelapa',
      'Sambal Bajak & Kerupuk Udang Renyah',
      'Buah Potong Segar & Air Mineral',
    ],
    servicesIncluded: [
      'Pengemasan bento eco-friendly bersendok kayu',
      'Pengantaran tepat waktu dengan thermal box khusus',
      'Pilihan menu khusus vegetarian / diet tertentu',
      'Invoice resmi & faktur pajak korporasi',
    ],
  },
  {
    id: 'pkg-3',
    name: 'Paket Hantaran & Syukuran Aqiqah',
    tagline: 'Simbol rasa syukur keluarga dalam tampah bambu dan besek anyaman',
    startingPrice: 'Mulai Rp 850.000 / tampah',
    minOrder: 'Minimal 1 tampah / 15 porsi',
    imageSlot: 'pkg-hantaran',
    description: 'Dirancang khusus untuk momen syukuran rumah baru, kelahiran aqiqah, wisuda keluarga, atau hantaran lamaran berhias pita satin dan kartu ucapan kustom bertuliskan kaligrafi indah.',
    menuHighlights: [
      'Nasi Tumpeng Kuning Gurih Beras Pandan Wangi',
      'Ayam Goreng Lengkuas Rempah Desa',
      'Sambal Goreng Hati Kentang Balado',
      'Perkedel Kentang Daging Sapi Cincang',
      'Telur Balado Rawit Manis',
      'Urap Sayur Bumbu Kelapa Sangrai',
      'Kering Tempe Teri Kacang Gurih',
    ],
    servicesIncluded: [
      'Wadah tampah bambu anyaman tangan tradisional',
      'Hiasan sayur artistik (garnish bunga wortel & lobak)',
      'Kartu ucapan kaligrafi dengan nama keluarga',
      'Pisau pemotong tumpeng hias khusus',
    ],
  },
];

export const INITIAL_KATERING_DISHES: KateringDishItem[] = [
  {
    id: 'dish-1',
    name: 'Nasi Kotak Eksekutif Nusantara',
    category: 'Nasi',
    paxInfo: '1 Porsi Lengkap',
    pricePerPax: 75000,
    imageSlot: 'dish-1',
    description: 'Nasi putih pandan wangi, ayam bakar bumbu rujak, dendeng batokok balado, sayur kapau, sambal hijau, dan kerupuk kulit.',
  },
  {
    id: 'dish-2',
    name: 'Tumpeng Kuning Berkah Rempah',
    category: 'Nasi',
    paxInfo: 'Porsi 15–20 Pax',
    pricePerPax: 950000,
    imageSlot: 'dish-2',
    description: 'Tumpeng kuning kerucut dari kunyit parut asli santan kelapa murni, dikelilingi 7 lauk pauk lambang kelimpahan berkah.',
  },
  {
    id: 'dish-3',
    name: 'Rendang Sapi Payakumbuh 8 Jam',
    category: 'Lauk Utama',
    paxInfo: '1 Kilogram (± 20 potong)',
    pricePerPax: 380000,
    imageSlot: 'dish-3',
    description: 'Daging sapi bagian gandik pilihan dimasak perlahan di atas tungku kayu selama 8 jam hingga bumbu meresap hitam pekat tanpa bahan pengawet.',
  },
  {
    id: 'dish-4',
    name: 'Ayam Bakar Madu Kelapa Parut',
    category: 'Lauk Utama',
    paxInfo: '1 Ekor Utuh (4 potong besar)',
    pricePerPax: 145000,
    imageSlot: 'dish-4',
    description: 'Ayam pejantan segar diungkep bumbu rempah ketumbar dan madu hutan sumatra, dibakar arang batok kelapa beraroma asap harum.',
  },
  {
    id: 'dish-5',
    name: 'Sate Ayam Madura Bumbu Kacang',
    category: 'Lauk Utama',
    paxInfo: '50 Tusuk',
    pricePerPax: 225000,
    imageSlot: 'dish-5',
    description: 'Daging dada ayam tanpa kulit dipanggang empuk dengan saus kacang sangrai halus bumbu petis manis, acar mentimun, dan cabai rawit.',
  },
  {
    id: 'dish-6',
    name: 'Sambal Terasi Ulek & Lalapan Petik',
    category: 'Pelengkap',
    paxInfo: 'Porsi 10 Orang',
    pricePerPax: 85000,
    imageSlot: 'dish-6',
    description: 'Sambal terasi sangrai diulek tangan di cobek batu dengan tomat segar, daun kemangi petik, terung gelatik, timun, dan selada air.',
  },
  {
    id: 'dish-7',
    name: 'Es Campur Buah Sirup Gula Aren',
    category: 'Penutup',
    paxInfo: 'Porsi 15 Gelas',
    pricePerPax: 195000,
    imageSlot: 'dish-7',
    description: 'Perpaduan kelapa muda serut, nangka manis, alpukat mentega, kolang-kaling pandan, dan sirup gula aren organik santan peras murni.',
  },
  {
    id: 'dish-8',
    name: 'Kue Basah Tampah Bambu Klasik',
    category: 'Kudapan',
    paxInfo: 'Isi 40 Pcs Aneka Kue',
    pricePerPax: 285000,
    imageSlot: 'dish-8',
    description: 'Kue talam pandan, lemper ayam bakar, dadar gulung kelapa, putri mandi, dan bika ambon mini tersaji di nampan anyaman bambu berhias janur.',
  },
];
