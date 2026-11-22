import React from 'react';
import { ProColumns, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

const COLORS = ['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2', '#1677ff', '#722ed1', '#eb2f96'];

export default function TagsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.name'), dataIndex: 'name' },
    {
      title: t('fields.color'),
      dataIndex: 'color',
      search: false,
      width: 140,
      render: (_, r) => <Tag color={COLORS[(r.color ?? 0) % COLORS.length]}>{r.name}</Tag>,
    },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 100, search: false },
    { title: t('fields.collectionId'), dataIndex: 'collection_id', width: 120, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="tag"
      title={t('pages.tags')}
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label={t('fields.name')} rules={[{ required: true }]} />
          <ProFormDigit
            name="color"
            label={t('fields.color')}
            min={0}
            max={7}
            initialValue={5}
            extra="0-7"
          />
          <ProFormDigit name="user_id" label={t('fields.userId')} min={0} />
          <ProFormDigit name="collection_id" label={t('fields.collectionId')} min={0} />
        </>
      }
    />
  );
}
