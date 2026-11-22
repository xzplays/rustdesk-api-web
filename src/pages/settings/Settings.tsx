import React, { useEffect, useState } from 'react';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Spin } from 'antd';
import { appConfig, serverConfig } from '@/api';

export default function SettingsPage() {
  const [server, setServer] = useState<any>(null);
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([serverConfig().catch(() => ({})), appConfig().catch(() => ({}))])
      .then(([s, a]) => {
        setServer(s || {});
        setApp(a || {});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;

  return (
    <ProCard split="vertical" gutter={16} wrap>
      <ProCard title="服务端配置" colSpan={{ xs: 24, md: 12 }}>
        <ProDescriptions column={1} dataSource={server} columns={Object.keys(server || {}).map((k) => ({ title: k, dataIndex: k }))} />
      </ProCard>
      <ProCard title="应用配置" colSpan={{ xs: 24, md: 12 }}>
        <ProDescriptions column={1} dataSource={app} columns={Object.keys(app || {}).map((k) => ({ title: k, dataIndex: k }))} />
      </ProCard>
    </ProCard>
  );
}
