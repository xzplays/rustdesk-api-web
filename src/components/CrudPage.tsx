import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ProColumns, ModalForm, ProForm } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { batchRemove, create, list, remove, update } from '../api';

export interface CrudPageProps {
  module: string;
  title: string;
  description?: string;
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
    description,
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

  const { t } = useTranslation();
  const { message } = App.useApp();
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
    title: t('common.actions'),
    valueType: 'option',
    key: 'option',
    width: 168,
    fixed: 'right',
    render: (_, record) => [
      ...(rowActions ? [<React.Fragment key="extra">{rowActions(record)}</React.Fragment>] : []),
      canEdit ? (
        <a key="edit" onClick={() => openEdit(record)}>
          <EditOutlined /> {t('common.edit')}
        </a>
      ) : null,
      canDelete ? (
        <Popconfirm
          key="del"
          title={t('common.confirmDelete')}
          okText={t('common.confirm')}
          cancelText={t('common.cancel')}
          onConfirm={async () => {
            await remove(module, record[rowKey]);
            message.success(t('common.deleted'));
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DeleteOutlined /> {t('common.delete')}
          </a>
        </Popconfirm>
      ) : null,
    ],
  };

  return (
    <PageContainer title={title} subTitle={description} ghost>
      <ProTable<any>
        actionRef={actionRef}
        rowKey={rowKey}
        columns={hasActions ? [...columns, actionColumn] : columns}
        scroll={scrollX ? { x: scrollX } : undefined}
        search={{ labelWidth: 'auto', defaultCollapsed: true }}
        options={{ density: true, fullScreen: false, reload: true, setting: true }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true, showTotal: (n) => `${n}` }}
        cardBordered
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
              title={t('common.batchDeleteConfirm', { count: selected.length })}
              okText={t('common.confirm')}
              cancelText={t('common.cancel')}
              disabled={!selected.length}
              onConfirm={async () => {
                await batchRemove(module, selected as any[], batchIdKey);
                message.success(t('common.deleted'));
                setSelected([]);
                actionRef.current?.reload();
              }}
            >
              <Button danger disabled={!selected.length}>
                {t('common.batchDelete')}
              </Button>
            </Popconfirm>
          ) : null,
          canCreate ? (
            <Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              {t('common.create')}
            </Button>
          ) : null,
        ]}
      />

      <ModalForm
        title={editing ? `${t('common.edit')} · ${title}` : `${t('common.create')} · ${title}`}
        open={open}
        formRef={formRef}
        modalProps={{ destroyOnHidden: true, onCancel: () => setOpen(false) }}
        initialValues={editing ? (toFormValues ? toFormValues(editing) : editing) : createDefaults}
        onFinish={async (values) => {
          if (editing) {
            await update(module, { ...editing, ...values });
          } else {
            await create(module, values);
          }
          message.success(t('common.saved'));
          setOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProForm.Group>{formItems}</ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
}
