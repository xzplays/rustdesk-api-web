import React from 'react';
import { ProColumns, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export default function GroupsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.name'), dataIndex: 'name' },
    {
      title: t('fields.type'),
      dataIndex: 'type',
      width: 140,
      valueType: 'select',
      valueEnum: {
        1: { text: t('fields.defaultGroup') },
        2: { text: t('fields.sharedGroup') },
      },
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="group"
      title={t('pages.groups')}
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label={t('fields.name')} rules={[{ required: true }]} />
          <ProFormSelect
            name="type"
            label={t('fields.type')}
            options={[
              { label: t('fields.defaultGroup'), value: 1 },
              { label: t('fields.sharedGroup'), value: 2 },
            ]}
            initialValue={1}
          />
        </>
      }
    />
  );
}
