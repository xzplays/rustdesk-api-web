import React from 'react';
import { ProColumns, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '名称', dataIndex: 'name' },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    valueType: 'select',
    valueEnum: { 1: { text: '默认组' }, 2: { text: '共享组' } },
  },
  { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
];

export default function GroupsPage() {
  return (
    <CrudPage
      module="group"
      title="用户组"
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label="名称" rules={[{ required: true }]} />
          <ProFormSelect
            name="type"
            label="类型"
            options={[
              { label: '默认组', value: 1 },
              { label: '共享组', value: 2 },
            ]}
            initialValue={1}
          />
        </>
      }
    />
  );
}
