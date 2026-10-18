export interface BusanaProduct {
  id: string;
  name: string;
  category: 'Hijab' | 'Blouse' | 'Tunik' | 'Abaya' | 'Scarf' | 'Gaun' | 'Outerwear' | 'Mukena';
  collection: string;
  price: number;
  salePrice?: number;
  isSale: boolean;
  isNewArrival: boolean;
  imageSlot1: string;
  imageSlot2: string;
  sizes: string[];
  colors: string[];
  description: string;
  material: string;
  care: string;
}

export const INITIAL_BUSANA_PRODUCTS: BusanaProduct[] = [
  {
    id: 'b-1',
    name: 'Hijab Voal Aruna Monogram',
    category: 'Hijab',
    collection: 'Senja Jakarta',
    price: 285000,
    salePrice: 235000,
    isSale: true,
    isNewArrival: true,
    imageSlot1: 'prod-1-1',
    imageSlot2: 'prod-1-2',
    sizes: ['All Size (115x115)'],
    colors: ['Pasir Hangat', 'Abu Lembut', 'Mawar Teduh'],
    description: 'Hijab voal premium bertekstur lembut dengan cetakan motif monogram songket eksklusif Rea Manda. Tegak di dahi dan sejuk sepanjang hari.',
    material: '100% Ultrafine Voal Breathable',
    care: 'Cuci tangan lembut tanpa pemutih, setrika suhu rendah.',
  },
  {
    id: 'b-2',
    name: 'Blouse Seruni Sutra Katun',
    category: 'Blouse',
    collection: 'Keseharian Esensial',
    price: 495000,
    isSale: false,
    isNewArrival: true,
    imageSlot1: 'prod-2-1',
    imageSlot2: 'prod-2-2',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Krem Gandum', 'Cokelat Kayu'],
    description: 'Atasan berkerah shanghai santun dengan sentuhan plisket vertikal dan kancing bungkus senada.',
    material: 'Katun Sutra Bordir Microfiber',
    care: 'Cuci dengan warna senada, jemur terlindung sinar matahari langsung.',
  },
  {
    id: 'b-3',
    name: 'Tunik Malika Asimetris Linen',
    category: 'Tunik',
    collection: 'Warisan Minang',
    price: 585000,
    isSale: false,
    isNewArrival: false,
    imageSlot1: 'prod-3-1',
    imageSlot2: 'prod-3-2',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Zaitun Teduh', 'Pasir Pantai'],
    description: 'Tunik panjang dengan siluet A-line anggun, belahan samping santun, dan detail bordir benang perak khas Ranah Minang.',
    material: 'Linen Slub Premium Halus',
    care: 'Gunakan detergen cair ramah serat, setrika saat agak lembap.',
  },
  {
    id: 'b-4',
    name: 'Abaya Nura Lipit Anggun',
    category: 'Abaya',
    collection: 'Senja Jakarta',
    price: 895000,
    salePrice: 760000,
    isSale: true,
    isNewArrival: false,
    imageSlot1: 'prod-4-1',
    imageSlot2: 'prod-4-2',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal Teduh', 'Krem Karamel'],
    description: 'Abaya potongan longgar tanpa sambungan bahu, dilengkapi aksen lipit arsitektural dan ritsleting depan wudhu-friendly.',
    material: 'Crepe Dior Flowy Ringan',
    care: 'Cuci dry clean atau putaran halus tangan.',
  },
  {
    id: 'b-5',
    name: 'Scarf Sutra Rani Bunga Lembah',
    category: 'Scarf',
    collection: 'Warisan Minang',
    price: 365000,
    isSale: false,
    isNewArrival: true,
    imageSlot1: 'prod-5-1',
    imageSlot2: 'prod-5-2',
    sizes: ['All Size (120x120)'],
    colors: ['Gading Alami', 'Indigo Pudar'],
    description: 'Scarf segi empat berbahan sutra satin doff berkilau elegan dengan tepi lasercut presisi khas monogram Rea Manda.',
    material: 'Satin Silk Doff Halus',
    care: 'Simpan tergulung rapi, cuci tangan dengan sampo sutra.',
  },
  {
    id: 'b-6',
    name: 'Gaun Kamila Tenun Bordir',
    category: 'Gaun',
    collection: 'Raya Bersama',
    price: 1250000,
    isSale: false,
    isNewArrival: true,
    imageSlot1: 'prod-6-1',
    imageSlot2: 'prod-6-2',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mawar Antik', 'Emas Karamel'],
    description: 'Gaun pesta santun berlapis tenun motif bunga endemik Nusantara dengan detail payet mutiara halus pada manset pergelangan tangan.',
    material: 'Jacquard Tenun & Furing Katun Rayon',
    care: 'Dry clean only untuk menjaga kilau benang tenun.',
  },
  {
    id: 'b-7',
    name: 'Outerwear Samira Tenun Terstruktur',
    category: 'Outerwear',
    collection: 'Keseharian Esensial',
    price: 645000,
    isSale: false,
    isNewArrival: false,
    imageSlot1: 'prod-7-1',
    imageSlot2: 'prod-7-2',
    sizes: ['All Size Fit to XL'],
    colors: ['Taupe Hangat', 'Abu Batu'],
    description: 'Luaran panjang terbuka tanpa kancing dengan siluet ramping dan kantung tersembunyi di kedua sisi.',
    material: 'Heavy Cotton Linen Blend',
    care: 'Gantung pada hanger lebar untuk mempertahankan bentuk bahu.',
  },
  {
    id: 'b-8',
    name: 'Mukena Sutra Safiya Tas Bordir',
    category: 'Mukena',
    collection: 'Raya Bersama',
    price: 785000,
    salePrice: 690000,
    isSale: true,
    isNewArrival: false,
    imageSlot1: 'prod-8-1',
    imageSlot2: 'prod-8-2',
    sizes: ['All Size Jumbo Santun'],
    colors: ['Putih Salju', 'Mutiara Champagne'],
    description: 'Perlengkapan sholat berbahan sutra velvet lembut jatuh dengan renda rajut katun handmade di lingkar wajah dan keliling bawah.',
    material: 'Silk Velvet Breathable',
    care: 'Cuci tangan terpisah, setrika uap.',
  },
];

export const BUSANA_COLLECTIONS = [
  { id: 'col-1', name: 'Senja Jakarta', imageSlot: 'koleksi-senja', desc: 'Siluet lembut bernuansa hangat terinspirasi arsitektur ibu kota saat petang.' },
  { id: 'col-2', name: 'Warisan Minang', imageSlot: 'koleksi-minang', desc: 'Songket kontemporer dan filosofi adat basandi syarak dalam tenun modern.' },
  { id: 'col-3', name: 'Raya Bersama', imageSlot: 'koleksi-raya', desc: 'Keanggunan perayaan keluarga dengan palet pastel mewah yang harmonis.' },
  { id: 'col-4', name: 'Keseharian Esensial', imageSlot: 'koleksi-harian', desc: 'Pilihan busana santun harian berbahan serat alami ramah cuaca tropis.' },
];
