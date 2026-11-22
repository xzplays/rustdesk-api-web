import React from 'react';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { App, Avatar, Card, Descriptions, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { changePassword } from '../../api';

const { Text } = Typography;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { user } = useAuth();

  return (
    <PageContainer title={t('portal.profile')} subTitle={t('portal.profileHint')} ghost>
      <Card bordered style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar size={64} src={user?.avatar || undefined} icon={<UserOutlined />} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user?.nickname || user?.username}</div>
            <div className="rd-muted">{user?.email || '—'}</div>
          </div>
          <Tag color={user?.is_admin ? 'blue' : 'default'}>
            {user?.is_admin ? t('fields.isAdmin') : t('fields.username')}
          </Tag>
        </div>
        <Descriptions column={2} style={{ marginTop: 24 }} size="small">
          <Descriptions.Item label={t('fields.username')}>{user?.username || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('fields.nickname')}>{user?.nickname || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('fields.email')}>{user?.email || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('fields.groupId')}>{user?.group_id ?? '-'}</Descriptions.Item>
          <Descriptions.Item label={t('fields.createdAt')}>{user?.created_at || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('fields.remark')}>{user?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('common.changePassword')} bordered style={{ maxWidth: 520 }}>
        <ProForm
          layout="vertical"
          submitter={{ searchConfig: { submitText: t('common.save') } }}
          onFinish={async (values) => {
            await changePassword({
              old_password: values.old_password as string,
              new_password: values.new_password as string,
              confirm_password: values.confirm_password as string,
            });
            message.success(t('portal.passwordChanged'));
            return true;
          }}
        >
          <ProFormText.Password
            name="old_password"
            label={t('portal.oldPassword')}
            rules={[{ required: true }]}
            fieldProps={{ autoComplete: 'current-password' }}
          />
          <ProFormText.Password
            name="new_password"
            label={t('portal.newPassword')}
            rules={[{ required: true, min: 6 }]}
            fieldProps={{ autoComplete: 'new-password' }}
          />
          <ProFormText.Password
            name="confirm_password"
            label={t('portal.confirmPassword')}
            dependencies={['new_password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                  return Promise.reject(new Error(t('register.passwordMismatch')));
                },
              }),
            ]}
            fieldProps={{ autoComplete: 'new-password' }}
          />
        </ProForm>
        <Text type="secondary" className="rd-muted">
          {t('portal.configTitle')}
        </Text>
      </Card>
    </PageContainer>
  );
}
