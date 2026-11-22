import React, { useRef, useState } from 'react';
import {
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
  ModalForm,
} from '@ant-design/pro-components';
import { App, Button, Empty, Grid, Popconfirm, Tag } from 'antd';
import { DownloadOutlined, EditOutlined, DisconnectOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { myPeerUnbind, myPeerUpdate, myPeers, MyPeer } from '../../api';


export default function MyDevicesPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<MyPeer | null>(null);

  const columns: ProColumns<MyPeer>[] = [
    { title: t('fields.peerId'), dataIndex: 'id', copyable: true, width: 140, search: false },
    { title: t('fields.alias'), dataIndex: 'alias', width: 110, search: false },
    {
      title: t('fields.hostname'),
      dataIndex: 'hostname',
      width: 130,
      search: false,
      responsive: ['md'],
    },
    {
      title: t('fields.os'),
      dataIndex: 'os',
      width: 130,
      ellipsis: true,
      search: false,
      responsive: ['md'],
    },
    {
      title: t('fields.version'),
      dataIndex: 'version',
      width: 60,
      search: false,
      responsive: ['lg'],
    },
    {
      title: t('fields.lastOnlineIp'),
      dataIndex: 'last_online_ip',
      width: 110,
      search: false,
      responsive: ['lg'],
    },
    {
      title: t('fields.lastOnlineTime'),
      dataIndex: 'last_online_time',
      width: 170,
      search: false,
      responsive: ['md'],
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
    <PageContainer
      title={t('portal.myDevices')}
      subTitle={t('portal.myDevicesHint')}
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
      <ProTable<MyPeer>
        actionRef={actionRef}
        rowKey="row_id"
        cardBordered
        columns={columns}
        search={false}
        size={isMobile ? 'small' : undefined}
        scroll={{ x: isMobile ? 520 : 1010 }}
        options={{ reload: true, density: !isMobile, setting: !isMobile }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
        request={async (params) => {
          const res = await myPeers(params.current || 1, params.pageSize || 20);
          return { data: res.list, success: true, total: res.total };
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="rd-muted">{t('portal.noDevices')}</span>}
              styles={{ image: { height: 48 } }}
            >
              <Button
                type="primary"
                ghost
                icon={<DownloadOutlined />}
                href="/dl/"
                target="_blank"
                rel="noreferrer"
              >
                {t('portal.clientDownload')}
              </Button>
            </Empty>
          ),
        }}
      />


      <ModalForm
        title={t('portal.rename')}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        width={isMobile ? '94vw' : 520}
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


