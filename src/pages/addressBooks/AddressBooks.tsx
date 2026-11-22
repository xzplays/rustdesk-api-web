import React from 'react';
import { ProColumns, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export default function AddressBooksPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.rowId'), dataIndex: 'row_id', width: 90, search: false },
    { title: t('fields.peerId'), dataIndex: 'id', copyable: true, width: 150 },
    { title: t('fields.alias'), dataIndex: 'alias', search: false, width: 140 },
    { title: t('fields.hostname'), dataIndex: 'hostname', search: false, width: 160 },
    { title: t('fields.username'), dataIndex: 'username', search: false, width: 120 },
    { title: t('fields.os'), dataIndex: 'platform', search: false, width: 110 },
    {
      title: t('nav.tags'),
      dataIndex: 'tags',
      search: false,
      render: (_, r) =>
        Array.isArray(r.tags) ? r.tags.map((tag: string) => <Tag key={tag}>{tag}</Tag>) : '-',
    },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 100, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="address_book"
      title={t('pages.addressBooks')}
      rowKey="row_id"
      columns={columns}
      scrollX={1500}
      formItems={
        <>
          <ProFormText name="id" label={t('fields.peerId')} rules={[{ required: true }]} />
          <ProFormText name="username" label={t('fields.username')} />
          <ProFormText name="hostname" label={t('fields.hostname')} />
          <ProFormText name="alias" label={t('fields.alias')} />
          <ProFormText name="platform" label={t('fields.os')} />
          <ProFormDigit name="user_id" label={t('fields.userId')} />
        </>
      }
    />
  );
}
