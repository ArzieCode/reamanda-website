// ============================================================
// Services — Properti & Hotel
// ============================================================
import type { Property, Bid, PropertyStatus, PropertyType } from '../types/properti';
import { properties as mockProperties, initialBids } from '../data/properti';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// In-memory mutable state (simulates database)
let propertiesState: Property[] = mockProperties.map((p) => ({ ...p }));
let bidsState: Bid[] = initialBids.map((b) => ({ ...b }));
let bidCounter = 100;

export interface PropertyFilters {
  type?: PropertyType;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
}

export async function getListings(filters?: PropertyFilters): Promise<Property[]> {
  await delay(300);
  let results = [...propertiesState];
  if (filters?.type) {
    results = results.filter((p) => p.type === filters.type);
  }
  if (filters?.location) {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((p) => p.startingPrice >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((p) => p.startingPrice <= filters.maxPrice!);
  }
  if (filters?.status) {
    results = results.filter((p) => p.status === filters.status);
  }
  return results;
}

export async function getListing(id: string): Promise<Property | null> {
  await delay(200);
  return propertiesState.find((p) => p.id === id) ?? null;
}

export async function getBids(propertyId: string): Promise<Bid[]> {
  await delay(200);
  return bidsState
    .filter((b) => b.propertyId === propertyId)
    .sort((a, b) => b.amount - a.amount);
}

export async function placeBid(
  propertyId: string,
  amount: number
): Promise<{ success: boolean; error?: string; newBid?: Bid }> {
  await delay(500);

  const property = propertiesState.find((p) => p.id === propertyId);
  if (!property) {
    return { success: false, error: 'Properti tidak ditemukan.' };
  }
  if (property.status !== 'tersedia') {
    return { success: false, error: 'Penawaran tidak dapat dilakukan untuk properti ini.' };
  }
  const minRequired = property.currentBid + property.minimumIncrement;
  if (amount < minRequired) {
    return {
      success: false,
      error: `Penawaran harus melebihi ${formatRupiah(minRequired)}`,
    };
  }

  // Update state
  property.currentBid = amount;
  const newBid: Bid = {
    id: `b${++bidCounter}`,
    propertyId,
    bidderName: 'A***a', // masked
    amount,
    timestamp: new Date(),
  };
  bidsState = [newBid, ...bidsState];

  return { success: true, newBid };
}

export function simulateLiveBid(
  propertyId: string,
  callback: (newAmount: number) => void
): () => void {
  const interval = setInterval(() => {
    const property = propertiesState.find((p) => p.id === propertyId);
    if (!property || property.status !== 'tersedia') return;

    // Random increment between 25M–75M
    const randomIncrement = (Math.floor(Math.random() * 3) + 1) * 25000000;
    property.currentBid += randomIncrement;

    const newBid: Bid = {
      id: `b${++bidCounter}`,
      propertyId,
      bidderName: maskName(['Hendra', 'Aditya', 'Sari', 'Dewi', 'Reza', 'Maya'][
        Math.floor(Math.random() * 6)
      ]),
      amount: property.currentBid,
      timestamp: new Date(),
    };
    bidsState = [newBid, ...bidsState];
    callback(property.currentBid);
  }, 8000);

  return () => clearInterval(interval);
}

function maskName(name: string): string {
  if (name.length <= 2) return name[0] + '***';
  return name[0] + '***' + name[name.length - 1];
}

function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}
