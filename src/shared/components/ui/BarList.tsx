export interface Bar {
  readonly label: string;
  readonly value: number;
  /** Shown at the end of the bar; defaults to the value. */
  readonly display?: string;
}

/**
 * Horizontal bars drawn with CSS. A plotting library would add hundreds of kilobytes to draw a
 * div. ponytail: swap for @ant-design/plots only when a chart needs axes or interaction.
 */
export function BarList({ title, bars }: { title: string; bars: readonly Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="card chart-card">
      <div className="chart-title">{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }} role="img" aria-label={title}>
        {bars.map((b) => (
          <div className="chart-row" key={b.label}>
            <span>{b.label}</span>
            <span className="chart-track"><span className="chart-fill" style={{ width: `${(b.value / max) * 100}%` }} /></span>
            <span className="tnum" style={{ textAlign: 'right', fontWeight: 600 }}>{b.display ?? String(b.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
