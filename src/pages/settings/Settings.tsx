import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { appConfig, serverConfig } from '@/api';

export default function SettingsPage() {
  const { t } = useTranslation();
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

  return (
    <PageContainer title={t('pages.settings')} ghost>
      {loading ? (
        <Spin />
      ) : (
        <ProCard split="vertical" gutter={16} wrap>
          <ProCard title={t('settings.server')} colSpan={{ xs: 24, md: 12 }}>
            <ProDescriptions
              column={1}
              dataSource={server}
              columns={Object.keys(server || {}).map((k) => ({
                title: k,
                dataIndex: k,
                copyable: true,
              }))}
            />
          </ProCard>
          <ProCard title={t('settings.app')} colSpan={{ xs: 24, md: 12 }}>
            <ProDescriptions
              column={1}
              dataSource={app}
              columns={Object.keys(app || {}).map((k) => ({ title: k, dataIndex: k }))}
            />
          </ProCard>
        </ProCard>
      )}
    </PageContainer>
  );
}
