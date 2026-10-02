import { describe, expect, it } from 'vitest';
import { statusChips, statusLabel, statusTone } from './status';

describe('status', () => {
  it('maps vocabulary to tones, ignoring case and underscores', () => {
    expect(statusTone('ACTIVE')).toBe('good');
    expect(statusTone('Pending_Approval')).toBe('warn');
    expect(statusTone('disabled')).toBe('bad');
    expect(statusTone('Hello')).toBeNull();
  });
  it('labels constants for display', () => {
    expect(statusLabel('PENDING_APPROVAL')).toBe('Pending approval');
  });
  it('counts chips from rows', () => {
    const rows = [{ s: 'ACTIVE' }, { s: 'INVITED' }, { s: 'ACTIVE' }];
    expect(statusChips(rows, (r) => r.s)).toEqual([
      { value: 'ACTIVE', count: 2 }, { value: 'INVITED', count: 1 },
    ]);
  });
});
