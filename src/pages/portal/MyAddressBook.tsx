import React from 'react';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Badge, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { myAddressBook, MyAddressBookEntry } from '../../api';

export default function MyAddressBookPage() {
  const { t } = useTranslation();

  const columns: ProColumns<MyAddressBookEntry>[] = [
    { title: t('fields.peerId'), dataIndex: 'id', copyable: true, width: 150 },
    { title: t('fields.alias'), dataIndex: 'alias', width: 140 },
    { title: t('fields.hostname'), dataIndex: 'hostname', width: 160 },
    { title: t('fields.username'), dataIndex: 'username', width: 120 },
    { title: t('fields.os'), dataIndex: 'platform', width: 120 },
    {
      title: t('nav.tags'),
      dataIndex: 'tags',
      search: false,
      render: (_, r) =>
        Array.isArray(r.tags) && r.tags.length
          ? r.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
          : '-',
    },
    {
      title: t('fields.status'),
      dataIndex: 'online',
      width: 100,
      search: false,
      render: (_, r) =>
        r.online ? <Badge status="success" text="online" /> : <Badge status="default" text="offline" />,
    },
  ];

  return (
    <PageContainer title={t('portal.myAddressBook')} subTitle={t('portal.myAddressBookHint')} ghost>
      <ProTable<MyAddressBookEntry>
        rowKey="row_id"
        cardBordered
        columns={columns}
        options={{ reload: true, density: true, setting: true }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
        request={async (params) => {
          const res = await myAddressBook(params.current || 1, params.pageSize || 20);
          return { data: res.list, success: true, total: res.total };
        }}
        locale={{ emptyText: t('portal.emptyAddressBook') }}
      />
    </PageContainer>
  );
}
