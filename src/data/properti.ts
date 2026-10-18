export type PropertyStatusType = 'Tersedia' | 'Sudah DP' | 'Sudah Ditempati';
export type PropertyCategoryType = 'Hotel' | 'Rumah' | 'Ruko' | 'Tanah';

export interface PropertyListing {
  id: string;
  name: string;
  type: PropertyCategoryType;
  location: string;
  priceFormatted: string;
  priceNumeric: number;
  priceType: 'sewa' | 'jual';
  status: PropertyStatusType;
  landArea: string; // luas tanah / bangunan
  bedrooms?: number;
  bathrooms?: number;
  imageSlots: [string, string, string];
  description: string;
  highlights: string[];
}

export const INITIAL_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-1',
    name: 'Boutique Hotel Dharmawangsa',
    type: 'Hotel',
    location: 'Kebayoran Baru, Jakarta Selatan',
    priceFormatted: 'Rp 1.850.000 / malam',
    priceNumeric: 1850000,
    priceType: 'sewa',
    status: 'Tersedia',
    landArea: 'Suite 65 m²',
    bedrooms: 1,
    bathrooms: 1,
    imageSlots: ['prop-1-1', 'prop-1-2', 'prop-1-3'],
    description: 'Akomodasi santun berarsitektur kolonial modern di kawasan hijau Jakarta Selatan. Menawarkan ketenangan privat, fasilitas musholla eksekutif, dan santapan halal berbintang.',
    highlights: ['Balkon Taman Privat', 'Kamar Mandi Marmer Italia', 'Akses Kolam Renang Tertutup', 'Sarapan Nusantara Autentik'],
  },
  {
    id: 'prop-2',
    name: 'Villa Asri Canggu Padang Linjong',
    type: 'Rumah',
    location: 'Canggu, Kuta Utara, Bali',
    priceFormatted: 'Rp 4.200.000 / malam',
    priceNumeric: 4200000,
    priceType: 'sewa',
    status: 'Sudah DP',
    landArea: 'LT 350 m² / LB 280 m²',
    bedrooms: 3,
    bathrooms: 3,
    imageSlots: ['prop-2-1', 'prop-2-2', 'prop-2-3'],
    description: 'Vila keluarga bernuansa tropis dengan kolam renang privat terlindung tirai hijau bambu. Didesain dengan prinsip privasi keluarga muslimah yang terjaga sempurna.',
    highlights: ['Kolam Renang Privat', 'Paviliun Kayu Jati Terbuka', '3 Kamar Tidur Ber-AC', 'Dapur Chef Lengkap'],
  },
  {
    id: 'prop-3',
    name: 'Ruko Galeri Komersial Senopati',
    type: 'Ruko',
    location: 'Jl. Senopati Raya, Jakarta Selatan',
    priceFormatted: 'Rp 14.500.000.000',
    priceNumeric: 14500000000,
    priceType: 'jual',
    status: 'Tersedia',
    landArea: 'LT 180 m² / LB 450 m²',
    imageSlots: ['prop-3-1', 'prop-3-2', 'prop-3-3'],
    description: 'Bangunan komersial 3 lantai dengan fasad kaca modern dan pencahayaan alami maksimal di episentrum gaya hidup Jakarta Selatan. Sangat ideal untuk butik busana, galeri seni, atau kantor kreatif.',
    highlights: ['Parkir Depan 6 Mobil', 'Lift Penumpang Privat', 'Sertifikat Hak Milik (SHM)', 'Listrik 33.000 VA'],
  },
  {
    id: 'prop-4',
    name: 'Rumah Santun Arsitektur Kemang',
    type: 'Rumah',
    location: 'Kemang Dalam, Jakarta Selatan',
    priceFormatted: 'Rp 8.750.000.000',
    priceNumeric: 8750000000,
    priceType: 'jual',
    status: 'Sudah Ditempati',
    landArea: 'LT 320 m² / LB 380 m²',
    bedrooms: 4,
    bathrooms: 4,
    imageSlots: ['prop-4-1', 'prop-4-2', 'prop-4-3'],
    description: 'Hunian dua lantai bernuansa hangat dengan halaman dalam (inner courtyard) yang menyejukkan. Ruang tamu terpisah menjaga kehormatan ruang keluarga inti.',
    highlights: ['Inner Courtyard Hijau', 'Dapur Bersih Marmer & Dapur Basah', 'Garasi 2 Mobil + Carport 2 Mobil', 'Keamanan 24 Jam Satu Gerbang'],
  },
  {
    id: 'prop-5',
    name: 'Tanah Tebing Sawah Ubud Valley',
    type: 'Tanah',
    location: 'Sayan, Ubud, Gianyar, Bali',
    priceFormatted: 'Rp 5.200.000.000',
    priceNumeric: 5200000000,
    priceType: 'jual',
    status: 'Tersedia',
    landArea: 'LT 1.200 m² (12 Are)',
    imageSlots: ['prop-5-1', 'prop-5-2', 'prop-5-3'],
    description: 'Kavling premium berkontur terasering menghadap langsung ke lembah sungai Ayung. Siap bangun untuk resor butik atau vila peristirahatan keluarga berizin pariwisata.',
    highlights: ['Pemandangan Lembah & Hutan Abadi', 'Akses Jalan Aspal 6 Meter', 'Zonasi Pariwisata W1', 'Sertifikat Hak Milik'],
  },
  {
    id: 'prop-6',
    name: 'Hotel Suites Penthouse Thamrin',
    type: 'Hotel',
    location: 'Jl. M.H. Thamrin, Jakarta Pusat',
    priceFormatted: 'Rp 2.950.000 / malam',
    priceNumeric: 2950000,
    priceType: 'sewa',
    status: 'Tersedia',
    landArea: 'Suite 92 m²',
    bedrooms: 2,
    bathrooms: 2,
    imageSlots: ['prop-6-1', 'prop-6-2', 'prop-6-3'],
    description: 'Suite eksekutif berlantai marmer di lantai atas gedung ikonik pusat ibu kota. Akses langsung menuju stasiun MRT dan pusat perbelanjaan ternama.',
    highlights: ['Pemandangan City Skyline Spektakuler', 'Butler Service 24 Jam', 'Ruang Rapat Privat Terintegrasi', 'Dapur Pantry Eksklusif'],
  },
];
