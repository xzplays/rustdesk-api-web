import React, { useState } from 'react';
import {
  ProColumns,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Button, Form, Input, Modal, Tooltip } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CrudPage from '@/components/CrudPage';
import { list, raw } from '@/api';

export default function UsersPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [pwdUser, setPwdUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const columns: ProColumns<any>[] = [
    { title: t('fields.id'), dataIndex: 'id', width: 70, search: false },
    { title: t('fields.username'), dataIndex: 'username', width: 160 },
    { title: t('fields.nickname'), dataIndex: 'nickname', search: false, width: 140 },
    { title: t('fields.email'), dataIndex: 'email', search: false, copyable: true, width: 220, ellipsis: true },
    {
      title: t('fields.isAdmin'),
      dataIndex: 'is_admin',
      search: false,
      width: 96,
      render: (_, r) => (r.is_admin ? t('common.yes') : t('common.no')),
    },
    {
      title: t('fields.status'),
      dataIndex: 'status',
      width: 96,
      valueType: 'select',
      valueEnum: {
        1: { text: t('common.enabled'), status: 'Success' },
        0: { text: t('common.disabled'), status: 'Error' },
      },
    },
    { title: t('fields.createdAt'), dataIndex: 'created_at', search: false, width: 170 },
    { title: t('fields.remark'), dataIndex: 'remark', search: false, width: 110, ellipsis: true },
  ];

  return (
    <>
      <CrudPage
        module="user"
        title={t('pages.users')}
        columns={columns}
        rowActions={(record) => (
          <Tooltip title={t('common.changePassword')}>
            <Button
              type="text"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => setPwdUser(record)}
            />
          </Tooltip>
        )}
        formItems={
          <>
            <ProFormText name="username" label={t('fields.username')} rules={[{ required: true }]} />
            <ProFormText name="nickname" label={t('fields.nickname')} />
            <ProFormText name="email" label={t('fields.email')} />
            <ProFormSelect
              name="group_id"
              label={t('nav.groups')}
              request={async () => {
                const res = await list('group', { page: 1, page_size: 100 });
                return (res.list || []).map((g: any) => ({ label: g.name, value: g.id }));
              }}
              rules={[{ required: true }]}
            />
            <ProFormSwitch name="is_admin" label={t('fields.isAdmin')} />
            <ProFormSelect
              name="status"
              label={t('fields.status')}
              options={[
                { label: t('common.enabled'), value: 1 },
                { label: t('common.disabled'), value: 0 },
              ]}
              initialValue={1}
            />
            <ProFormText name="remark" label={t('fields.remark')} />
          </>
        }
        createDefaults={{ status: 1, is_admin: false, group_id: 1 }}
      />

      <Modal
        title={`${t('common.changePassword')} · ${pwdUser?.username || ''}`}
        open={!!pwdUser}
        onCancel={() => setPwdUser(null)}
        onOk={async () => {
          const v = await form.validateFields();
          await raw('/api/admin/user/changePwd', 'POST', { id: pwdUser.id, password: v.password });
          message.success(t('common.saved'));
          form.resetFields();
          setPwdUser(null);
        }}
        destroyOnHidden
        footer={[
          <Button key="c" onClick={() => setPwdUser(null)}>
            {t('common.cancel')}
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={async () => {
              const v = await form.validateFields();
              await raw('/api/admin/user/changePwd', 'POST', { id: pwdUser.id, password: v.password });
              message.success(t('common.saved'));
              form.resetFields();
              setPwdUser(null);
            }}
          >
            {t('common.save')}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="password"
            label={t('portal.newPassword')}
            rules={[{ required: true, min: 4 }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}



