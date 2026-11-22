import React, { useEffect, useMemo } from 'react';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/dashboard/Dashboard';
import UsersPage from './pages/users/Users';
import PeersPage from './pages/peers/Peers';
import GroupsPage from './pages/groups/Groups';
import DeviceGroupsPage from './pages/groups/DeviceGroups';
import TagsPage from './pages/tags/Tags';
import AddressBooksPage from './pages/addressBooks/AddressBooks';
import CollectionsPage, { CollectionRulesPage } from './pages/addressBooks/Collections';
import { AuditConnPage, AuditFilePage, AuditLoginPage } from './pages/audit/Audit';
import { LoginLogsPage, OauthPage, ShareRecordsPage, UserTokensPage } from './pages/misc/Misc';
import SettingsPage from './pages/settings/Settings';
import MyDevicesPage from './pages/portal/MyDevices';
import MyAddressBookPage from './pages/portal/MyAddressBook';
import ProfilePage from './pages/portal/Profile';
import { useAuth } from './auth';
import { useLang } from './i18n';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user?.is_admin ? '/dashboard' : '/my/devices'} replace />;
}

export default function App() {
  const lang = useLang();

  useEffect(() => {
    dayjs.locale(lang === 'en-US' ? 'en' : 'zh-cn');
  }, [lang]);

  const config = useMemo(
    () => ({
      locale: lang === 'en-US' ? enUS : zhCN,
      button: { autoInsertSpace: false },
      theme: {
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2f6bff',
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Layout: { headerBg: '#ffffff', siderBg: '#ffffff' },
          Menu: { itemBorderRadius: 8, itemMarginInline: 8 },
        },
      },
    }),
    [lang],
  );

  return (
    <ConfigProvider {...config}>
      <AntdApp>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<BasicLayout />}>
              <Route index element={<HomeRedirect />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="peers" element={<PeersPage />} />
              <Route path="groups" element={<GroupsPage />} />
              <Route path="device-groups" element={<DeviceGroupsPage />} />
              <Route path="tags" element={<TagsPage />} />
              <Route path="address-books" element={<AddressBooksPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collection-rules" element={<CollectionRulesPage />} />
              <Route path="audit-login" element={<AuditLoginPage />} />
              <Route path="audit-conn" element={<AuditConnPage />} />
              <Route path="audit-file" element={<AuditFilePage />} />
              <Route path="login-logs" element={<LoginLogsPage />} />
              <Route path="user-tokens" element={<UserTokensPage />} />
              <Route path="oauth" element={<OauthPage />} />
              <Route path="share-records" element={<ShareRecordsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="my/devices" element={<MyDevicesPage />} />
              <Route path="my/address-book" element={<MyAddressBookPage />} />
              <Route path="my/profile" element={<ProfilePage />} />
              <Route path="*" element={<HomeRedirect />} />
            </Route>
          </Routes>
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

