// ============================================================
// Katering & Perjamuan — TypeScript Types
// ============================================================

export interface CateringInquiry {
  id: string;
  customerId?: string;
  nama: string;
  email?: string;
  telepon: string;
  tanggalAcara: string;
  jumlahPorsi: number;
  paketId?: string;
  paketName?: string;
  catatan: string;
  totalEstimasi?: number;
  status: 'Menunggu Konfirmasi' | 'Dikonfirmasi' | 'Diproses' | 'Diantar' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
}

export interface KateringPackage {
  id: string;
  name: string;
  slug: string;
  startingPrice: number;
  unit: string;
  minimumOrder: number;
  minimumUnit: string;
  leadTimeDays: number; // PO lead time
  inclusions: string[];
  description: string;
  images: string[];
  isPublished: boolean;
  sortOrder: number;
}

export interface KateringDish {
  id: string;
  name: string;
  category: 'Utama' | 'Sup' | 'Nasi' | 'Sayur' | 'Penutup' | 'Minuman';
  price: number;
  minimumOrder: number;
  description: string;
  image?: string;
  isPopular: boolean;
  isPublished: boolean;
}

export interface KateringTestimoni {
  id: string;
  quote: string;
  name: string;
  city: string;
  event: string;
  date?: string;
}
