import { App, Button, Form, Input, Popconfirm, Skeleton } from 'antd';
import { DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ROLE_LABEL } from '@/constants/roles';
import { apiMessage } from '@/core/api/api-helpers';
import { DataTable, FilterChips, FormDrawer, PageHeader, StatusTag, useSearchParam } from '@/shared';
import type { User } from '@/types';
import { exportCsv } from '@/utils/exportCsv';
import { dateLabel } from '@/utils/formatters';
import { statusChips } from '@/utils/status';
import { UserForm } from '../components/UserForm';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks/useUsers';
import type { UserInput } from '../types/users.types';

const columns: ColumnsType<User> = [
  { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Roles', dataIndex: 'roles', render: (roles: User['roles']) => roles.map((r) => ROLE_LABEL[r]).join(', ') },
  { title: 'Created', dataIndex: 'createdAt', render: (iso: string) => dateLabel(iso), sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
  { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusTag value={s} /> },
];

/**
 * List, search, filter, create, edit, delete. The open record lives in the URL (`/users/new`,
 * `/users/:id`) so a drawer is linkable and the back button closes it.
 */
export function UsersPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useSearchParam('q');
  const [status, setStatus] = useSearchParam('status');
  const [form] = Form.useForm<UserInput>();

  const { data, isPending, error } = useUsers(search);
  const create = useCreateUser();
  const update = useUpdateUser();
  const remove = useDeleteUser();

  const rows = useMemo(() => (data?.items ?? []).filter((u) => !status || u.status === status), [data, status]);
  const isNew = id === 'new';
  const editing = isNew ? undefined : data?.items.find((u) => String(u.id) === id);
  const open = isNew || editing !== undefined;

  // The form follows the record in the URL, not the other way round.
  useEffect(() => {
    if (editing) form.setFieldsValue({ name: editing.name, email: editing.email, roles: [...editing.roles], status: editing.status });
    else form.resetFields();
  }, [editing, isNew, form]);

  const close = () => navigate(ROUTES.USERS);
  const fail = (e: unknown) => void message.error(apiMessage(e));

  const submit = async () => {
    const values = await form.validateFields();
    if (editing) {
      update.mutate({ id: editing.id, input: values }, { onSuccess: () => { void message.success('User updated'); close(); }, onError: fail });
    } else {
      create.mutate(values, { onSuccess: () => { void message.success('Invitation sent'); close(); }, onError: fail });
    }
  };

  const download = () =>
    exportCsv('users', ['Name', 'Email', 'Roles', 'Created', 'Status'],
      rows.map((u) => [u.name, u.email, u.roles.join('; '), u.createdAt, u.status]));

  return (
    <div className="page-enter">
      <PageHeader
        kicker="Administration"
        title="Users"
        description="Everyone who can sign in, and what they may do."
        primaryLabel="Invite user"
        onPrimary={() => navigate(ROUTES.USER('new'))}
        extra={<Button icon={<DownloadOutlined />} onClick={download} disabled={rows.length === 0}>Export</Button>}
      />

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          prefix={<SearchOutlined style={{ opacity: 0.55 }} />}
          style={{ flex: '0 1 280px' }}
          aria-label="Search users"
        />
        <FilterChips chips={statusChips(data?.items ?? [], (u) => u.status)} active={status || null} onToggle={(v) => setStatus(v === status ? '' : v)} />
      </div>

      {error && <div style={{ marginBottom: 12 }}><StatusTag value="failed" /> <span className="muted">{apiMessage(error)}</span></div>}
      {isPending ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <DataTable<User>
          caption="Users"
          rowKey="id"
          columns={columns}
          dataSource={rows}
          onRow={(u) => ({ onClick: () => navigate(ROUTES.USER(u.id)), className: String(u.id) === id ? 'row-selected' : '' })}
        />
      )}

      <FormDrawer
        open={open}
        kicker={isNew ? 'New user' : 'Edit user'}
        title={editing?.name ?? 'Invite a user'}
        onClose={close}
        onSubmit={() => void submit()}
        submitting={create.isPending || update.isPending}
        submitLabel={isNew ? 'Send invitation' : 'Save changes'}
        footerStart={editing && (
          <Popconfirm
            title="Delete this user?"
            description="This cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => remove.mutate(editing.id, { onSuccess: () => { void message.success('User deleted'); close(); }, onError: fail })}
          >
            <Button danger type="text" icon={<DeleteOutlined />} loading={remove.isPending}>Delete</Button>
          </Popconfirm>
        )}
      >
        <UserForm form={form} isNew={isNew} />
      </FormDrawer>
    </div>
  );
}
