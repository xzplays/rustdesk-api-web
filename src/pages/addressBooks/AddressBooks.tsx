import React from 'react';
import { ProColumns, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Tag } from 'antd';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'row_id', width: 70, search: false },
  { title: '设备 ID', dataIndex: 'id', copyable: true },
  { title: '别名', dataIndex: 'alias', search: false },
  { title: '主机名', dataIndex: 'hostname', search: false },
  { title: '用户名', dataIndex: 'username', search: false },
  { title: '平台', dataIndex: 'platform', search: false, width: 100 },
  {
    title: '标签',
    dataIndex: 'tags',
    search: false,
    render: (_, r) =>
      Array.isArray(r.tags) ? r.tags.map((t: string) => <Tag key={t}>{t}</Tag>) : '-',
  },
  { title: '所属用户', dataIndex: 'user_id', width: 100, search: false },
  { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
];

export default function AddressBooksPage() {
  return (
    <CrudPage
      module="address_book"
      title="地址簿"
      rowKey="row_id"
      columns={columns}
      scrollX={1400}
      formItems={
        <>
          <ProFormText name="id" label="设备 ID" rules={[{ required: true }]} />
          <ProFormText name="username" label="用户名" />
          <ProFormText name="hostname" label="主机名" />
          <ProFormText name="alias" label="别名" />
          <ProFormText name="platform" label="平台" />
          <ProFormDigit name="user_id" label="用户 ID" />
        </>
      }
    />
  );
}
