// ============================================================
// Properti & Hotel — TypeScript Types
// ============================================================

export type PropertyStatus = 'tersedia' | 'dp' | 'ditempati';
export type PropertyType = 'Hotel' | 'Rumah' | 'Ruko' | 'Tanah';

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
  specs: Record<string, string>;
  auctionEnd: Date;
  images: string[];
}

export interface Bid {
  id: string;
  propertyId: string;
  bidderName: string; // already masked: "A***d"
  amount: number;
  timestamp: Date;
}
