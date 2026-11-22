import React from 'react';
import { ProColumns, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Tag } from 'antd';
import CrudPage from '@/components/CrudPage';

const COLORS = ['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2', '#1677ff', '#722ed1', '#eb2f96'];

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '名称', dataIndex: 'name' },
  {
    title: '颜色',
    dataIndex: 'color',
    search: false,
    width: 120,
    render: (_, r) => <Tag color={COLORS[(r.color ?? 0) % COLORS.length]}>{r.name}</Tag>,
  },
  { title: '用户 ID', dataIndex: 'user_id', width: 100, search: false },
  { title: '地址簿 ID', dataIndex: 'collection_id', width: 110, search: false },
  { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
];

export default function TagsPage() {
  return (
    <CrudPage
      module="tag"
      title="标签"
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label="名称" rules={[{ required: true }]} />
          <ProFormDigit name="color" label="颜色编号 (0-7)" min={0} max={7} initialValue={5} />
          <ProFormDigit name="user_id" label="用户 ID" min={0} />
          <ProFormDigit name="collection_id" label="地址簿 ID" min={0} />
        </>
      }
    />
  );
}
