import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T> extends TableProps<T> {
  /** Read by screen readers; the visual title is the page header. */
  caption: string;
}

/** antd Table with the house styling and sensible defaults. Pass `onRow` to make rows targets. */
export function DataTable<T extends object>({ caption, className, onRow, ...rest }: DataTableProps<T>) {
  return (
    <div className="data-table-wrap">
      <Table<T>
        size="small"
        pagination={{ pageSize: 20, hideOnSinglePage: true, showSizeChanger: false }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Nothing to show.' }}
        {...rest}
        {...(onRow ? { onRow } : {})}
        className={['data-table', onRow ? '' : 'static', className ?? ''].join(' ').trim()}
        caption={<span className="sr-only">{caption}</span>}
      />
    </div>
  );
}
