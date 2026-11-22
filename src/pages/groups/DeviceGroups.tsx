import React from 'react';
import { ProColumns, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export default function DeviceGroupsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.name'), dataIndex: 'name' },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="device_group"
      title={t('pages.deviceGroups')}
      columns={columns}
      formItems={<ProFormText name="name" label={t('fields.name')} rules={[{ required: true }]} />}
    />
  );
}
