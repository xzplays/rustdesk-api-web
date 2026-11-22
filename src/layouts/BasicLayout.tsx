import React, { useEffect, useMemo, useState } from 'react';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import {
  ApiOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BookOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  GroupOutlined,
  KeyOutlined,
  LaptopOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Modal, Form, Input, message, Spin } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { changePassword } from '../api';
import logo from '../assets/logo.svg';

const menus = [
  { path: '/dashboard', name: '仪表盘', icon: <DashboardOutlined /> },
  { path: '/users', name: '用户管理', icon: <UserOutlined /> },
  { path: '/peers', name: '设备管理', icon: <LaptopOutlined /> },
  { path: '/groups', name: '用户组', icon: <TeamOutlined /> },
  { path: '/device-groups', name: '设备分组', icon: <AppstoreOutlined /> },
  { path: '/tags', name: '标签', icon: <TagsOutlined /> },
  { path: '/address-books', name: '地址簿', icon: <BookOutlined /> },
  { path: '/collections', name: '地址簿收藏', icon: <ShareAltOutlined /> },
  { path: '/collection-rules', name: '收藏规则', icon: <AuditOutlined /> },
  { path: '/audit-login', name: '登录审计', icon: <LoginOutlined /> },
  { path: '/audit-conn', name: '连接审计', icon: <ApiOutlined /> },
  { path: '/audit-file', name: '文件传输审计', icon: <DeploymentUnitOutlined /> },
  { path: '/login-logs', name: '登录日志', icon: <AuditOutlined /> },
  { path: '/user-tokens', name: '访问令牌', icon: <KeyOutlined /> },
  { path: '/oauth', name: 'OAuth 提供商', icon: <GroupOutlined /> },
  { path: '/share-records', name: '分享记录', icon: <ShareAltOutlined /> },
  { path: '/settings', name: '系统设置', icon: <SettingOutlined /> },
];

export default function BasicLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pwdOpen, setPwdOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  const menuData = useMemo(
    () => menus.map((m) => ({ path: m.path, name: m.name, icon: m.icon })),
    [],
  );

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <ProLayout
      title="RustDesk"
      logo={logo}
      layout="mix"
      fixSiderbar
      fixedHeader
      siderWidth={216}
      location={{ pathname: location.pathname }}
      route={{ path: '/', routes: menuData }}
      menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
      avatarProps={{
        src: user?.avatar || undefined,
        icon: <UserOutlined />,
        title: user?.nickname || user?.username || 'admin',
        render: (_props, dom) => (
          <Dropdown
            menu={{
              items: [
                { key: 'pwd', icon: <KeyOutlined />, label: '修改密码' },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
              ],
              onClick: async ({ key }) => {
                if (key === 'pwd') setPwdOpen(true);
                if (key === 'logout') {
                  await signOut();
                  navigate('/login', { replace: true });
                }
              },
            }}
          >
            <span>{dom}</span>
          </Dropdown>
        ),
      }}
      footerRender={() => (
        <div style={{ textAlign: 'center', color: '#999', padding: '12px 0', fontSize: 12 }}>
          RustDesk 私有化服务端 · 管理后台
        </div>
      )}
    >
      <PageContainer title={false}>
        <Outlet />
      </PageContainer>

      <Modal
        title="修改密码"
        open={pwdOpen}
        onCancel={() => setPwdOpen(false)}
        onOk={async () => {
          try {
            const v = await form.validateFields();
            await changePassword(v);
            message.success('密码已修改');
            setPwdOpen(false);
            form.resetFields();
          } catch {
            /* validation error already shown */
          }
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="old_password" label="当前密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="new_password" label="新密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="确认新密码"
            dependencies={['new_password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </ProLayout>
  );
}
