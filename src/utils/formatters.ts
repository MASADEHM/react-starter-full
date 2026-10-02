const LOCALE = 'en-AE';

const plain = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });
const currencyFormatters = new Map<string, Intl.NumberFormat>();

export const money = (value: number, currency = 'AED'): string => {
  let f = currencyFormatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat(LOCALE, { style: 'currency', currency, maximumFractionDigits: 0 });
    currencyFormatters.set(currency, f);
  }
  return f.format(value);
};

export const number = (value: number, digits = 0): string =>
  plain.format(Number(value.toFixed(digits)));

export const percent = (value: number, digits = 1): string => `${value.toFixed(digits)}%`;

/** Compact figure for KPI tiles: 1_190_000 → '1.19m'. */
export function compact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}bn`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}m`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
  return number(value);
}

/** An ISO date as the screens show it: '2026-08-17' → '17 Aug 2026'. Empty input shows an em dash. */
export const dateLabel = (iso: string): string =>
  iso.trim() === ''
    ? '—'
    : new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
      });

/** Parse '1,250' or 'AED 4,000' into a number; NaN-safe. */
export function parseAmount(text: string): number {
  const n = Number(text.replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export const initials = (name: string): string =>
  name.split(/\s+/).map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase();
