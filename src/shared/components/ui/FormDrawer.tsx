import { Button, Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { palette } from '@/core/theme/theme';

export const drawerStyles = {
  body: { padding: '20px 24px' },
  header: { borderBottom: `1px solid ${palette.border}`, padding: '20px 24px 16px' },
  footer: { borderTop: `1px solid ${palette.border}` },
  mask: { background: 'rgba(15,31,61,0.42)' },
};

interface FormDrawerProps {
  open: boolean;
  kicker: string;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  /** Extra footer content, placed at the start (e.g. a delete button). */
  footerStart?: ReactNode;
  children: ReactNode;
}

/** A drawer that hosts a form: titled header, footer with cancel and submit. */
export function FormDrawer({
  open, kicker, title, onClose, onSubmit, submitting = false, submitLabel = 'Save', footerStart, children,
}: FormDrawerProps) {
  return (
    <Drawer
      open={open}
      width="min(540px, 100%)"
      onClose={onClose}
      closable={false}
      // The form inside is mounted from the first render, so a parent may set its fields while closed.
      forceRender
      styles={drawerStyles}
      title={
        <div>
          <div className="kicker">{kicker}</div>
          <h2 className="display" style={{ fontSize: 22, margin: '6px 0 0', lineHeight: 1.2 }}>{title}</h2>
        </div>
      }
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="Close" />}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
          {footerStart && <span style={{ marginInlineEnd: 'auto' }}>{footerStart}</span>}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={submitting} onClick={onSubmit}>{submitLabel}</Button>
        </div>
      }
    >
      {children}
    </Drawer>
  );
}
