import React from 'react';
import { ProColumns, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Tag } from 'antd';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: '序号', dataIndex: 'row_id', width: 110, search: false },
  { title: '设备 ID', dataIndex: 'id', key: 'idStr', width: 140, search: false, copyable: true },
  { title: '设备 ID(搜索)', dataIndex: 'id', key: 'idSearch', hideInTable: true },
  { title: '别名', dataIndex: 'alias', search: false },
  { title: '主机名', dataIndex: 'hostname' },
  { title: '用户名', dataIndex: 'username' },
  { title: '系统', dataIndex: 'os', search: false, ellipsis: true },
  { title: '版本', dataIndex: 'version', search: false, width: 90 },
  { title: '最近 IP', dataIndex: 'last_online_ip', search: false, width: 140 },
  {
    title: '最近在线',
    dataIndex: 'last_online_time',
    search: false,
    width: 170,
    render: (_, r) =>
      r.last_online_time ? new Date(r.last_online_time * 1000).toLocaleString('zh-CN', { hour12: false }) : '-',
  },
  { title: '首次出现', dataIndex: 'created_at', search: false, width: 170 },
];

export default function PeersPage() {
  return (
    <CrudPage
      module="peer"
      title="设备"
      rowKey="row_id"
      columns={columns}
      canCreate={false}
      canBatchDelete
      batchIdKey="row_ids"
      scrollX={1500}
      extraParams={{}}
      formItems={
        <>
          <ProFormText name="id" label="设备 ID" />
          <ProFormText name="alias" label="别名" />
          <ProFormText name="hostname" label="主机名" />
          <ProFormDigit name="group_id" label="设备分组 ID" />
        </>
      }
    />
  );
}
