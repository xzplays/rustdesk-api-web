import React, { useRef, useState } from 'react';
import {
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
  ModalForm,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space, Tag, Typography } from 'antd';
import { DownloadOutlined, EditOutlined, DisconnectOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { myPeerUnbind, myPeerUpdate, myPeers, MyPeer } from '../../api';

const { Text } = Typography;

export default function MyDevicesPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<MyPeer | null>(null);

  const columns: ProColumns<MyPeer>[] = [
    { title: t('fields.peerId'), dataIndex: 'id', copyable: true, width: 140, search: false },
    { title: t('fields.alias'), dataIndex: 'alias', width: 110, search: false },
    { title: t('fields.hostname'), dataIndex: 'hostname', width: 130, search: false },
    { title: t('fields.os'), dataIndex: 'os', width: 130, ellipsis: true, search: false },
    { title: t('fields.version'), dataIndex: 'version', width: 60, search: false },
    { title: t('fields.lastOnlineIp'), dataIndex: 'last_online_ip', width: 110, search: false },
    {
      title: t('fields.lastOnlineTime'),
      dataIndex: 'last_online_time',
      width: 170,
      search: false,
      render: (_, r) =>
        r.last_online_time
          ? new Date(r.last_online_time * 1000).toLocaleString(undefined, { hour12: false })
          : '-',
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <a key="rename" onClick={() => setEditing(record)}>
          <EditOutlined /> {t('portal.rename')}
        </a>,
        <Popconfirm
          key="unbind"
          title={t('portal.unbindConfirm')}
          okText={t('common.confirm')}
          cancelText={t('common.cancel')}
          onConfirm={async () => {
            await myPeerUnbind(record.row_id);
            message.success(t('portal.unbindDone'));
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DisconnectOutlined /> {t('portal.unbind')}
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title={t('portal.myDevices')} subTitle={t('portal.myDevicesHint')} ghost>
      <ProTable<MyPeer>
        actionRef={actionRef}
        rowKey="row_id"
        cardBordered
        columns={columns}
        search={false}
        scroll={{ x: 1010 }}
        options={{ reload: true, density: true, setting: true }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
        request={async (params) => {
          const res = await myPeers(params.current || 1, params.pageSize || 20);
          return { data: res.list, success: true, total: res.total };
        }}
        locale={{ emptyText: t('portal.noDevices') }}
        toolBarRender={() => [
          <Space key="dl" size="middle">
            <Button
              icon={<DownloadOutlined />}
              href="/dl/"
              target="_blank"
              rel="noreferrer"
            >
              {t('portal.clientDownload')}
            </Button>
          </Space>,
        ]}
      />

      <div className="rd-muted" style={{ marginTop: 12 }}>
        <Text type="secondary">{t('portal.configTitle')}：custom-rendezvous-server = rustdesk.xzplay.com:31116</Text>
      </div>

      <ModalForm
        title={t('portal.rename')}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        modalProps={{ destroyOnHidden: true }}
        initialValues={{ alias: editing?.alias }}
        onFinish={async (values) => {
          if (!editing) return false;
          await myPeerUpdate(editing.row_id, (values.alias as string) || '');
          message.success(t('portal.aliasSaved'));
          setEditing(null);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="alias" label={t('fields.alias')} />
      </ModalForm>
    </PageContainer>
  );
}


