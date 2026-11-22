import React from 'react';
import { ProColumns, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '名称', dataIndex: 'name' },
  { title: '用户 ID', dataIndex: 'user_id', width: 100, search: false },
  { title: '规则', dataIndex: 'rule', width: 90, search: false },
  { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
];

export default function CollectionsPage() {
  return (
    <CrudPage
      module="address_book_collection"
      title="地址簿收藏"
      columns={columns}
      formItems={
        <>
          <ProFormText name="name" label="名称" rules={[{ required: true }]} />
          <ProFormSelect
            name="rule"
            label="可见规则"
            options={[
              { label: '私有', value: 1 },
              { label: '共享', value: 2 },
            ]}
            initialValue={1}
          />
        </>
      }
    />
  );
}

export function CollectionRulesPage() {
  const cols: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '收藏 ID', dataIndex: 'collection_id', width: 100, search: false },
    { title: '规则类型', dataIndex: 'rule_type', width: 110, search: false },
    { title: '规则值', dataIndex: 'rule_value', search: false },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="address_book_collection_rule"
      title="地址簿收藏规则"
      columns={cols}
      formItems={
        <>
          <ProFormText name="collection_id" label="收藏 ID" />
          <ProFormText name="rule_type" label="规则类型" />
          <ProFormText name="rule_value" label="规则值" />
        </>
      }
    />
  );
}
