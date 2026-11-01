// ============================================================
// Service — Realistic Seed Data Generator & Initial State
// ============================================================
import type { User, UserAddress } from '../types/auth';
import type { Product, ProductCategory, Collection } from '../types/busana';
import type { Order } from '../types/order';
import type { Property } from '../types/properti';
import type { KateringDish, KateringPackage, CateringInquiry } from '../types/katering';
import type { GeneralSettings, SectionEntity, SiteContent } from '../types/content';
import { hashPassword } from './crypto';

// Fixed salts for predictable demo seed
export const DEMO_CREDENTIALS = [
  { role: 'owner', email: 'owner@reamanda.com', password: 'Owner123!', name: 'Ibu Hj. Rhea Amanda', phone: '081122334455' },
  { role: 'admin', email: 'admin@reamanda.com', password: 'Admin123!', name: 'Fadhil Admin', phone: '081233445566' },
  { role: 'staf', email: 'staf@reamanda.com', password: 'Staf123!', name: 'Siti Staf Operasional', phone: '081344556677' },
  { role: 'customer', email: 'aisyah@example.com', password: 'Aisyah123!', name: 'Aisyah Putri', phone: '081298765432' },
  { role: 'customer', email: 'nurul@example.com', password: 'Nurul123!', name: 'Nurul Hidayah', phone: '081387654321' },
  { role: 'customer', email: 'zahra@example.com', password: 'Zahra123!', name: 'Zahra Salsabila', phone: '081576543210' },
];

