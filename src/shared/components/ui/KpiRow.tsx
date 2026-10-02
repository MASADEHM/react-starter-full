import { Tooltip } from 'antd';

export interface Kpi {
  readonly label: string;
  readonly value: string;
  /** What the headline figure leaves out, shown on hover or tap. */
  readonly hint?: string;
}

export function KpiRow({ items }: { items: readonly Kpi[] }) {
  if (items.length === 0) return null;
  return (
    <div className="auto-grid" style={{ marginBottom: 20 }}>
      {items.map((k) => {
        const tile = (
          <div className="card kpi-cell">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        );
        return k.hint === undefined
          ? <div key={k.label}>{tile}</div>
          : <Tooltip key={k.label} title={k.hint} trigger={['hover', 'click']}>{tile}</Tooltip>;
      })}
    </div>
  );
}
