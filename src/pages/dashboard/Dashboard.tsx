import React, { useEffect, useMemo, useState } from 'react';
import { ProCard, StatisticCard, ProTable } from '@ant-design/pro-components';
import { Pie } from '@ant-design/charts';
import { Space, Tag } from 'antd';
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
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <StatisticCard.Group>
        <StatisticCard statistic={{ title: '用户总数', value: counts.users }} />
        <StatisticCard statistic={{ title: '设备总数', value: counts.peers }} />
        <StatisticCard statistic={{ title: '地址簿条目', value: counts.ab }} />
        <StatisticCard statistic={{ title: '有效令牌', value: counts.tokens }} />
      </StatisticCard.Group>

      <ProCard split="vertical" gutter={16} wrap>
        <ProCard title="登录审计结果分布" colSpan={{ xs: 24, md: 10 }} style={{ minHeight: 320 }}>
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
            <div style={{ color: '#999', paddingTop: 100, textAlign: 'center' }}>暂无审计数据</div>
          )}
        </ProCard>
        <ProCard title="最近登录审计" colSpan={{ xs: 24, md: 14 }}>
          <ProTable
            rowKey="id"
            search={false}
            options={false}
            pagination={false}
            size="small"
            dataSource={recent.slice(0, 8)}
            columns={[
              { title: '设备 ID', dataIndex: 'guid' },
              { title: 'IP', dataIndex: 'ip' },
              {
                title: '结果',
                dataIndex: 'result',
                render: (_, r) => (
                  <Tag color={r.result === 'ok' ? 'green' : 'red'}>{r.result}</Tag>
                ),
              },
              { title: '时间', dataIndex: 'created_at' },
            ]}
          />
        </ProCard>
      </ProCard>
    </Space>
  );
}
