import { LogoutOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { env } from '@/config/env';
import { NAVIGATION } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { ROLE_LABEL } from '@/constants/roles';
import { hasRole, useSessionStore } from '@/core/auth/session.store';
import { palette } from '@/core/theme/theme';
import { initials } from '@/utils/formatters';

/** The navy rail: brand, the screens the signed-in role may open, and the user. */
export function SideNav() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);
  const items = NAVIGATION.filter((n) => !n.roles || hasRole(user, n.roles));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', color: palette.onNavy }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${palette.navyEdge}` }}>
        <div className="display" style={{ fontSize: 18, lineHeight: 1.15, color: palette.white }}>{env.appName}</div>
        {env.appTagline && <div style={{ fontSize: 12, marginTop: 3, color: palette.onNavyMuted }}>{env.appTagline}</div>}
      </div>

      <nav style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `rail-link${isActive ? ' active' : ''}`}
            style={({ isActive }) => ({
              padding: '9px 10px', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
              color: isActive ? palette.white : palette.onNavy,
              boxShadow: isActive ? `inset 3px 0 0 ${palette.accent400}` : 'none',
            })}
          >
            <span style={{ width: 20, display: 'inline-flex', justifyContent: 'center', color: palette.accent400 }}><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div
          style={{
            display: 'grid', gridTemplateColumns: '34px minmax(0,1fr) auto', gap: 10,
            alignItems: 'center', padding: '14px 16px', borderTop: `1px solid ${palette.navyEdge}`,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center',
              background: palette.accent700, color: palette.white, fontSize: 12, fontWeight: 700,
            }}
          >
            {initials(user.name)}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: palette.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </span>
            <span style={{ display: 'block', fontSize: 11, color: palette.onNavyMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.roles.map((r) => ROLE_LABEL[r]).join(' · ')}
            </span>
          </span>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => { signOut(); navigate(ROUTES.LOGIN, { replace: true }); }}
            className="rail-link"
            style={{
              width: 30, height: 30, justifyContent: 'center', border: 0, cursor: 'pointer',
              background: 'transparent', color: palette.onNavyMuted, font: 'inherit',
            }}
          >
            <LogoutOutlined />
          </button>
        </div>
      )}
    </div>
  );
}
