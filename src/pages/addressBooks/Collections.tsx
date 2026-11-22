import React from 'react';
import { ProColumns, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import CrudPage from '@/components/CrudPage';

const columns: ProColumns<any>[] = [
  { title: 'ID', dataIndex: 'id', width: 70, search: false },
  { title: '名称', dataIndex: 'name' },
  { title: '用户 ID', dataIndex: 'user_id', width: 100, search: false },
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
          <ProFormDigit name="user_id" label="用户 ID" min={1} initialValue={1} />
        </>
      }
    />
  );
}

const ruleEnum = {
  1: { text: '只读' },
  2: { text: '读写' },
  3: { text: '完全控制' },
};
const typeEnum = {
  1: { text: '个人' },
  2: { text: '群组' },
};

export function CollectionRulesPage() {
  const cols: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '收藏 ID', dataIndex: 'collection_id', width: 100, search: false },
    { title: '权限', dataIndex: 'rule', width: 110, valueType: 'select', valueEnum: ruleEnum, search: false },
    { title: '类型', dataIndex: 'type', width: 90, valueType: 'select', valueEnum: typeEnum, search: false },
    { title: '目标 ID', dataIndex: 'to_id', width: 100, search: false },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];
  return (
    <CrudPage
      module="address_book_collection_rule"
      title="收藏规则"
      columns={cols}
      formItems={
        <>
          <ProFormDigit name="collection_id" label="收藏 ID" min={1} rules={[{ required: true }]} />
          <ProFormSelect name="rule" label="权限" options={[
            { label: '只读', value: 1 },
            { label: '读写', value: 2 },
            { label: '完全控制', value: 3 },
          ]} initialValue={1} rules={[{ required: true }]} />
          <ProFormSelect name="type" label="类型" options={[
            { label: '个人', value: 1 },
            { label: '群组', value: 2 },
          ]} initialValue={1} rules={[{ required: true }]} />
          <ProFormDigit name="to_id" label="目标 ID (用户/群组)" min={1} rules={[{ required: true }]} />
        </>
      }
    />
  );
}