export async function createDemoUsers(): Promise<User[]> {
  const users: User[] = [];

  for (const cred of DEMO_CREDENTIALS) {
    const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
    const passwordHash = await hashPassword(cred.password, salt);

    const addresses: UserAddress[] = cred.role === 'customer' ? [
      {
        id: `addr-${cred.email}`,
        label: 'Rumah',
        recipientName: cred.name,
        phone: cred.phone,
        street: 'Jl. Senopati No. 18, RT 02/RW 04',
        city: 'Jakarta Selatan',
        postalCode: '12190',
        isDefault: true,
      },
    ] : [];

    users.push({
      id: `usr-${cred.role}-${users.length + 1}`,
      name: cred.name,
      email: cred.email,
      phone: cred.phone,
      role: cred.role as any,
      isActive: true,
      passwordHash,
      salt,
      failedLoginAttempts: 0,
      lockedUntil: null,
      addresses,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    });
  }

  // Add 17 more customers to reach 20 customers
  const firstNames = ['Dewi', 'Rina', 'Maya', 'Nabila', 'Khansa', 'Annisa', 'Fitri', 'Dian', 'Laila', 'Mega', 'Tari', 'Intan', 'Salma', 'Putri', 'Sari', 'Indah', 'Amalia'];
  for (let i = 0; i < firstNames.length; i++) {
    const fn = firstNames[i];
    const email = `${fn.toLowerCase()}${i + 1}@example.com`;
    const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
    const passwordHash = await hashPassword('Pelanggan123!', salt);
    const daysAgo = Math.floor(Math.random() * 80) + 5;

    users.push({
      id: `cust-${i + 4}`,
      name: `${fn} Kartika`,
      email,
      phone: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'customer',
      isActive: true,
      passwordHash,
      salt,
      failedLoginAttempts: 0,
      lockedUntil: null,
      addresses: [
        {
          id: `addr-c-${i}`,
          label: 'Alamat Utama',
          recipientName: `${fn} Kartika`,
          phone: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
          street: `Jl. Melati No. ${i + 12}, Kebayoran`,
          city: i % 2 === 0 ? 'Jakarta Selatan' : 'Bandung',
          postalCode: '12190',
          isDefault: true,
        },
      ],
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }

  return users;
}

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-hijab', name: 'Hijab & Scarf', slug: 'hijab', sortOrder: 1, isVisible: true, subcategories: ['Voal Monogram', 'Silk Scarf', 'Pashmina Ceruti'] },
  { id: 'cat-tunik', name: 'Tunik & Blouse', slug: 'tunik', sortOrder: 2, isVisible: true, subcategories: ['Tunik Katun', 'Blouse Bordir', 'Outer Syar\'i'] },
  { id: 'cat-abaya', name: 'Abaya & Gaun', slug: 'abaya', sortOrder: 3, isVisible: true, subcategories: ['Abaya Hitam', 'Gaun Pesta Muslimah', 'Kaftan Sutra'] },
  { id: 'cat-mukena', name: 'Mukena & Sholat', slug: 'mukena', sortOrder: 4, isVisible: true, subcategories: ['Mukena Katun Jepang', 'Mukena Silk Premium', 'Travel Set'] },
  { id: 'cat-bawahan', name: 'Rok & Celana', slug: 'rok-celana', sortOrder: 5, isVisible: true, subcategories: ['Rok Plisket', 'Kulot Linen', 'Palazzo'] },
  { id: 'cat-aksara', name: 'Aksesoris & Bros', slug: 'aksesoris', sortOrder: 6, isVisible: true, subcategories: ['Bros Mutiara', 'Pin Monogram', 'Tuspin Emas'] },
];

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col-raya', slug: 'raya-bersama', name: 'Koleksi Raya Bersama 2025', description: 'Siluet anggun bertabur bordir halus untuk momen idul fitri penuh kedamaian.' },
  { id: 'col-senja', slug: 'senja-kahyangan', name: 'Senja Kahyangan', description: 'Warna hangat tanah dan rempah nusantara dalam balutan bahan silk berserat lembut.' },
  { id: 'col-aruna', slug: 'aruna-pagi', name: 'Aruna Pagi', description: 'Kesejukan katun linen premium untuk keseharian muslimah yang dinamis.' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    slug: 'abaya-zaleha-noir',
    name: 'Abaya Zaleha Noir',
    collection: 'Koleksi Raya Bersama 2025',
    category: 'Abaya & Gaun',
    price: 890000,
    salePrice: 799000,
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: true,
    isSale: true,
    isPublished: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Hitam', 'Midnight Navy'],
    variants: [
      { id: 'v-1-1', size: 'S', color: 'Hitam', sku: 'ZAL-BLK-S', stock: 8 },
      { id: 'v-1-2', size: 'M', color: 'Hitam', sku: 'ZAL-BLK-M', stock: 12 },
      { id: 'v-1-3', size: 'L', color: 'Hitam', sku: 'ZAL-BLK-L', stock: 6 },
      { id: 'v-1-4', size: 'XL', color: 'Hitam', sku: 'ZAL-BLK-XL', stock: 4 },
      { id: 'v-1-5', size: 'M', color: 'Midnight Navy', sku: 'ZAL-NAV-M', stock: 5 },
    ],
    material: 'Jetblack Silk Arab & Renda Swarovski',
    care: 'Dry clean atau cuci tangan suhu ruang, setrika uap sedang.',
    description: 'Abaya eksklusif berpotongan payung elegan dengan aksen renda bordir hitam pekat bertabur kristal halus di ujung lengan.',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-2',
    slug: 'gaun-lara-sage',
    name: 'Gaun Lara Sage',
    collection: 'Senja Kahyangan',
    category: 'Abaya & Gaun',
    price: 1150000,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: true,
    isSale: false,
    isPublished: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Sage Green', 'Dusty Olive'],
    variants: [
      { id: 'v-2-1', size: 'S', color: 'Sage Green', sku: 'LRA-SGE-S', stock: 7 },
      { id: 'v-2-2', size: 'M', color: 'Sage Green', sku: 'LRA-SGE-M', stock: 14 },
      { id: 'v-2-3', size: 'L', color: 'Sage Green', sku: 'LRA-SGE-L', stock: 9 },
    ],
    material: 'Armani Silk Doff dengan Lapisan Furing Katun Adem',
    care: 'Cuci terpisah dengan deterjen lembut, hindari sinar matahari langsung.',
    description: 'Gaun santun bertekstur sutra jatuh lembut dengan drapery anggun di bagian pinggang.',
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-3',
    slug: 'tunik-malika-bordir',
    name: 'Tunik Malika Bordir',
    collection: 'Koleksi Raya Bersama 2025',
    category: 'Tunik & Blouse',
    price: 520000,
    salePrice: 475000,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: false,
    isSale: true,
    isPublished: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Broken White', 'Soft Khaki'],
    variants: [
      { id: 'v-3-1', size: 'M', color: 'Broken White', sku: 'MLK-WHT-M', stock: 15 },
      { id: 'v-3-2', size: 'L', color: 'Broken White', sku: 'MLK-WHT-L', stock: 10 },
      { id: 'v-3-3', size: 'XL', color: 'Broken White', sku: 'MLK-WHT-XL', stock: 6 },
    ],
    material: 'Katun Madinah Premium',
    care: 'Cuci mesin putaran lembut, setrika suhu sedang.',
    description: 'Tunik panjang dengan bordiran bunga teratai halus di dada dan manset lengan ramah wudhu.',
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-4',
    slug: 'hijab-voal-aruna-monogram',
    name: 'Hijab Voal Aruna Monogram',
    collection: 'Aruna Pagi',
    category: 'Hijab & Scarf',
    price: 245000,
    images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: false,
    isSale: false,
    isPublished: true,
    sizes: ['115x115 cm'],
    colors: ['Mocca', 'Dusty Rose', 'Silver Grey'],
    variants: [
      { id: 'v-4-1', size: '115x115 cm', color: 'Mocca', sku: 'VOAL-MOC', stock: 25 },
      { id: 'v-4-2', size: '115x115 cm', color: 'Dusty Rose', sku: 'VOAL-ROS', stock: 18 },
      { id: 'v-4-3', size: '115x115 cm', color: 'Silver Grey', sku: 'VOAL-SLV', stock: 3 }, // Low stock (3)
    ],
    material: 'Ultrafine Voal dengan Lasercut Presisi',
    care: 'Cuci dengan sampo atau deterjen bayi, jangan diperas kencang.',
    description: 'Scarf voal tegak di dahi dan tidak mudah kusut dengan motif monogram khas Rea Manda.',
    createdAt: new Date(Date.now() - 80 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-5',
    slug: 'mukena-silk-humaira',
    name: 'Mukena Silk Humaira 2-in-1',
    collection: 'Koleksi Raya Bersama 2025',
    category: 'Mukena & Sholat',
    price: 780000,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: true,
    isSale: false,
    isPublished: true,
    sizes: ['All Size'],
    colors: ['Champagne', 'Lavender Mist'],
    variants: [
      { id: 'v-5-1', size: 'All Size', color: 'Champagne', sku: 'MUK-CHP', stock: 9 },
      { id: 'v-5-2', size: 'All Size', color: 'Lavender Mist', sku: 'MUK-LAV', stock: 4 }, // Low stock (4)
    ],
    material: 'Sutra Velvet Silk Doff dengan Renda Gipper',
    care: 'Cuci tangan secara lembut, setrika uap.',
    description: 'Mukena premium dengan resleting di bawah dagu yang bisa digunakan sebagai mukena ponco maupun mukena biasa.',
    createdAt: new Date(Date.now() - 70 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-6',
    slug: 'rok-plisket-nayla',
    name: 'Rok Plisket Nayla Heavy Crepe',
    collection: 'Aruna Pagi',
    category: 'Rok & Celana',
    price: 365000,
    images: ['https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop'],
    isNewArrival: false,
    isSale: false,
    isPublished: true,
    sizes: ['All Size (Karet)'],
    colors: ['Hitam', 'Camel', 'Emerald'],
    variants: [
      { id: 'v-6-1', size: 'All Size (Karet)', color: 'Hitam', sku: 'ROK-BLK', stock: 12 },
      { id: 'v-6-2', size: 'All Size (Karet)', color: 'Camel', sku: 'ROK-CML', stock: 8 },
      { id: 'v-6-3', size: 'All Size (Karet)', color: 'Emerald', sku: 'ROK-EMR', stock: 2 }, // Low stock (2)
    ],
    material: 'Heavy Crepe Korea Tekstur Rapat',
    care: 'Gantung setelah dicuci, jangan disetrika untuk menjaga lipatan plisket.',
    description: 'Rok lipit berbobot pas yang tidak menerawang dengan elastisitas pinggang yang nyaman.',
    createdAt: new Date(Date.now() - 65 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add 18 more realistic products to reach 24 products
  ...Array.from({ length: 18 }).map((_, idx) => {
    const num = idx + 7;
    const cats = ['Hijab & Scarf', 'Tunik & Blouse', 'Abaya & Gaun', 'Mukena & Sholat', 'Rok & Celana', 'Aksesoris & Bros'];
    const cat = cats[idx % cats.length];
    const basePrice = (Math.floor(Math.random() * 8) + 3) * 100000 + 50000;
    const isSale = idx % 4 === 0;

    return {
      id: `p-${num}`,
      slug: `busana-elegan-${num}`,
      name: `Koleksi Santun Anggun ${num}`,
      collection: idx % 2 === 0 ? 'Koleksi Raya Bersama 2025' : 'Senja Kahyangan',
      category: cat,
      price: basePrice,
      salePrice: isSale ? basePrice - 50000 : undefined,
      images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'],
      isNewArrival: idx % 3 === 0,
      isSale,
      isPublished: true,
      sizes: ['M', 'L', 'XL'],
      colors: ['Cream', 'Terracotta'],
      variants: [
        { id: `v-${num}-1`, size: 'M', color: 'Cream', sku: `SKU-${num}-CRM`, stock: Math.floor(Math.random() * 15) + 3 },
        { id: `v-${num}-2`, size: 'L', color: 'Terracotta', sku: `SKU-${num}-TER`, stock: Math.floor(Math.random() * 12) + 2 },
      ],
      material: 'Serat Alami Katun & Sutra Halus',
      care: 'Cuci terpisah, suhu ruang.',
      description: `Pilihan busana muslimah istimewa seri ${num} untuk melengkapi gaya santun bersahaja.`,
      createdAt: new Date(Date.now() - (idx * 3 + 10) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }),
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'D’Rhea Syariah Guest House — Kamar Suite Marwah',
    type: 'Guest House',
    location: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    area: 28,
    startingPrice: 3500000,
    currentBid: 4200000,
    minimumIncrement: 100000,
    status: 'tersedia',
    description: 'Kamar privat eksklusif khusus wanita dengan kamar mandi dalam, water heater, AC inverter, dan balkon menghadap taman asri.',
    specs: { kamarTidur: 1, kamarMandi: 1, listrik: '2200 VA', ac: '1 PK Inverter', wifi: '100 Mbps' },
    auctionEnd: new Date(Date.now() + 18 * 3600 * 1000).toISOString(), // Ends in 18h
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-2',
    name: 'Kost Eksklusif Safa — Paviliun Lantai 2',
    type: 'Kost Eksklusif',
    location: 'Jl. Gandaria Tengah IV No. 12, Jakarta Selatan',
    area: 24,
    startingPrice: 2800000,
    currentBid: 3100000,
    minimumIncrement: 50000,
    status: 'dp',
    description: 'Hunian aman bagi mahasiswi dan karyawati dengan akses kartu pintar 24 jam dan penjagaan syariah.',
    specs: { kamarTidur: 1, kamarMandi: 1, dapurBersama: 'Lengkap', parkirMobil: 'Tersedia' },
    auctionEnd: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-3',
    name: 'D’Rhea Deluxe Room 102 — Akses Taman',
    type: 'Kost Eksklusif',
    location: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    area: 22,
    startingPrice: 2700000,
    currentBid: 2900000,
    minimumIncrement: 50000,
    status: 'ditempati',
    description: 'Kamar nyaman bernuansa hangat dengan pencahayaan alami dan fasilitas laundry terpadu.',
    specs: { kamarTidur: 1, kamarMandi: 1, springbed: 'Queen 160x200', mejaKerja: 'Ergonomis' },
    auctionEnd: new Date(Date.now() + 120 * 3600 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-4',
    name: 'Studio Syariah Annisa — View Kota',
    type: 'Kost Eksklusif',
    location: 'Jl. Cikajang No. 8, Kebayoran Baru',
    area: 32,
    startingPrice: 4200000,
    currentBid: 4500000,
    minimumIncrement: 100000,
    status: 'tersedia',
    description: 'Unit studio luas dengan pantry pribadi, kulkas 2 pintu, dan pemandangan cakrawala kota.',
    specs: { kamarTidur: 1, pantry: 'Pribadi', balkon: 'Ada', ac: 'Ada' },
    auctionEnd: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-5',
    name: 'Paviliun Melati Khusus Karyawati',
    type: 'Paviliun',
    location: 'Jl. Wijaya IX No. 3, Jakarta Selatan',
    area: 30,
    startingPrice: 3800000,
    currentBid: 3900000,
    minimumIncrement: 50000,
    status: 'tersedia',
    description: 'Paviliun terpisah satu gerbang utama dengan ketenangan optimal bagi profesional muda.',
    specs: { kamarTidur: 1, ruangTamuKecil: 'Ada', wifi: '200 Mbps' },
    auctionEnd: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-6',
    name: 'Ruang Serbaguna & Butik Rea Manda',
    type: 'Ruang Usaha',
    location: 'Jl. Senopati No. 45, Kebayoran Baru',
    area: 60,
    startingPrice: 8500000,
    currentBid: 9200000,
    minimumIncrement: 200000,
    status: 'tersedia',
    description: 'Ruang workshop, arisan, maupun mini pameran busana muslimah bernuansa etnik modern.',
    specs: { kapasitas: '50 Orang', tataSuara: 'Premium', ac: '3 Unit' },
    auctionEnd: new Date(Date.now() + 140 * 3600 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop'],
    isPublished: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_KATERING_PACKAGES: KateringPackage[] = [
  {
    id: 'pkg-1',
    name: 'Paket Perjamuan Adat & Syar’i',
    slug: 'perjamuan-adat-syari',
    startingPrice: 125000,
    unit: 'porsi',
    minimumOrder: 100,
    minimumUnit: 'porsi',
    leadTimeDays: 7,
    inclusions: [
      'Nasi Gurih Pandan Wangi / Nasi Kebuli Rempah',
      'Daging Rendang Singkarak / Daging Masak Bumbu Rujak',
      'Ayam Panggang Klaten Bumbu Kelapa',
      'Sup Kimlo Pengantin / Sup Bunga Sedap Malam',
      'Sambal Goreng Ati Ampela Kentang',
      'Puding Caramel Lembut & Buah Potong Segar',
      'Air Mineral & Es Cendol Nangka',
    ],
    description: 'Susunan menu hidangan tradisional istimewa disajikan dengan estetika perjamuan santun bercitarasa nusantara.',
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop'],
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: 'pkg-2',
    name: 'Paket Prasmanan Korporasi Eksekutif',
    slug: 'prasmanan-korporasi',
    startingPrice: 95000,
    unit: 'porsi',
    minimumOrder: 50,
    minimumUnit: 'porsi',
    leadTimeDays: 3,
    inclusions: [
      'Nasi Putih Aromatik Pandan',
      'Daging Sapi Lada Hitam Empuk',
      'Ayam Gulung Keju Saus Barbeque',
      'Sup Jamur Asparagus Telur Puyuh',
      'Capcay Seafood Sayuran Segar',
      'Puding Sutra Cokelat Vla Vanila',
      'Infused Water & Aneka Jus Segar',
    ],
    description: 'Menu lengkap prasmanan formal untuk seminar, pertemuan direksi, dan ramah tamah perusahaan.',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'],
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: 'pkg-3',
    name: 'Paket Nasi Box Berkat & Syukuran',
    slug: 'nasi-box-syukuran',
    startingPrice: 55000,
    unit: 'box',
    minimumOrder: 30,
    minimumUnit: 'box',
    leadTimeDays: 2,
    inclusions: [
      'Nasi Kuning Bumbu Kunyit Asli',
      'Ayam Goreng Lengkuas Rempah',
      'Perkedel Kentang Daging Sapi',
      'Sambal Goreng Tempe Kering Manis',
      'Telur Dadar Rawis Tipis',
      'Sambal Bajak Matang',
      'Kerupuk Udang & Pisang Raja',
    ],
    description: 'Kotak santapan eksklusif ramah lingkungan dengan kemasan boks daun jati bermartabat.',
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'],
    isPublished: true,
    sortOrder: 3,
  },
];

export const INITIAL_KATERING_DISHES: KateringDish[] = [
  { id: 'dish-1', name: 'Rendang Daging Sapi Singkarak', category: 'Utama', price: 45000, minimumOrder: 20, description: 'Daging sapi pilihan dimasak perlahan 8 jam bersama santan murni dan kelapa sangrai.', isPopular: true, isPublished: true },
  { id: 'dish-2', name: 'Ayam Panggang Klaten Madu', category: 'Utama', price: 35000, minimumOrder: 20, description: 'Ayam kampung muda dibakar bumbu rempah klaten dengan aroma manis gurih madu alami.', isPopular: true, isPublished: true },
  { id: 'dish-3', name: 'Gindara Bakar Saus Rempah Bali', category: 'Utama', price: 48000, minimumOrder: 20, description: 'Fillet ikan gindara segar berlumur bumbu kuning kecombrang bakar arang.', isPopular: false, isPublished: true },
  { id: 'dish-4', name: 'Sup Kimlo Jamur Salju Pengantin', category: 'Sup', price: 25000, minimumOrder: 20, description: 'Kuah kaldu ayam kampung bening dengan kembang tahu, jamur kuping, sedap malam, dan bakso ikan.', isPopular: true, isPublished: true },
  { id: 'dish-5', name: 'Sup Buntut Sapi Rempah Pala', category: 'Sup', price: 65000, minimumOrder: 20, description: 'Buntut sapi empuk berpadu kuah kaldu rempah beraroma cengkeh dan biji pala segar.', isPopular: true, isPublished: true },
  { id: 'dish-6', name: 'Nasi Liwet Solo Kastrol Tradisional', category: 'Nasi', price: 20000, minimumOrder: 30, description: 'Nasi gurih santan pandan dengan aroma daun salam dan serai harum semerbak.', isPopular: true, isPublished: true },
  { id: 'dish-7', name: 'Nasi Kebuli Daging Kambing Muda', category: 'Nasi', price: 55000, minimumOrder: 25, description: 'Beras basmati panjang dimasak kaldu kambing dan minyak samin asli Timur Tengah.', isPopular: true, isPublished: true },
  { id: 'dish-8', name: 'Sambal Goreng Krecek Hati Sapi', category: 'Sayur', price: 28000, minimumOrder: 20, description: 'Krecek kulit sapi renyah lembut berpadu kuah santan cabai rawit merah pedas sedang.', isPopular: true, isPublished: true },
  { id: 'dish-9', name: 'Urap Sayur Bumbu Kelapa Sangrai', category: 'Sayur', price: 18000, minimumOrder: 20, description: 'Kacang panjang, tauge, bayam, dan wortel dengan taburan kelapa berbumbu kencur wangi.', isPopular: false, isPublished: true },
  { id: 'dish-10', name: 'Puding Sutra Mangga Gedong Gincu', category: 'Penutup', price: 22000, minimumOrder: 25, description: 'Puding susu selembut sutra dengan sari buah mangga asli dan vla vanila Prancis.', isPopular: true, isPublished: true },
  { id: 'dish-11', name: 'Es Kelapa Kopyor Jeruk Kasturi', category: 'Minuman', price: 25000, minimumOrder: 30, description: 'Daging kelapa kopyor lembut berpadu perasan air jeruk kasturi dan sirup pandan wangi.', isPopular: true, isPublished: true },
  { id: 'dish-12', name: 'Wedang Ronde Jahe Wangi Merah', category: 'Minuman', price: 20000, minimumOrder: 25, description: 'Bola ketan isi pasta kacang dalam kuah air jahe emprit gula aren hangat.', isPopular: false, isPublished: true },
];

export const INITIAL_CATERING_INQUIRIES: CateringInquiry[] = [
  {
    id: 'INQ-101',
    nama: 'Bapak H. Bambang Soedirman',
    email: 'bambang.s@perusahaan.co.id',
    telepon: '081234567890',
    tanggalAcara: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    jumlahPorsi: 250,
    paketId: 'pkg-1',
    paketName: 'Paket Perjamuan Adat & Syar’i',
    catatan: 'Acara tasyakuran pernikahan putri kami di Gedung Balai Samudera. Mohon penataan meja VIP.',
    totalEstimasi: 31250000,
    status: 'Menunggu Konfirmasi',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'INQ-102',
    nama: 'Ibu Ratna Kumalasari',
    email: 'ratna@gmail.com',
    telepon: '081398765432',
    tanggalAcara: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
    jumlahPorsi: 120,
    paketId: 'pkg-2',
    paketName: 'Paket Prasmanan Korporasi Eksekutif',
    catatan: 'Jamuan makan siang seminar nasional arsitektur Islam.',
    totalEstimasi: 11400000,
    status: 'Dikonfirmasi',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

/**
 * Generate about 120 realistic orders across 90 days for vibrant charts!
 */
export function generateRealisticOrders(users: User[], products: Product[]): Order[] {
  const orders: Order[] = [];
  const now = Date.now();

  const statuses: Order['status'][] = [
    'Selesai',
    'Selesai',
    'Selesai',
    'Dibayar',
    'Diproses',
    'Dikirim',
    'Menunggu Pembayaran',
    'Dibatalkan',
  ];

  // Distribute ~120 orders over 90 days
  for (let i = 0; i < 120; i++) {
    // Bias towards more recent days
    const dayFactor = Math.pow(Math.random(), 1.4);
    const daysAgo = Math.floor(dayFactor * 90);
    const orderDate = new Date(now - daysAgo * 86400000 - Math.random() * 86400000);

    const user = users[i % users.length];
    const isRecent = daysAgo <= 2;
    const status = isRecent ? (i % 3 === 0 ? 'Menunggu Pembayaran' : 'Dibayar') : statuses[i % statuses.length];

    // Pick 1 to 3 items
    const itemCount = (i % 3) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const prod = products[(i + j * 3) % products.length];
      const variant = prod.variants?.[0] || { size: 'M', color: 'Standar', sku: 'SKU' };
      const price = prod.salePrice || prod.price;
      const qty = 1 + (j === 0 && i % 4 === 0 ? 1 : 0);
      subtotal += price * qty;

      items.push({
        productId: prod.id,
        productName: prod.name,
        variantId: variant.id,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        quantity: qty,
        price,
        image: prod.images[0],
      });
    }

    const shippingCost = subtotal > 500000 ? 0 : 25000;
    const discount = i % 5 === 0 ? 50000 : 0;
    const total = subtotal - discount + shippingCost;

    const orderId = `RM-${8000 + i}`;
    const isPaid = status !== 'Menunggu Pembayaran' && status !== 'Dibatalkan';

    orders.push({
      id: orderId,
      orderNumber: orderId,
      type: 'busana',
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      date: orderDate.toISOString(),
      items,
      shippingAddress: {
        fullName: user.name,
        phone: user.phone,
        street: 'Jl. Melati Indah No. 12',
        city: 'Jakarta Selatan',
        postalCode: '12190',
      },
      paymentMethod: i % 2 === 0 ? 'bca_va' : 'qris',
      subtotal,
      discount,
      shippingCost,
      total,
      status,
      trackingNumber: status === 'Dikirim' || status === 'Selesai' ? `JNE${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
      courierName: 'JNE Express',
      internalNote: i % 6 === 0 ? 'Pelanggan meminta kemasan boks kado eksklusif.' : undefined,
      isPaid,
      paidAt: isPaid ? orderDate.toISOString() : undefined,
      timeline: [
        {
          id: `tl-${orderId}-1`,
          status: 'Menunggu Pembayaran',
          title: 'Pesanan Dibuat',
          description: 'Pelanggan berhasil membuat pesanan.',
          timestamp: orderDate.toISOString(),
          actor: 'Pelanggan',
        },
        ...(isPaid ? [{
          id: `tl-${orderId}-2`,
          status: 'Dibayar' as any,
          title: 'Pembayaran Dikonfirmasi',
          description: 'Pembayaran melalui BCA Virtual Account terverifikasi otomatis.',
          timestamp: new Date(orderDate.getTime() + 1800000).toISOString(),
          actor: 'Sistem',
        }] : []),
      ],
    });
  }

  // Sort newest first
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const INITIAL_GENERAL_SETTINGS: GeneralSettings = {
  brandName: 'Rea Manda',
  tagline: 'Elegan, Tulus, dan Abadi',
  logoUrl: '/rheamanda-mark.png',
  faviconUrl: '/favicon.png',
  phone: '021-7245890',
  whatsappNumber: '6281234567890',
  email: 'editorial@reamanda.com',
  address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190',
  instagram: '@reamanda_official',
  facebook: 'Rea Manda Indonesia',
  youtube: 'Rea Manda Studio',
  bankAccountText: 'BCA 5420-891-230 a.n. PT Rea Manda Berkah Mulia',
  shippingPricesText: 'Bebas ongkos kirim Jabodetabek untuk pesanan di atas Rp 500.000.',
  businessHours: 'Senin - Sabtu: 09:00 - 18:00 WIB',
  lowStockThreshold: 5,
  accentColor: '--caramel-deep',
  seoHomeTitle: 'Rea Manda — Busana Muslimah, Kost Eksklusif D’Rhea Syariah, & Katering',
  seoHomeDesc: 'Eksplorasi busana muslimah kontemporer, kost eksklusif wanita D’Rhea Syariah Guest House, dan katering jamuan santun berkualitas tinggi.',
  seoBusanaTitle: 'Koleksi Busana Muslimah Santun & Anggun — Rea Manda',
  seoBusanaDesc: 'Temukan abaya sutra, gaun pesta muslimah, tunik katun madinah, dan scarf voal monogram eksklusif.',
  seoKostTitle: 'D’Rhea Syariah Guest House & Kost Eksklusif Wanita — Rea Manda',
  seoKostDesc: 'Hunian aman, nyaman, dan syar’i di lokasi strategis Senopati Jakarta Selatan dengan fasilitas lengkap.',
  seoKateringTitle: 'Katering Perjamuan & Syukuran Berselera Tinggi — Rea Manda',
  seoKateringDesc: 'Layanan hidangan prasmanan, perjamuan adat, dan nasi box berkat dengan citarasa nusantara otentik.',
};

export const INITIAL_SITE_CONTENT: SiteContent[] = [
  {
    key: 'home.hero.title',
    value: 'Keanggunan Santun dalam Setiap Langkah Kehidupan',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Sistem',
    versions: [
      {
        id: 'v-home-hero-1',
        key: 'home.hero.title',
        value: 'Keanggunan Santun dalam Setiap Langkah Kehidupan',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Sistem',
      },
    ],
  },
  {
    key: 'home.hero.subtitle',
    value: 'Menghadirkan busana muslimah kontemporer, kost eksklusif untuk wanita, serta hidangan perjamuan berselera.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Sistem',
    versions: [],
  },
  {
    key: 'announcement.text',
    value: 'KOLEKSI RAYA BERSAMA 2025 KINI HADIR · PENGIRIMAN GRATIS KE SELURUH INDONESIA',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Sistem',
    versions: [],
  },
  {
    key: 'faq.return.answer',
    value: 'Kami menerima penukaran ukuran maksimal 3 hari kerja setelah barang diterima dengan kondisi tag utuh dan belum dicuci.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Sistem',
    versions: [],
  },
];
