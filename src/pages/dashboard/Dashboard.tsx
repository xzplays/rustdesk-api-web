import React, { useEffect, useMemo, useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  StatisticCard,
} from '@ant-design/pro-components';
import { Pie } from '@ant-design/charts';
import { Button, Space, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { list } from '@/api';

async function countOf(module: string) {
  try {
    const res = await list(module, { page: 1, page_size: 1 });
    return res.total;
  } catch {
    return 0;
  }
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [counts, setCounts] = useState({ users: 0, peers: 0, ab: 0, tokens: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [users, peers, ab, tokens] = await Promise.all([
        countOf('user'),
        countOf('peer'),
        countOf('address_book'),
        countOf('user_token'),
      ]);
      setCounts({ users, peers, ab, tokens });
      const res = await list('audit_login', { page: 1, page_size: 200 });
      setRecent(res.list || []);
    })().catch(() => undefined);
  }, []);

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    recent.forEach((r) => map.set(r.result || 'unknown', (map.get(r.result || 'unknown') || 0) + 1));
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [recent]);

  return (
    <PageContainer
      title={t('nav.dashboard')}
      subTitle={t('dashboard.welcome', { name: user?.nickname || user?.username || 'admin' })}
      ghost
      extra={[
        <Button
          key="dl"
          icon={<DownloadOutlined />}
          href="/dl/RustDesk-xzplay-portable.zip"
          target="_blank"
          rel="noreferrer"
        >
          {t('portal.clientDownload')}
        </Button>,
      ]}
    >
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        <StatisticCard.Group>
          <StatisticCard statistic={{ title: t('dashboard.users'), value: counts.users }} />
          <StatisticCard statistic={{ title: t('dashboard.peers'), value: counts.peers }} />
          <StatisticCard statistic={{ title: t('dashboard.addressBooks'), value: counts.ab }} />
          <StatisticCard statistic={{ title: t('dashboard.tokens'), value: counts.tokens }} />
        </StatisticCard.Group>

        <ProCard split="vertical" gutter={16} wrap>
          <ProCard
            title={t('dashboard.auditChart')}
            colSpan={{ xs: 24, md: 10 }}
            style={{ minHeight: 340 }}

          >
            {pieData.length ? (
              <Pie
                data={pieData}
                angleField="value"
                colorField="type"
                radius={0.85}
                innerRadius={0.5}
                legend={{ position: 'bottom' }}
                label={{ text: (d: any) => `${d.type}: ${d.value}` }}
                height={260}
              />
            ) : (
              <div className="rd-muted" style={{ paddingTop: 120, textAlign: 'center' }}>
                {t('common.noData')}
              </div>
            )}
          </ProCard>
          <ProCard title={t('dashboard.recentAudit')} colSpan={{ xs: 24, md: 14 }}>
            <ProTable
              rowKey="id"
              search={false}
              options={false}
              pagination={false}
              size="small"
              dataSource={recent.slice(0, 8)}
              columns={[
                { title: t('fields.peerId'), dataIndex: 'guid' },
                { title: t('fields.ip'), dataIndex: 'ip' },
                {
                  title: t('fields.result'),
                  dataIndex: 'result',
                  render: (_, r) => <Tag color={r.result === 'ok' ? 'green' : 'red'}>{r.result}</Tag>,
                },
                { title: t('fields.createdAt'), dataIndex: 'created_at' },
              ]}
            />
          </ProCard>
        </ProCard>
      </Space>
    </PageContainer>
  );
}
