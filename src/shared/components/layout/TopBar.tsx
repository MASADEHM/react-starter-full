import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { NAVIGATION } from '@/config/navigation';

interface TopBarProps {
  /** Set only where the navigation rail is in a drawer, i.e. below lg. */
  onMenu?: (() => void) | undefined;
}

/** Thin header: menu button on small screens, the current section's name, room for actions. */
export function TopBar({ onMenu }: TopBarProps) {
  const { pathname } = useLocation();
  const current = NAVIGATION.find((n) => pathname === n.to || pathname.startsWith(`${n.to}/`));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px clamp(16px, 4vw, 32px)', minHeight: 56 }}>
      {onMenu && (
        <Button icon={<MenuOutlined />} onClick={onMenu} aria-label="Open navigation" style={{ width: 36, height: 36, flex: 'none' }} />
      )}
      <div className="topbar-title muted" style={{ fontSize: 13, flex: 1, minWidth: 0 }}>
        {current?.label ?? ''}
      </div>
    </div>
  );
}
