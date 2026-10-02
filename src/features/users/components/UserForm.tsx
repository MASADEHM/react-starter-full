import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import { ROLES, ROLE_LABEL } from '@/constants/roles';
import { USER_STATUS } from '@/constants/statuses';
import { statusLabel } from '@/utils/status';
import type { UserInput } from '../types/users.types';

const roleOptions = Object.values(ROLES).map((r) => ({ value: r, label: ROLE_LABEL[r] }));
const statusOptions = Object.values(USER_STATUS).map((s) => ({ value: s, label: statusLabel(s) }));

/** The fields only; the drawer around it owns submit and cancel. */
export function UserForm({ form, isNew }: { form: FormInstance<UserInput>; isNew: boolean }) {
  return (
    <Form<UserInput> form={form} layout="vertical" requiredMark={false} initialValues={{ roles: [ROLES.USER], status: USER_STATUS.INVITED }}>
      <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Enter a name' }]}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="roles" label="Roles" rules={[{ required: true, message: 'Choose at least one role' }]}>
        <Select mode="multiple" options={roleOptions} />
      </Form.Item>
      {!isNew && (
        <Form.Item name="status" label="Status">
          <Select options={statusOptions} />
        </Form.Item>
      )}
    </Form>
  );
}
