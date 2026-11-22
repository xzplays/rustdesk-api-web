import React from 'react';
import { ProColumns, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export default function PeersPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.rowId'), dataIndex: 'row_id', width: 110, search: false },
    { title: t('fields.peerId'), dataIndex: 'id', key: 'idStr', width: 150, search: false, copyable: true },
    { title: t('fields.peerId'), dataIndex: 'id', key: 'idSearch', hideInTable: true },
    { title: t('fields.alias'), dataIndex: 'alias', search: false, width: 140 },
    { title: t('fields.hostname'), dataIndex: 'hostname', width: 160 },
    { title: t('fields.username'), dataIndex: 'username', width: 120 },
    { title: t('fields.os'), dataIndex: 'os', search: false, ellipsis: true },
    { title: t('fields.version'), dataIndex: 'version', search: false, width: 90 },
    { title: t('fields.lastOnlineIp'), dataIndex: 'last_online_ip', search: false, width: 140 },
    {
      title: t('fields.lastOnlineTime'),
      dataIndex: 'last_online_time',
      search: false,
      width: 170,
      render: (_, r) =>
        r.last_online_time
          ? new Date(r.last_online_time * 1000).toLocaleString(undefined, { hour12: false })
          : '-',
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="peer"
      title={t('pages.peers')}
      rowKey="row_id"
      columns={columns}
      canCreate={false}
      canBatchDelete
      batchIdKey="row_ids"
      scrollX={1600}
      formItems={
        <>
          <ProFormText name="alias" label={t('fields.alias')} />
          <ProFormText name="hostname" label={t('fields.hostname')} />
          <ProFormDigit name="group_id" label={t('fields.groupId')} />
        </>
      }
    />
  );
}
