import { Tag } from 'antd';
import type { CSSProperties } from 'react';
import { palette } from '@/core/theme/theme';
import type { Tone } from '@/utils/status';
import { statusLabel, statusTone } from '@/utils/status';

/** Positive stays navy, attention is the one warm colour, negative recedes. */
const styles: Record<Tone, CSSProperties> = {
  good: { background: palette.accent100, color: palette.accent800, border: 'none' },
  warn: { background: palette.amber100, color: palette.amber700, border: 'none' },
  bad: { background: palette.neutral100, color: palette.neutral700, border: `1px solid ${palette.border}` },
};

export function StatusTag({ value, tone }: { value: string; tone?: Tone }) {
  const resolved = tone ?? statusTone(value) ?? 'bad';
  return (
    <Tag
      style={{
        ...styles[resolved], fontSize: 11, fontWeight: 600, lineHeight: '18px',
        padding: '1px 8px', borderRadius: 4, marginInlineEnd: 0, whiteSpace: 'nowrap',
      }}
    >
      {statusLabel(value)}
    </Tag>
  );
}
