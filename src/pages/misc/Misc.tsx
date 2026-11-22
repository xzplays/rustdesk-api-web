import React from 'react';
import { ProColumns, ProFormText, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import CrudPage from '@/components/CrudPage';

export function LoginLogsPage() {
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '用户 ID', dataIndex: 'user_id', width: 90 },
    { title: '客户端', dataIndex: 'client', width: 110 },
    { title: '设备 ID', dataIndex: 'device_id', search: false },
    { title: 'UUID', dataIndex: 'uuid', search: false, ellipsis: true },
    { title: 'IP', dataIndex: 'ip', width: 140 },
    { title: '类型', dataIndex: 'type', width: 100, search: false },
    { title: '平台', dataIndex: 'platform', width: 100, search: false },
    { title: '时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="login_log"
      title="登录日志"
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1300}
      formItems={null}
    />
  );
}

export function UserTokensPage() {
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '用户 ID', dataIndex: 'user_id', width: 90 },
    { title: '设备 UUID', dataIndex: 'device_uuid', search: false, ellipsis: true },
    { title: '设备 ID', dataIndex: 'device_id', search: false },
    {
      title: 'Token',
      dataIndex: 'token',
      search: false,
      ellipsis: true,
      render: (_, r) => <Typography.Text copyable={{ text: r.token }}>{String(r.token || '').slice(0, 24)}…</Typography.Text>,
    },
    {
      title: '过期时间',
      dataIndex: 'expired_at',
      search: false,
      width: 170,
      render: (_, r) => (r.expired_at ? new Date(r.expired_at * 1000).toLocaleString('zh-CN', { hour12: false }) : '-'),
    },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="user_token"
      title="访问令牌"
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1200}
      formItems={null}
    />
  );
}

export function OauthPage() {
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '名称', dataIndex: 'op' },
    { title: '类型', dataIndex: 'oauth_type', width: 110 },
    { title: 'Client ID', dataIndex: 'client_id', search: false, ellipsis: true },
    {
      title: '自动注册',
      dataIndex: 'auto_register',
      width: 100,
      search: false,
      render: (_, r) => (r.auto_register ? <Tag color="green">开</Tag> : <Tag>关</Tag>),
    },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="oauth"
      title="OAuth 提供商"
      columns={columns}
      scrollX={1100}
      formItems={
        <>
          <ProFormText name="op" label="显示名称" rules={[{ required: true }]} />
          <ProFormSelect
            name="oauth_type"
            label="类型"
            options={[
              { label: 'GitHub', value: 'github' },
              { label: 'Google', value: 'google' },
              { label: 'OIDC', value: 'oidc' },
              { label: 'WebAuth', value: 'webauth' },
              { label: 'LinuxDo', value: 'linuxdo' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText name="client_id" label="Client ID" rules={[{ required: true }]} />
          <ProFormText.Password name="client_secret" label="Client Secret" rules={[{ required: true }]} />
          <ProFormText name="issuer" label="Issuer (OIDC)" placeholder="https://example.com" />
          <ProFormText name="scopes" label="Scopes" placeholder="openid profile email" />
          <ProFormSwitch name="auto_register" label="自动注册" />
          <ProFormSwitch name="pkce_enable" label="启用 PKCE" />
        </>
      }
    />
  );
}

export function ShareRecordsPage() {
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '用户 ID', dataIndex: 'user_id', width: 90 },
    { title: '设备 ID', dataIndex: 'peer_id' },
    { title: '分享 Token', dataIndex: 'share_token', search: false, ellipsis: true },
    { title: '密码类型', dataIndex: 'password_type', width: 110, search: false },
    {
      title: '过期时间',
      dataIndex: 'expire',
      search: false,
      width: 170,
      render: (_, r) => (r.expire ? new Date(r.expire * 1000).toLocaleString('zh-CN', { hour12: false }) : '永久'),
    },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="share_record"
      title="分享记录"
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1200}
      formItems={null}
    />
  );
}
