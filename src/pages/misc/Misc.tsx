import React from 'react';
import { ProColumns, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export function LoginLogsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 90 },
    {
      title: t('fields.client'),
      dataIndex: 'client',
      width: 130,
      render: (_, r) =>
        r.client && r.client !== '-'
          ? t(`values.${r.client}`, { defaultValue: r.client })
          : '-',
    },
    { title: t('fields.deviceId'), dataIndex: 'device_id', search: false, width: 150 },
    { title: t('fields.ip'), dataIndex: 'ip', width: 140 },
    {
      title: t('fields.type'),
      dataIndex: 'type',
      width: 110,
      search: false,
      render: (_, r) =>
        r.type ? t(`values.${r.type}`, { defaultValue: r.type }) : '-',
    },
    { title: t('fields.os'), dataIndex: 'platform', width: 110, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="login_log"
      title={t('pages.loginLogs')}
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1090}
      formItems={null}
    />
  );
}

export function UserTokensPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 90 },
    { title: t('fields.deviceUuid'), dataIndex: 'device_uuid', search: false, ellipsis: true },
    { title: t('fields.deviceId'), dataIndex: 'device_id', search: false, width: 150 },
    {
      title: t('fields.token'),
      dataIndex: 'token',
      search: false,
      ellipsis: true,
      render: (_, r) => (
        <Typography.Text copyable={{ text: r.token }}>
          {String(r.token || '').slice(0, 24)}…
        </Typography.Text>
      ),
    },
    {
      title: t('fields.expiredAt'),
      dataIndex: 'expired_at',
      search: false,
      width: 170,
      render: (_, r) =>
        r.expired_at
          ? new Date(r.expired_at * 1000).toLocaleString(undefined, { hour12: false })
          : '-',
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="user_token"
      title={t('pages.userTokens')}
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
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.name'), dataIndex: 'op' },
    { title: t('fields.type'), dataIndex: 'oauth_type', width: 120 },
    { title: t('fields.clientId'), dataIndex: 'client_id', search: false, ellipsis: true },
    {
      title: t('fields.autoRegister'),
      dataIndex: 'auto_register',
      width: 120,
      search: false,
      render: (_, r) =>
        r.auto_register ? (
          <Tag color="green">{t('common.yes')}</Tag>
        ) : (
          <Tag>{t('common.no')}</Tag>
        ),
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="oauth"
      title={t('pages.oauth')}
      columns={columns}
      scrollX={1100}
      formItems={
        <>
          <ProFormText name="op" label={t('fields.name')} rules={[{ required: true }]} />
          <ProFormSelect
            name="oauth_type"
            label={t('fields.type')}
            options={[
              { label: 'GitHub', value: 'github' },
              { label: 'Google', value: 'google' },
              { label: 'OIDC', value: 'oidc' },
              { label: 'WebAuth', value: 'webauth' },
              { label: 'LinuxDo', value: 'linuxdo' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText name="client_id" label={t('fields.clientId')} rules={[{ required: true }]} />
          <ProFormText.Password
            name="client_secret"
            label={t('fields.clientSecret')}
            rules={[{ required: true }]}
          />
          <ProFormText name="issuer" label={t('fields.issuer')} placeholder="https://example.com" />
          <ProFormText name="scopes" label={t('fields.scopes')} placeholder="openid profile email" />
          <ProFormSwitch name="auto_register" label={t('fields.autoRegister')} />
          <ProFormSwitch name="pkce_enable" label={t('fields.pkce')} />
        </>
      }
    />
  );
}

export function ShareRecordsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 90 },
    { title: t('fields.peerId'), dataIndex: 'peer_id', width: 150 },
    { title: t('fields.token'), dataIndex: 'share_token', search: false, ellipsis: true },
    { title: t('fields.type'), dataIndex: 'password_type', width: 130, search: false },
    {
      title: t('fields.expiredAt'),
      dataIndex: 'expire',
      search: false,
      width: 170,
      render: (_, r) =>
        r.expire
          ? new Date(r.expire * 1000).toLocaleString(undefined, { hour12: false })
          : t('common.never'),
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="share_record"
      title={t('pages.shareRecords')}
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1200}
      formItems={null}
    />
  );
}
