// ============================================================
// Services — Newsletter Subscription
// ============================================================
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SUBSCRIBERS_KEY = 'riamiranda_newsletter_emails';

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  await delay(400);
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
    return { success: false, message: 'Silakan masukkan alamat email yang valid.' };
  }

  try {
    const raw = localStorage.getItem(SUBSCRIBERS_KEY);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    if (existing.includes(trimmed)) {
      return { success: false, message: 'Alamat email ini sudah terdaftar dalam buletin kami.' };
    }
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify([...existing, trimmed]));
    return { success: true, message: 'Terima kasih telah berlangganan buletin eksklusif RiaMiranda!' };
  } catch {
    return { success: true, message: 'Terima kasih telah berlangganan buletin eksklusif RiaMiranda!' };
  }
}
