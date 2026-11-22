import React from 'react';
import { ProColumns } from '@ant-design/pro-components';
import { Badge, Grid, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';
import { AUDIT_REASONS, reasonLabel } from '@/utils/labels';

export function AuditLoginPage() {
  const { t } = useTranslation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const reasonEnum = Object.fromEntries(AUDIT_REASONS.map((r) => [r, { text: reasonLabel(r, t) }]));

  const idColumn: ProColumns<any> = {
    title: t('fields.id'),
    dataIndex: 'id',
    width: 70,
    search: false,
    responsive: ['md'],
  };
  const peerColumn: ProColumns<any> = {
    title: t('fields.peerId'),
    dataIndex: 'guid',
    width: isMobile ? 112 : 150,
  };
  const resultColumn: ProColumns<any> = {
    title: t('fields.result'),
    dataIndex: 'result',
    width: isMobile ? 84 : 150,
    valueType: 'select',
    valueEnum: reasonEnum,
    render: (_, r) => (
      <Tag color={r.result === 'ok' ? 'green' : 'red'}>
        {r.result === 'ok' ? t('audit.resultOk') : t('audit.resultFail')}
      </Tag>
    ),
  };
  const reasonColumn: ProColumns<any> = {
    title: t('fields.reason'),
    dataIndex: 'reason',
    search: false,
    width: isMobile ? 120 : undefined,
    ellipsis: true,
    render: (_, r) => reasonLabel(r.reason, t),
  };
  const createdColumn: ProColumns<any> = {
    title: t('fields.createdAt'),
    dataIndex: 'created_at',
    search: false,
    width: 170,
  };
  const ipColumn: ProColumns<any> = { title: t('fields.ip'), dataIndex: 'ip', width: 140 };
  const userColumn: ProColumns<any> = {
    title: t('fields.username'),
    dataIndex: 'username',
    width: 120,
  };
  const userIdColumn: ProColumns<any> = {
    title: t('fields.userId'),
    dataIndex: 'user_id',
    width: 90,
    search: false,
  };
  const uuidColumn: ProColumns<any> = {
    title: t('fields.uuid'),
    dataIndex: 'uuid',
    search: false,
    ellipsis: true,
  };

  // On phones the verdict must be visible without scrolling, so it moves up.
  const columns: ProColumns<any>[] = isMobile
    ? [peerColumn, resultColumn, reasonColumn, createdColumn, ipColumn, userColumn, userIdColumn, idColumn, uuidColumn]
    : [idColumn, peerColumn, uuidColumn, ipColumn, userColumn, userIdColumn, resultColumn, reasonColumn, createdColumn];

  return (
    <CrudPage
      module="audit_login"
      title={t('pages.auditLogin')}
      columns={columns}
      canCreate={false}
      canEdit={false}
      canDelete={false}
      scrollX={1400}
      formItems={null}
    />
  );
}

export function AuditConnPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false, responsive: ['md'] },
    {
      title: t('fields.action'),
      dataIndex: 'action',
      width: 110,
      valueType: 'select',
      valueEnum: {
        new: { text: t('audit.actionNew') },
        close: { text: t('audit.actionClose') },
      },
      render: (_, r) =>
        r.action === 'new' ? (
          <Badge status="processing" text={t('audit.actionNew')} />
        ) : (
          <Badge status="default" text={t('audit.actionClose')} />
        ),
    },
    { title: t('fields.peerId'), dataIndex: 'peer_id', width: 150 },
    { title: t('fields.fromPeer'), dataIndex: 'from_peer', search: false, width: 150 },
    { title: t('fields.username'), dataIndex: 'from_name', search: false, width: 120 },
    { title: t('fields.ip'), dataIndex: 'ip', width: 140 },
    { title: t('fields.connId'), dataIndex: 'conn_id', width: 120, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="audit_conn"
      title={t('pages.auditConn')}
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1300}
      formItems={null}
    />
  );
}

export function AuditFilePage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false, responsive: ['md'] },
    { title: t('fields.peerId'), dataIndex: 'peer_id', width: 150 },
    { title: t('fields.fromPeer'), dataIndex: 'from_peer', search: false, width: 150 },
    { title: t('fields.path'), dataIndex: 'path', ellipsis: true },
    {
      title: t('fields.isFile'),
      dataIndex: 'is_file',
      width: 90,
      search: false,
      render: (_, r) => (r.is_file ? t('common.yes') : t('common.no')),
    },
    { title: t('fields.num'), dataIndex: 'num', width: 80, search: false },
    { title: t('fields.ip'), dataIndex: 'ip', width: 140, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="audit_file"
      title={t('pages.auditFile')}
      columns={columns}
      canCreate={false}
      canEdit={false}
      canBatchDelete
      scrollX={1400}
      formItems={null}
    />
  );
}

