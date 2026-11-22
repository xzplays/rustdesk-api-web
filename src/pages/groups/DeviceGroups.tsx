import React from 'react';
import { ProColumns, ProFormText } from '@ant-design/pro-components';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '名称', dataIndex: 'name' },
  { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
];

export default function DeviceGroupsPage() {
  return (
    <CrudPage
      module="device_group"
      title="设备分组"
      columns={columns}
      formItems={<ProFormText name="name" label="名称" rules={[{ required: true }]} />}
    />
  );
}
