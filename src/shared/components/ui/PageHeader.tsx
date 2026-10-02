import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  extra?: ReactNode;
}

export function PageHeader({ kicker, title, description, primaryLabel, onPrimary, extra }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
      <div style={{ maxWidth: 720 }}>
        <div className="kicker">{kicker}</div>
        <h1 className="page-title display">{title}</h1>
        {description && <p className="muted" style={{ margin: 0, fontSize: 14, textWrap: 'pretty' }}>{description}</p>}
      </div>
      <Space size={8} wrap>
        {extra}
        {primaryLabel && onPrimary && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onPrimary}>{primaryLabel}</Button>
        )}
      </Space>
    </div>
  );
}
