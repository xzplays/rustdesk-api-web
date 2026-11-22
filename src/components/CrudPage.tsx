import React, { useRef, useState } from 'react';
import { ProTable, ProColumns, ModalForm, ProForm } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { batchRemove, create, list, remove, update } from '../api';

export interface CrudPageProps {
  module: string;
  title: string;
  rowKey?: string;
  columns: ProColumns<any>[];
  /** ProForm children used by the create/edit modal. */
  formItems: React.ReactNode;
  createDefaults?: Record<string, any>;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canBatchDelete?: boolean;
  /** JSON key expected by the batchDelete endpoint (peer uses row_ids). */
  batchIdKey?: string;
  extraParams?: Record<string, any>;
  /** Extra row actions rendered before edit/delete. */
  rowActions?: (record: any) => React.ReactNode;
  toolBarExtra?: React.ReactNode;
  scrollX?: number;
  /** Transform record before filling the edit form. */
  toFormValues?: (record: any) => Record<string, any>;
}

/**
 * One ProTable-driven CRUD page for the /api/admin/<module>/{list,create,update,delete}
 * convention. Keeps every module page short and visually consistent.
 */
export default function CrudPage(props: CrudPageProps) {
  const {
    module,
    title,
    rowKey = 'id',
    columns,
    formItems,
    createDefaults,
    canCreate = true,
    canEdit = true,
    canDelete = true,
    canBatchDelete = false,
    batchIdKey = 'ids',
    extraParams,
    rowActions,
    toolBarExtra,
    scrollX,
    toFormValues,
  } = props;

  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<React.Key[]>([]);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    setOpen(true);
  };

  const hasActions = canEdit || canDelete || !!rowActions;

  const actionColumn: ProColumns<any> = {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 180,
    fixed: 'right',
    render: (_, record) => [
      ...(rowActions ? [rowActions(record)] : []),
      canEdit ? (
        <a key="edit" onClick={() => openEdit(record)}>
          <EditOutlined /> 编辑
        </a>
      ) : null,
      canDelete ? (
        <Popconfirm
          key="del"
          title="确认删除这条记录？"
          onConfirm={async () => {
            await remove(module, record[rowKey]);
            message.success('已删除');
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DeleteOutlined /> 删除
          </a>
        </Popconfirm>
      ) : null,
    ],
  };

  return (
    <>
      <ProTable<any>
        actionRef={actionRef}
        rowKey={rowKey}
        headerTitle={title}
        columns={hasActions ? [...columns, actionColumn] : columns}
        scroll={scrollX ? { x: scrollX } : undefined}
        search={{ labelWidth: 'auto', defaultCollapsed: true }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
        rowSelection={
          canBatchDelete
            ? {
                selectedRowKeys: selected,
                onChange: setSelected,
              }
            : undefined
        }
        request={async (params) => {
          const { current, pageSize, ...rest } = params as any;
          const res = await list(module, {
            page: current,
            page_size: pageSize,
            ...extraParams,
            ...rest,
          });
          return { data: res.list, success: true, total: res.total };
        }}
        toolBarRender={() => [
          toolBarExtra,
          canBatchDelete ? (
            <Popconfirm
              key="batch"
              title={`确认删除选中的 ${selected.length} 条记录？`}
              disabled={!selected.length}
              onConfirm={async () => {
                await batchRemove(module, selected as any[], batchIdKey);
                message.success('已批量删除');
                setSelected([]);
                actionRef.current?.reload();
              }}
            >
              <Button danger disabled={!selected.length}>
                批量删除
              </Button>
            </Popconfirm>
          ) : null,
          canCreate ? (
            <Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              新建
            </Button>
          ) : null,
        ]}
      />

      <ModalForm
        title={editing ? `编辑${title}` : `新建${title}`}
        open={open}
        formRef={formRef}
        modalProps={{ destroyOnClose: true, onCancel: () => setOpen(false) }}
        initialValues={editing ? (toFormValues ? toFormValues(editing) : editing) : createDefaults}
        onFinish={async (values) => {
          if (editing) {
            await update(module, { ...editing, ...values });
          } else {
            await create(module, values);
          }
          message.success('已保存');
          setOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProForm.Group>{formItems}</ProForm.Group>
      </ModalForm>
    </>
  );
}
