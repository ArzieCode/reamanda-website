// ============================================================
// Services — Currency & Price Formatting
// ============================================================
import type { CurrencyCode, CurrencyConfig } from '../types/currency';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    rateAgainstIDR: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateAgainstIDR: 1 / 15800,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateAgainstIDR: 1 / 11900,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    rateAgainstIDR: 1 / 3550,
  },
};

export const CURRENCY_STORAGE_KEY = 'riamiranda_currency';

export function getInitialCurrency(): CurrencyCode {
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (saved && (saved === 'IDR' || saved === 'USD' || saved === 'SGD' || saved === 'MYR')) {
      return saved as CurrencyCode;
    }
  } catch {
    // fallback
  }
  return 'IDR';
}

export function formatPrice(amountIDR: number, currency: CurrencyCode = 'IDR'): string {
  const config = CURRENCIES[currency] ?? CURRENCIES.IDR;
  if (currency === 'IDR') {
    return 'Rp ' + Math.round(amountIDR).toLocaleString('id-ID');
  }

  const converted = amountIDR * config.rateAgainstIDR;
  if (currency === 'USD') {
    return '$ ' + converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (currency === 'SGD') {
    return 'S$ ' + converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (currency === 'MYR') {
    return 'RM ' + converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  return 'Rp ' + Math.round(amountIDR).toLocaleString('id-ID');
}
