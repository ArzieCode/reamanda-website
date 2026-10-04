// ============================================================
// Mock Data — Properti & Hotel
// ============================================================
import type { Property, Bid } from '../types/properti';

function futureDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export const properties: Property[] = [
  {
    id: '1',
    name: 'HOTEL VILA BINTANG UBUD',
    type: 'Hotel',
    location: 'Ubud, Bali',
    area: 1200,
    startingPrice: 8500000000,
    currentBid: 8650000000,
    minimumIncrement: 50000000,
    status: 'tersedia',
    description:
      'Vila butik bergaya Bali klasik di jantung Ubud, dikelilingi sawah berteras dan hutan tropis. Terdiri dari 8 unit kamar dengan kolam renang pribadi, restoran, dan spa tradisional. Akses mudah ke pusat seni Ubud.',
    specs: {
      'Luas Tanah': '1.200 m²',
      'Luas Bangunan': '850 m²',
      'Jumlah Kamar': '8 unit',
      'Fasilitas': 'Kolam renang, Restoran, Spa, Parkir',
      'Sertifikat': 'HGB',
      'Tahun Dibangun': '2018',
    },
    auctionEnd: futureDate(7),
    images: [],
  },
  {
    id: '2',
    name: 'RUMAH TOWNHOUSE KEMANG',
    type: 'Rumah',
    location: 'Kemang, Jakarta Selatan',
    area: 320,
    startingPrice: 4200000000,
    currentBid: 4350000000,
    minimumIncrement: 50000000,
    status: 'dp',
    description:
      'Townhouse modern tiga lantai di kawasan Kemang yang prestisius. Desain kontemporer dengan sentuhan tropis, dilengkapi rooftop taman dan basement parkir dua mobil. Lokasi strategis dekat pusat bisnis dan hiburan.',
    specs: {
      'Luas Tanah': '200 m²',
      'Luas Bangunan': '320 m²',
      'Kamar Tidur': '4 kamar',
      'Kamar Mandi': '4 kamar mandi',
      'Fasilitas': 'Rooftop, Basement parkir, CCTV',
      'Sertifikat': 'SHM',
    },
    auctionEnd: futureDate(-2),
    images: [],
  },
  {
    id: '3',
    name: 'RUKO PREMIUM SUDIRMAN',
    type: 'Ruko',
    location: 'Sudirman, Jakarta Pusat',
    area: 180,
    startingPrice: 3100000000,
    currentBid: 3200000000,
    minimumIncrement: 50000000,
    status: 'tersedia',
    description:
      'Ruko empat lantai di koridor bisnis Sudirman dengan tampilan fasad modern. Cocok untuk kantor representatif, showroom, atau bisnis F&B. Akses langsung ke halte MRT dan jalan utama.',
    specs: {
      'Luas Tanah': '60 m²',
      'Luas Bangunan': '180 m²',
      'Jumlah Lantai': '4 lantai',
      'Fasilitas': 'Lift, AC central, CCTV',
      'Sertifikat': 'SHGB',
      'Kondisi': 'Semi furnished',
    },
    auctionEnd: futureDate(14),
    images: [],
  },
  {
    id: '4',
    name: 'VILLA TEPI SAWAH CANGGU',
    type: 'Hotel',
    location: 'Canggu, Bali',
    area: 850,
    startingPrice: 6750000000,
    currentBid: 6900000000,
    minimumIncrement: 50000000,
    status: 'ditempati',
    description:
      'Villa eksklusif dengan pemandangan sawah langsung, berlokasi di Canggu yang kini menjadi destinasi wisata terkemuka. Terdiri dari 5 unit villa dengan private pool masing-masing. Saat ini beroperasi penuh dengan tingkat hunian tinggi.',
    specs: {
      'Luas Tanah': '850 m²',
      'Luas Bangunan': '600 m²',
      'Jumlah Unit': '5 villa',
      'Fasilitas': 'Private pool per unit, Dapur bersama, Taman',
      'Sertifikat': 'HGB',
      'Tahun Dibangun': '2020',
    },
    auctionEnd: futureDate(-5),
    images: [],
  },
  {
    id: '5',
    name: 'RUMAH ASRI PONDOK INDAH',
    type: 'Rumah',
    location: 'Pondok Indah, Jakarta Selatan',
    area: 450,
    startingPrice: 7900000000,
    currentBid: 8050000000,
    minimumIncrement: 50000000,
    status: 'dp',
    description:
      'Rumah mewah satu lantai dengan taman luas di kompleks eksklusif Pondok Indah. Desain arsitektur klasik Eropa dengan material premium. Lingkungan tenang, keamanan 24 jam, dekat sekolah internasional dan pusat perbelanjaan.',
    specs: {
      'Luas Tanah': '600 m²',
      'Luas Bangunan': '450 m²',
      'Kamar Tidur': '5 kamar',
      'Kamar Mandi': '5 kamar mandi',
      'Fasilitas': 'Kolam renang, Taman, Garasi 3 mobil, Ruang ART',
      'Sertifikat': 'SHM',
    },
    auctionEnd: futureDate(-1),
    images: [],
  },
  {
    id: '6',
    name: 'TANAH KAVLING BINTARO',
    type: 'Tanah',
    location: 'Bintaro Jaya, Tangerang Selatan',
    area: 600,
    startingPrice: 2800000000,
    currentBid: 2900000000,
    minimumIncrement: 50000000,
    status: 'tersedia',
    description:
      'Kavling strategis di kawasan Bintaro Jaya sektor 9, siap bangun. Lokasi hook di jalan utama, cocok untuk pembangunan hunian mewah atau properti komersial. Infrastruktur lengkap, lingkungan mapan.',
    specs: {
      'Luas Tanah': '600 m²',
      'Dimensi': '20 × 30 m',
      'Posisi': 'Hook / Sudut',
      'Kontur': 'Datar',
      'Sertifikat': 'SHM',
      'Zonasi': 'Perumahan',
    },
    auctionEnd: futureDate(21),
    images: [],
  },
];

export const initialBids: Bid[] = [
  {
    id: 'b1',
    propertyId: '1',
    bidderName: 'H***i',
    amount: 8650000000,
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: 'b2',
    propertyId: '1',
    bidderName: 'A***n',
    amount: 8600000000,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'b3',
    propertyId: '1',
    bidderName: 'S***i',
    amount: 8550000000,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'b4',
    propertyId: '2',
    bidderName: 'R***a',
    amount: 4350000000,
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 'b5',
    propertyId: '3',
    bidderName: 'D***o',
    amount: 3200000000,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'b6',
    propertyId: '6',
    bidderName: 'M***i',
    amount: 2900000000,
    timestamp: new Date(Date.now() - 900000),
  },
];
