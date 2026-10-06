// ============================================================
// Services — Katering
// ============================================================
import type { InquiryData } from '../types/katering';
export type { InquiryData };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const WHATSAPP_NUMBER = '6281234567890';

export async function sendInquiry(data: InquiryData): Promise<{ success: boolean }> {
  await delay(600);
  console.log('[Katering] Inquiry submitted:', data);
  return { success: true };
}
