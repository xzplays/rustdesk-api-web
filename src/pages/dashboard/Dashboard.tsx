import React, { useEffect, useMemo, useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  StatisticCard,
} from '@ant-design/pro-components';
import { Pie } from '@ant-design/charts';
import { Button, Grid, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { list } from '@/api';
import { reasonLabel } from '@/utils/labels';

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
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
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
    recent.forEach((r) => {
      const key = reasonLabel(r.reason || r.result, t);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [recent, t]);

  return (
    <PageContainer
      title={t('nav.dashboard')}
      subTitle={t('dashboard.welcome', { name: user?.nickname || user?.username || 'admin' })}
      ghost
      extra={[
        <Button
          key="dl"
          icon={<DownloadOutlined />}
          href="/dl/"
          target="_blank"
          rel="noreferrer"
        >
          {t('portal.clientDownload')}
        </Button>,
      ]}
    >
      <div className="rd-stat-grid">
        <StatisticCard statistic={{ title: t('dashboard.users'), value: counts.users }} />
        <StatisticCard statistic={{ title: t('dashboard.peers'), value: counts.peers }} />
        <StatisticCard statistic={{ title: t('dashboard.addressBooks'), value: counts.ab }} />
        <StatisticCard statistic={{ title: t('dashboard.tokens'), value: counts.tokens }} />
      </div>

      <ProCard split="vertical" gutter={16} wrap style={{ marginTop: 16 }}>
        <ProCard title={t('dashboard.auditChart')} colSpan={{ xs: 24, md: 10 }} style={{ minHeight: isMobile ? 300 : 340 }}>
          {pieData.length ? (
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.72}
              innerRadius={0.52}
              legend={{ position: 'bottom', rowPadding: 4 }}
              height={isMobile ? 220 : 260}
              label={
                isMobile
                  ? false
                  : {
                      text: (d: any) => `${d.type} ${d.value}`,
                      position: 'outside',
                      style: { fontSize: 12 },
                    }
              }
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
            scroll={{ x: 520 }}
            dataSource={recent.slice(0, isMobile ? 5 : 8)}
            columns={[
              { title: t('fields.peerId'), dataIndex: 'guid', ellipsis: true, width: 140 },
              { title: t('fields.ip'), dataIndex: 'ip', width: 130, responsive: isMobile ? ['md'] : undefined },
              {
                title: t('fields.result'),
                dataIndex: 'result',
                width: 90,
                render: (_, r) => (
                  <Tag color={r.result === 'ok' ? 'green' : 'red'}>
                    {r.result === 'ok' ? t('audit.resultOk') : t('audit.resultFail')}
                  </Tag>
                ),
              },
              {
                title: t('fields.reason'),
                dataIndex: 'reason',
                width: 110,
                render: (_, r) => reasonLabel(r.reason, t),
              },
              { title: t('fields.createdAt'), dataIndex: 'created_at', width: 160 },
            ]}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}


