import { Drawer, Grid, Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { palette } from '@/core/theme/theme';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

/**
 * Below lg the 264px rail costs more than the screen has, so the same rail moves into a drawer
 * behind a menu button and the content gets the whole width. SideNav holds no state of its own,
 * so moving it across the breakpoint loses nothing.
 */
export function AppLayout() {
  const { lg } = Grid.useBreakpoint();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <Layout style={{ minHeight: '100svh' }}>
      {lg ? (
        <Layout.Sider width={264} style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'auto' }}>
          <SideNav />
        </Layout.Sider>
      ) : (
        <Drawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          placement="left"
          width="min(280px, 85%)"
          closable={false}
          styles={{ body: { padding: 0, background: palette.navy }, mask: { background: 'rgba(15,31,61,0.42)' } }}
        >
          {/* Following a link closes the rail; tapping the brand or the user block does not. */}
          <div style={{ height: '100%' }} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setNavOpen(false); }}>
            <SideNav />
          </div>
        </Drawer>
      )}
      <Layout style={{ minWidth: 0 }}>
        <Layout.Header
          style={{
            height: 'auto', lineHeight: 'normal', padding: 0, position: 'sticky', top: 0,
            zIndex: 5, borderBottom: `1px solid ${palette.border}`, boxShadow: palette.shadowSm,
          }}
        >
          <TopBar {...(lg ? {} : { onMenu: () => setNavOpen(true) })} />
        </Layout.Header>
        <Layout.Content style={{ padding: 'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px) 40px' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
