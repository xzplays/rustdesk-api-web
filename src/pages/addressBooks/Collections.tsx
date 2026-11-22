import React from 'react';
import { ProColumns, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';

export default function CollectionsPage() {
  const { t } = useTranslation();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.name'), dataIndex: 'name' },
    { title: t('fields.userId'), dataIndex: 'user_id', width: 100, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="address_book_collection"
      title={t('pages.collections')}
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label={t('fields.name')} rules={[{ required: true }]} />
          <ProFormDigit name="user_id" label={t('fields.userId')} min={1} initialValue={1} />
        </>
      }
    />
  );
}

export function CollectionRulesPage() {
  const { t } = useTranslation();

  const ruleOptions = [
    { label: t('fields.ruleRead'), value: 1 },
    { label: t('fields.ruleWrite'), value: 2 },
    { label: t('fields.ruleFull'), value: 3 },
  ];

  const cols: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.collectionId'), dataIndex: 'collection_id', width: 110, search: false },
    {
      title: t('fields.rule'),
      dataIndex: 'rule',
      width: 110,
      valueType: 'select',
      valueEnum: {
        1: { text: t('fields.ruleRead') },
        2: { text: t('fields.ruleWrite') },
        3: { text: t('fields.ruleFull') },
      },
      search: false,
    },
    {
      title: t('fields.type'),
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: { 1: { text: t('fields.typePersonal') }, 2: { text: t('fields.typeGroup') } },
      search: false,
    },
    { title: t('fields.toId'), dataIndex: 'to_id', width: 100, search: false },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <CrudPage
      module="address_book_collection_rule"
      title={t('pages.collectionRules')}
      columns={cols}
      formItems={
        <>
          <ProFormDigit
            name="user_id"
            label={t('fields.owner')}
            min={1}
            initialValue={1}
            tooltip={t('fields.owner')}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            name="collection_id"
            label={t('fields.collectionId')}
            min={1}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="rule"
            label={t('fields.rule')}
            options={ruleOptions}
            initialValue={1}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="type"
            label={t('fields.type')}
            options={[
              { label: t('fields.typePersonal'), value: 1 },
              { label: t('fields.typeGroup'), value: 2 },
            ]}
            initialValue={1}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            name="to_id"
            label={t('fields.toId')}
            min={1}
            tooltip={t('fields.toId')}
            rules={[{ required: true }]}
          />
        </>
      }
    />
  );
}
