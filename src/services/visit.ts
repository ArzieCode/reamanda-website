// ============================================================
// Services — Property Inspection & Visit Schedule
// ============================================================
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface PropertyVisitData {
  propertyId: string;
  propertyName: string;
  name: string;
  phone: string;
  email: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
}

const VISITS_KEY = 'riamiranda_property_visits';

export async function schedulePropertyVisit(data: PropertyVisitData): Promise<{ success: boolean; message: string }> {
  await delay(600);
  if (!data.name || !data.phone || !data.visitDate || !data.visitTime) {
    return { success: false, message: 'Mohon lengkapi seluruh informasi yang dibutuhkan.' };
  }

  try {
    const raw = localStorage.getItem(VISITS_KEY);
    const existing: PropertyVisitData[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(VISITS_KEY, JSON.stringify([data, ...existing]));
  } catch {
    // fallback
  }

  return {
    success: true,
    message: `Jadwal kunjungan ke ${data.propertyName} pada ${data.visitDate} pukul ${data.visitTime} telah berhasil diajukan. Tim konsultan kami akan segera menghubungi Anda melalui WhatsApp.`,
  };
}

export function getUserScheduledVisits(): PropertyVisitData[] {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
