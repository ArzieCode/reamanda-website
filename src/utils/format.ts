// ============================================================
// Utility: Rupiah formatter
// ============================================================

/**
 * Format a number as Indonesian Rupiah: "Rp 2.850.000"
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Mask a bidder name: "Ahmad" → "A***d"
 */
export function maskName(name: string): string {
  if (name.length <= 2) return name[0] + '***';
  return name[0] + '***' + name[name.length - 1];
}

/**
 * Format a Date as relative or absolute time string (Bahasa Indonesia)
 */
export function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Countdown string from now until targetDate (dd:hh:mm:ss)
 */
export function getCountdown(targetDate: Date): string {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return 'Berakhir';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}h ${String(h).padStart(2, '0')}j ${String(m).padStart(2, '0')}m`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
