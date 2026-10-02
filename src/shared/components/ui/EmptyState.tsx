import { Button, Result } from 'antd';
import { FileSearchOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { palette } from '@/core/theme/theme';

/** antd's stock illustrations are off-system; a single glyph carries these. */
const glyph = { fontSize: 40, color: palette.accent } as const;

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return <Result icon={<FileSearchOutlined style={glyph} />} title={title} {...(detail ? { subTitle: detail } : {})} />;
}

/** Shown when a guard refuses a screen the signed-in role may not open. */
export function AccessDenied() {
  return (
    <Result
      icon={<LockOutlined style={glyph} />}
      title="This screen is not available to you"
      subTitle="Your account does not have access to this part of the system."
      extra={<Link to={ROUTES.HOME}><Button type="primary">Go to your home screen</Button></Link>}
    />
  );
}
