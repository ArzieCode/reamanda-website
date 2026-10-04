// ============================================================
// Services — Katering
// ============================================================
import type { InquiryData } from '../types/katering';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const WHATSAPP_NUMBER = '6281234567890';

export async function sendInquiry(data: InquiryData): Promise<{ success: boolean }> {
  await delay(1000);
  // In production: replace with actual API call
  console.log('[Katering] Inquiry submitted:', data);
  return { success: true };
}
