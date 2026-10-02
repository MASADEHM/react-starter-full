import { describe, expect, it } from 'vitest';
import { compact, dateLabel, money, parseAmount } from './formatters';

describe('formatters', () => {
  it('formats money in the default currency', () => {
    expect(money(1250)).toMatch(/1,250/);
  });
  it('compacts large figures', () => {
    expect(compact(1_190_000)).toBe('1.19m');
    expect(compact(2_500)).toBe('2.5k');
    expect(compact(42)).toBe('42');
  });
  it('labels ISO dates and tolerates blanks', () => {
    expect(dateLabel('2026-08-17')).toBe('17 Aug 2026');
    expect(dateLabel('')).toBe('—');
  });
  it('parses amounts with noise', () => {
    expect(parseAmount('AED 4,000')).toBe(4000);
    expect(parseAmount('n/a')).toBe(0);
  });
});
