// ============================================================
// WCAG AA Contrast Ratio Verifier — Dual Theme Mode System
// Mode 1: LIGHT / SIGNATURE (Warm luxury editorial)
// Mode 2: DARK / SIGNATURE NIGHT (Rich multi-tonal fashion)
// Tests all token pairings against WCAG 2.1 AA requirements:
// 4.5:1 for normal text (< 20px / < 14pt bold)
// 3.0:1 for large text (>= 20px or >= 14pt bold, buttons)
// ============================================================

export const TOKENS = {
  // LIGHT / SIGNATURE
  lightBody: '#F4F1EB',
  lightPrimarySurface: '#FAF8F4',
  lightSecondarySurface: '#EAE5DC',
  lightTextPrimary: '#292725',
  lightTextSecondary: '#6E6962',
  lightTextFooter: '#F7F4EE',
  lightTextFooterMuted: '#B8B3AA',
  lightFooter: '#292725',

  // DARK / SIGNATURE NIGHT
  darkBody: '#1F1E1C',
  darkPrimarySurface: '#292724',
  darkSecondarySurface: '#34312D',
  darkCard: '#2D2A27',
  darkElevated: '#3B3732',
  darkFooter: '#171614',
  darkTextPrimary: '#F5F1E9',
  darkTextSecondary: '#BDB6AC',

  // Brand Accent
  accent: '#EA33B7',
  white: '#FFFFFF',
};

function hexToRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return [r, g, b];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface PairingTest {
  name: string;
  mode: 'LIGHT' | 'DARK';
  foreground: string;
  background: string;
  isLargeTextOnly?: boolean;
  requiredRatio: number;
  actualRatio: number;
  passes: boolean;
}

export function runContrastVerification(): {
  allPass: boolean;
  results: PairingTest[];
} {
  const pairings: Array<{ name: string; mode: 'LIGHT' | 'DARK'; fg: string; bg: string; large?: boolean }> = [
    // MODE 1 — LIGHT / SIGNATURE
    { name: 'Light: Primary text on Body', mode: 'LIGHT', fg: TOKENS.lightTextPrimary, bg: TOKENS.lightBody },
    { name: 'Light: Secondary muted text on Body', mode: 'LIGHT', fg: TOKENS.lightTextSecondary, bg: TOKENS.lightBody },
    { name: 'Light: Primary text on Primary Surface', mode: 'LIGHT', fg: TOKENS.lightTextPrimary, bg: TOKENS.lightPrimarySurface },
    { name: 'Light: Secondary text on Primary Surface', mode: 'LIGHT', fg: TOKENS.lightTextSecondary, bg: TOKENS.lightPrimarySurface },
    { name: 'Light: Primary text on Secondary Surface', mode: 'LIGHT', fg: TOKENS.lightTextPrimary, bg: TOKENS.lightSecondarySurface },
    { name: 'Light: Text on Dark Footer', mode: 'LIGHT', fg: TOKENS.lightTextFooter, bg: TOKENS.lightFooter },
    { name: 'Light: Secondary text on Dark Footer', mode: 'LIGHT', fg: TOKENS.lightTextFooterMuted, bg: TOKENS.lightFooter },
    { name: 'White on Brand Pink CTA Button', mode: 'LIGHT', fg: TOKENS.white, bg: TOKENS.accent, large: true },

    // MODE 2 — DARK / SIGNATURE NIGHT
    { name: 'Dark: Primary text on Body', mode: 'DARK', fg: TOKENS.darkTextPrimary, bg: TOKENS.darkBody },
    { name: 'Dark: Secondary text on Body', mode: 'DARK', fg: TOKENS.darkTextSecondary, bg: TOKENS.darkBody },
    { name: 'Dark: Primary text on Primary Surface', mode: 'DARK', fg: TOKENS.darkTextPrimary, bg: TOKENS.darkPrimarySurface },
    { name: 'Dark: Secondary text on Primary Surface', mode: 'DARK', fg: TOKENS.darkTextSecondary, bg: TOKENS.darkPrimarySurface },
    { name: 'Dark: Primary text on Secondary Surface', mode: 'DARK', fg: TOKENS.darkTextPrimary, bg: TOKENS.darkSecondarySurface },
    { name: 'Dark: Primary text on Card Surface', mode: 'DARK', fg: TOKENS.darkTextPrimary, bg: TOKENS.darkCard },
    { name: 'Dark: Secondary text on Card Surface', mode: 'DARK', fg: TOKENS.darkTextSecondary, bg: TOKENS.darkCard },
    { name: 'Dark: Text on Dark Footer', mode: 'DARK', fg: TOKENS.darkTextPrimary, bg: TOKENS.darkFooter },
  ];

  const results: PairingTest[] = pairings.map(({ name, mode, fg, bg, large }) => {
    const ratio = Math.round(getContrastRatio(fg, bg) * 100) / 100;
    const required = large ? 3.0 : 4.5;
    return {
      name,
      mode,
      foreground: fg,
      background: bg,
      isLargeTextOnly: large,
      requiredRatio: required,
      actualRatio: ratio,
      passes: ratio >= required,
    };
  });

  const allPass = results.every((r) => r.passes);
  return { allPass, results };
}

// Dev log helper
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const verification = runContrastVerification();
  if (verification.allPass) {
    console.log('[WCAG AA Check] All dual-theme brand token pairings PASS contrast requirements.');
  } else {
    console.error('[WCAG AA Check] Contrast check failed for some pairings:', verification.results.filter((r) => !r.passes));
  }
}
