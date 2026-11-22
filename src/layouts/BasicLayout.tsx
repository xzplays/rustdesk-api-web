import React, { useEffect, useMemo, useState } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import {
  ApiOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BookOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  GlobalOutlined,
  GroupOutlined,
  IdcardOutlined,
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
import { App, Avatar, Dropdown, Form, Input, Modal, Select, Spin } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { changePassword } from '../api';
import { LANGS, setLang, type LangKey } from '../i18n';
import logo from '../assets/logo.svg';

export default function BasicLayout() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pwdOpen, setPwdOpen] = useState(false);
  const [form] = Form.useForm();

  const isAdmin = !!user?.is_admin;

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
    if (!loading && user && !isAdmin && !location.pathname.startsWith('/my/')) {
      navigate('/my/devices', { replace: true });
    }
  }, [loading, user, isAdmin, location.pathname, navigate]);

  const adminMenu = useMemo(
    () => [
      { path: '/dashboard', name: t('nav.dashboard'), icon: <DashboardOutlined /> },
      { path: '/users', name: t('nav.users'), icon: <UserOutlined /> },
      { path: '/peers', name: t('nav.peers'), icon: <LaptopOutlined /> },
      { path: '/groups', name: t('nav.groups'), icon: <TeamOutlined /> },
      { path: '/device-groups', name: t('nav.deviceGroups'), icon: <AppstoreOutlined /> },
      { path: '/tags', name: t('nav.tags'), icon: <TagsOutlined /> },
      { path: '/address-books', name: t('nav.addressBooks'), icon: <BookOutlined /> },
      { path: '/collections', name: t('nav.collections'), icon: <ShareAltOutlined /> },
      { path: '/collection-rules', name: t('nav.collectionRules'), icon: <AuditOutlined /> },
      { path: '/audit-login', name: t('nav.auditLogin'), icon: <LoginOutlined /> },
      { path: '/audit-conn', name: t('nav.auditConn'), icon: <ApiOutlined /> },
      { path: '/audit-file', name: t('nav.auditFile'), icon: <DeploymentUnitOutlined /> },
      { path: '/login-logs', name: t('nav.loginLogs'), icon: <AuditOutlined /> },
      { path: '/user-tokens', name: t('nav.userTokens'), icon: <KeyOutlined /> },
      { path: '/oauth', name: t('nav.oauth'), icon: <GroupOutlined /> },
      { path: '/share-records', name: t('nav.shareRecords'), icon: <ShareAltOutlined /> },
      { path: '/settings', name: t('nav.settings'), icon: <SettingOutlined /> },
    ],
    [t],
  );

  const portalMenu = useMemo(
    () => [
      { path: '/my/devices', name: t('nav.myDevices'), icon: <LaptopOutlined /> },
      { path: '/my/address-book', name: t('nav.myAddressBook'), icon: <BookOutlined /> },
      { path: '/my/profile', name: t('nav.profile'), icon: <IdcardOutlined /> },
    ],
    [t],
  );

  const menuData = isAdmin ? adminMenu : portalMenu;

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const topbar = (
    <div className="rd-header">
      <div className="rd-header-actions">
        <Select
          size="small"
          variant="borderless"
          value={i18n.language as LangKey}
          options={LANGS.map((l) => ({ value: l.key, label: l.label }))}
          onChange={(v) => setLang(v)}
          style={{ width: 118 }}
          prefix={<GlobalOutlined />}
        />
        <Dropdown
          menu={{
            items: [
              { key: 'profile', icon: <IdcardOutlined />, label: t('nav.profile') },
              { key: 'pwd', icon: <KeyOutlined />, label: t('common.changePassword') },
              { type: 'divider' },
              { key: 'logout', icon: <LogoutOutlined />, label: t('common.logout'), danger: true },
            ],
            onClick: async ({ key }) => {
              if (key === 'profile') navigate('/my/profile');
              if (key === 'pwd') setPwdOpen(true);
              if (key === 'logout') {
                await signOut();
                navigate('/login', { replace: true });
              }
            },
          }}
        >
          <span className="rd-user">
            <Avatar size={28} src={user?.avatar || undefined} icon={<UserOutlined />} />
            <span className="rd-user-name">{user?.nickname || user?.username}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <ProLayout
      title="RustDesk"
      logo={logo}
      layout="side"
      fixSiderbar
      siderWidth={228}
      location={{ pathname: location.pathname }}
      route={{ path: '/', routes: menuData }}
      menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
      footerRender={() => (
        <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '16px 0', fontSize: 12 }}>
          {t('app.footer')}
        </div>
      )}
    >
      {topbar}
      <Outlet />

      <Modal
        title={t('common.changePassword')}
        open={pwdOpen}
        onCancel={() => setPwdOpen(false)}
        onOk={async () => {
          try {
            const v = await form.validateFields();
            await changePassword(v);
            message.success(t('portal.passwordChanged'));
            setPwdOpen(false);
            form.resetFields();
          } catch {
            /* validation errors are rendered by the form */
          }
        }}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="old_password" label={t('portal.oldPassword')} rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label={t('portal.newPassword')}
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label={t('portal.confirmPassword')}
            dependencies={['new_password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                  return Promise.reject(new Error(t('register.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </ProLayout>
  );
}

