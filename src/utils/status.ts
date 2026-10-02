export type Tone = 'good' | 'warn' | 'bad';

/**
 * Status vocabulary. A cell whose text matches one of these renders as a tag; the tone is the
 * design system's, not a semantic judgement. Extend the lists as the domain grows.
 */
const GOOD = ['active', 'approved', 'complete', 'completed', 'verified', 'paid', 'confirmed', 'yes', 'on track'];
const WARN = ['pending', 'pending approval', 'invited', 'in review', 'in progress', 'scheduled', 'due soon', 'at risk'];
const BAD = ['draft', 'disabled', 'declined', 'returned', 'overdue', 'failed', 'no', 'cancelled'];

const norm = (value: string) => value.trim().toLowerCase().replace(/_/g, ' ');

/** Tag tone for a value, or null when the value is not a status. */
export function statusTone(value: string): Tone | null {
  const s = norm(value);
  if (GOOD.includes(s)) return 'good';
  if (WARN.includes(s)) return 'warn';
  if (BAD.includes(s)) return 'bad';
  return null;
}

export const isStatus = (value: string): boolean => statusTone(value) !== null;

/** 'PENDING_APPROVAL' → 'Pending approval'. */
export const statusLabel = (value: string): string => {
  const s = norm(value);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** The status views a list offers, counted from the rows it holds. */
export function statusChips<T>(
  rows: readonly T[], statusOf: (row: T) => string,
): readonly { readonly value: string; readonly count: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const s = statusOf(row);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}
