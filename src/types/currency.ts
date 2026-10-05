// ============================================================
// Types — Currency
// ============================================================
export type CurrencyCode = 'IDR' | 'USD' | 'SGD' | 'MYR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstIDR: number; // 1 IDR = X other currency
}
