import React from 'react';
import { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import CrudPage from '@/components/CrudPage';

const actionEnum = { new: { text: '发起', status: 'Processing' }, close: { text: '结束', status: 'Default' } };

const reasonEnum: Record<string, { text: string }> = {
  ok: { text: 'ok' },
  'token is empty': { text: 'token is empty' },
  'token not found': { text: 'token not found' },
  'token expired': { text: 'token expired' },
  'user not found': { text: 'user not found' },
  'user disabled': { text: 'user disabled' },
};

const loginColumns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '设备 ID', dataIndex: 'guid' },
  { title: 'UUID', dataIndex: 'uuid', search: false, ellipsis: true },
  { title: 'IP', dataIndex: 'ip', width: 140 },
  { title: '用户', dataIndex: 'username' },
  { title: '用户 ID', dataIndex: 'user_id', width: 90, search: false },
  {
    title: '结果',
    dataIndex: 'result',
    width: 140,
    valueType: 'select',
    valueEnum: reasonEnum,
    render: (_, r) => (
      <Tag color={r.result === 'ok' ? 'green' : 'red'}>{r.result || '-'}</Tag>
    ),
  },
  { title: '原因', dataIndex: 'reason', search: false, ellipsis: true },
  { title: '时间', dataIndex: 'created_at', search: false, width: 170 },
];

export function AuditLoginPage() {
  return (
    <CrudPage
      module="audit_login"
      title="登录审计"
      columns={loginColumns}
      canCreate={false}
      canEdit={false}
      canDelete={false}
      scrollX={1300}
      formItems={null}
    />
  );
}

const connColumns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '动作', dataIndex: 'action', width: 90, valueType: 'select', valueEnum: actionEnum },
  { title: '被控端', dataIndex: 'peer_id' },
  { title: '发起端', dataIndex: 'from_peer', search: false },
  { title: '发起人', dataIndex: 'from_name', search: false },
  { title: 'IP', dataIndex: 'ip', width: 140 },
  { title: '连接 ID', dataIndex: 'conn_id', width: 100, search: false },
  { title: '时间', dataIndex: 'created_at', search: false, width: 170 },
];

export function AuditConnPage() {
  return (
    <CrudPage
      module="audit_conn"
      title="连接审计"
      columns={connColumns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1300}
      formItems={null}
    />
  );
}

const fileColumns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '被控端', dataIndex: 'peer_id' },
  { title: '发起端', dataIndex: 'from_peer', search: false },
  { title: '路径', dataIndex: 'path', ellipsis: true },
  { title: '文件', dataIndex: 'is_file', width: 80, search: false, render: (_, r) => (r.is_file ? '文件' : '目录') },
  { title: '数量', dataIndex: 'num', width: 80, search: false },
  { title: 'IP', dataIndex: 'ip', width: 140, search: false },
  { title: '时间', dataIndex: 'created_at', search: false, width: 170 },
];

export function AuditFilePage() {
  return (
    <CrudPage
      module="audit_file"
      title="文件传输审计"
      columns={fileColumns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1400}
      formItems={null}
    />
  );
}
