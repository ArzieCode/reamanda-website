// ============================================================
// Katering — TypeScript Types
// ============================================================

export interface InquiryData {
  nama: string;
  tanggalAcara: string;
  jumlahPorsi: number;
  catatan: string;
}

export interface KateringPackage {
  id: string;
  name: string;
  startingPrice: number;
  unit: string;
  minimumOrder: number;
  minimumUnit: string;
  inclusions: string[];
  description: string;
}

export interface KateringTestimoni {
  id: string;
  quote: string;
  name: string;
  city: string;
  event: string;
}
