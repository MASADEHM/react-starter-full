import { Alert, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { apiMessage } from '@/core/api/api-helpers';
import { palette } from '@/core/theme/theme';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../types/auth.types';

/** Seeded by mock/api.ts; shown only on the dev server so a first run needs no reading. */
const MOCK_ACCOUNTS = ['admin@example.com', 'user@example.com'];
const MOCK_PASSWORD = 'password';

export function LoginPage() {
  const { isSignedIn, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm<LoginRequest>();

  if (isSignedIn) return <Navigate to={ROUTES.HOME} replace />;

  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;
  const submit = (values: LoginRequest) =>
    login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) });

  return (
    <div className="login-grid" style={{ background: palette.canvas }}>
      <aside style={{ background: palette.navy, color: palette.onNavy, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="display" style={{ fontSize: 40, lineHeight: 1.05, color: palette.white, maxWidth: 420 }}>{env.appName}</div>
        {env.appTagline && <p style={{ fontSize: 15, marginTop: 16, maxWidth: 400, color: palette.onNavyMuted, lineHeight: 1.5 }}>{env.appTagline}</p>}
      </aside>

      <main style={{ display: 'grid', placeItems: 'center', padding: 'clamp(16px, 5vw, 40px)' }}>
        <div style={{ width: 'min(440px, 100%)' }}>
          <div className="kicker">{env.appName}</div>
          <h1 className="display" style={{ fontSize: 28, margin: '6px 0 22px' }}>Sign in</h1>

          {login.isError && <Alert type="error" showIcon message={apiMessage(login.error)} style={{ marginBottom: 16 }} />}

          <Form<LoginRequest> form={form} layout="vertical" onFinish={submit} requiredMark={false}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter your email' }]}>
              <Input size="large" autoFocus autoComplete="username" prefix={<UserOutlined style={{ color: palette.faint }} />} />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
              <Input.Password size="large" autoComplete="current-password" prefix={<LockOutlined style={{ color: palette.faint }} />} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={login.isPending} style={{ marginTop: 4, fontWeight: 600 }}>
              Sign in
            </Button>
          </Form>

          {env.isDev && !import.meta.env.VITE_API_URL && (
            <div style={{ marginTop: 28, padding: '14px 16px', border: `1px dashed ${palette.borderStrong}`, borderRadius: 6, background: palette.white }}>
              <div className="section-label" style={{ border: 0, padding: 0, marginBottom: 8 }}>Mock accounts</div>
              {MOCK_ACCOUNTS.map((email) => (
                <button
                  key={email}
                  type="button"
                  className="list-row"
                  onClick={() => { form.setFieldsValue({ email, password: MOCK_PASSWORD }); login.reset(); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', font: 'inherit', background: 'transparent', border: 0, borderRadius: 4, padding: '6px 8px', cursor: 'pointer', color: palette.text, fontSize: 13 }}
                >
                  {email}
                </button>
              ))}
              <div className="muted" style={{ fontSize: 12, marginTop: 8, paddingInline: 8 }}>
                Password for every account: <strong>{MOCK_PASSWORD}</strong>. Select one to fill the form.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
