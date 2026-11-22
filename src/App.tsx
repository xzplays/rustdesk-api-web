import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import LoginPage from './pages/Login';
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

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
