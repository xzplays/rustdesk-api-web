import React, { useRef, useState } from 'react';
import { ProColumns, ProFormText, ProFormSelect, ProFormSwitch, ProFormDigit } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import CrudPage from '@/components/CrudPage';
import { raw } from '@/api';
import { list } from '@/api';

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

export default function UsersPage() {
  const [pwdUser, setPwdUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname', search: false },
    { title: '邮箱', dataIndex: 'email', search: false, copyable: true },
    {
      title: '管理员',
      dataIndex: 'is_admin',
      search: false,
      width: 90,
      render: (_, r) => (r.is_admin ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: { 1: { text: '启用', status: 'Success' }, 0: { text: '禁用', status: 'Error' } },
    },
    { title: '创建时间', dataIndex: 'created_at', search: false, width: 170 },
  ];

  return (
    <>
      <CrudPage
        module="user"
        title="用户"
        columns={columns}
        rowActions={(record) => (
          <a key="pwd" onClick={() => setPwdUser(record)}>
            <KeyOutlined /> 密码
          </a>
        )}
        formItems={
          <>
            <ProFormText name="username" label="用户名" rules={[{ required: true }]} />
            <ProFormText name="nickname" label="昵称" />
            <ProFormText name="email" label="邮箱" />
            <ProFormSelect
              name="group_id"
              label="用户组"
              request={async () => {
                const res = await list('group', { page: 1, page_size: 100 });
                return (res.list || []).map((g: any) => ({ label: g.name, value: g.id }));
              }}
              rules={[{ required: true, message: '请选择用户组' }]}
            />
            <ProFormSwitch name="is_admin" label="管理员" />
            <ProFormSelect name="status" label="状态" options={statusOptions} initialValue={1} />
            <ProFormText name="remark" label="备注" />
          </>
        }
        createDefaults={{ status: 1, is_admin: false, group_id: 1 }}
      />

      <Modal
        title={`重置密码 - ${pwdUser?.username || ''}`}
        open={!!pwdUser}
        onCancel={() => setPwdUser(null)}
        onOk={async () => {
          const v = await form.validateFields();
          await raw('/api/admin/user/changePwd', 'POST', { id: pwdUser.id, password: v.password });
          message.success('密码已重置');
          form.resetFields();
          setPwdUser(null);
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="password" label="新密码" rules={[{ required: true, min: 4 }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
