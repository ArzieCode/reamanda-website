// ============================================================
// Properti & Kost Eksklusif — TypeScript Types
// ============================================================

export type PropertyStatus = 'tersedia' | 'dp' | 'ditempati' | 'terisi' | 'perawatan';
export type PropertyType =
  | 'Kost Eksklusif'
  | 'Guest House'
  | 'Paviliun'
  | 'Ruang Usaha'
  | 'Tanah'
  | 'Hotel'
  | 'Rumah'
  | 'Ruko'
  | 'kost'
  | 'guest_house';

export interface Bid {
  id: string;
  propertyId: string;
  customerId?: string;
  bidderName: string; // masked: "A***d" or full name
  phone?: string;
  amount: number;
  timestamp: string;
  status?: 'pending' | 'accepted' | 'outbid';
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
  status: 'Menunggu' | 'Dikonfirmasi' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  location: string;
  area: number; // m2
  startingPrice: number;
  currentBid: number;
  minimumIncrement: number;
  status: PropertyStatus;
  description: string;
  specs: Record<string, any>;
  auctionEnd: string; // ISO date string
  images: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional extensions for room details & legacy compatibility
  price?: number;
  period?: 'bulanan' | 'harian' | 'tahunan';
  priceFormatted?: string;
  priceNumeric?: number;
  priceType?: 'sewa' | 'jual';
  landArea?: string;
  bedrooms?: number;
  bathrooms?: number;
  imageSlots?: [string, string, string] | string[];
  highlights?: string[];
  features?: string[];
}
