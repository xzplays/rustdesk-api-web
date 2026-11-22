import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Alert, Button, Space, Spin, Tag, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { appConfig, serverConfig } from '@/api';

const { Paragraph, Text } = Typography;

const SERVER_FIELDS: { key: string; labelKey: string; mono?: boolean }[] = [
  { key: 'id_server', labelKey: 'settings.idServer' },
  { key: 'relay_server', labelKey: 'settings.relayServer' },
  { key: 'api_server', labelKey: 'settings.apiServer' },
  { key: 'key', labelKey: 'settings.key', mono: true },
];

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

  const host = window.location.hostname;
  const publicKey = server?.key || '';
  const clientConfig = [
    `custom-rendezvous-server = '${host}:31116'`,
    `relay-server = '${host}:31117'`,
    `api-server = '${window.location.origin}'`,
    `key = '${publicKey}'`,
  ].join('\n');

  return (
    <PageContainer title={t('pages.settings')} subTitle={t('pages.settingsDesc')} ghost>
      {loading ? (
        <Spin />
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <ProCard title={t('settings.server')}>
            <ProDescriptions
              column={{ xs: 1, md: 2 }}
              dataSource={server || {}}
              columns={SERVER_FIELDS.map((f) => ({
                title: t(f.labelKey),
                dataIndex: f.key,
                copyable: true,
                render: (_, row) =>
                  f.mono ? (
                    <Text code>{row[f.key]}</Text>
                  ) : (
                    <Text>{row[f.key] || '-'}</Text>
                  ),
              }))}
            />
            <Paragraph type="secondary" style={{ margin: '12px 0 0' }}>
              {t('settings.serverHint')}
            </Paragraph>
          </ProCard>

          <ProCard title={t('settings.clientConfig')} extra={<Tag color="blue">TOML</Tag>}>
            <Alert type="info" showIcon message={t('settings.clientHint')} style={{ marginBottom: 16 }} />
            <pre
              style={{
                margin: 0,
                padding: 16,
                background: '#f7f8fa',
                border: '1px solid #eceef2',
                borderRadius: 10,
                fontSize: 13,
                lineHeight: 1.9,
                overflowX: 'auto',
              }}
            >
              {clientConfig}
            </pre>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              href="/dl/"
              target="_blank"
              style={{ marginTop: 16 }}
            >
              {t('settings.downloadClient')}
            </Button>
          </ProCard>

          <ProCard title={t('settings.app')}>
            <ProDescriptions
              column={{ xs: 1, md: 2 }}
              dataSource={app || {}}
              columns={[
                {
                  title: t('settings.webClient'),
                  dataIndex: 'web_client',
                  render: (_, row) =>
                    row.web_client ? (
                      <Tag color="green">{t('common.enabled')}</Tag>
                    ) : (
                      <Tag>{t('common.disabled')}</Tag>
                    ),
                },
              ]}
            />
          </ProCard>
        </Space>
      )}
    </PageContainer>
  );
}
