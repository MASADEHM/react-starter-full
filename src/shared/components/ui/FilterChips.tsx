import { Tag } from 'antd';
import { palette } from '@/core/theme/theme';
import { statusLabel } from '@/utils/status';

export interface FilterChip {
  readonly value: string;
  readonly count?: number;
}

interface FilterChipsProps {
  chips: readonly FilterChip[];
  active: string | null;
  onToggle: (value: string) => void;
}

/** Single-select chips: clicking the active one clears it. */
export function FilterChips({ chips, active, onToggle }: FilterChipsProps) {
  if (chips.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {chips.map((c) => {
        const on = active === c.value;
        return (
          <Tag.CheckableTag
            key={c.value}
            checked={on}
            onChange={() => { onToggle(c.value); }}
            style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 999,
              border: `1px solid ${on ? palette.accent : palette.borderStrong}`,
              background: on ? palette.accent : palette.white,
              color: on ? palette.white : palette.text,
            }}
          >
            {statusLabel(c.value)}
            {c.count !== undefined && <span style={{ opacity: on ? 0.75 : 0.55, marginInlineStart: 6 }}>{c.count}</span>}
          </Tag.CheckableTag>
        );
      })}
    </div>
  );
}
