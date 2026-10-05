// ============================================================
// Context — Currency & Price Formatting
// Supports IDR, USD, SGD, MYR across the entire site
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CurrencyCode } from '../types/currency';
import { getInitialCurrency, CURRENCY_STORAGE_KEY, formatPrice } from '../services/currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountIDR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const initial = getInitialCurrency();
    setCurrencyState(initial);
  }, []);

  const format = (amountIDR: number) => formatPrice(amountIDR, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
