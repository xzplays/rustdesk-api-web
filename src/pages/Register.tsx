import React, { useEffect, useState } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { GlobalOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, App, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { loginOptions } from '../api';
import { LANGS, setLang, type LangKey } from '../i18n';
import logo from '../assets/logo.svg';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    loginOptions()
      .then((o) => setOpen(!!o.register))
      .catch(() => setOpen(false));
  }, []);

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <img src={logo} alt="RustDesk" width={56} height={56} />
          <h2 style={{ color: '#fff', marginTop: 20, fontSize: 28 }}>{t('register.title')}</h2>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 15 }}>{t('register.subtitle')}</p>
          <ul className="auth-points">
            <li>{t('login.brandPoint1')}</li>
            <li>{t('login.brandPoint2')}</li>
          </ul>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-lang">
          <Select
            size="small"
            variant="borderless"
            value={i18n.language as LangKey}
            options={LANGS.map((l) => ({ value: l.key, label: l.label }))}
            onChange={(v) => setLang(v)}
            prefix={<GlobalOutlined />}
            style={{ width: 108 }}
          />
        </div>
        <LoginForm
          logo={logo}
          title={t('register.title')}
          subTitle={t('register.subtitle')}
          submitter={{ searchConfig: { submitText: t('register.submit') } }}
          onFinish={async (values) => {
            if (open === false) {
              message.error(t('register.closed'));
              return false;
            }
            try {
              await signUp({
                username: values.username as string,
                email: (values.email as string) || '',
                nickname: (values.nickname as string) || '',
                password: values.password as string,
                confirm_password: values.confirm_password as string,
              });
              message.success(t('register.success'));
              navigate('/my/devices', { replace: true });
              return true;
            } catch {
              return false;
            }
          }}
        >
          {open === false ? (
            <Alert type="warning" showIcon title={t('register.closed')} style={{ marginBottom: 16 }} />
          ) : null}
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined />, autoComplete: 'username' }}
            placeholder={t('register.username')}
            rules={[
              { required: true, message: t('login.usernameRequired') },
              { min: 2, max: 32, message: t('register.usernameRule') },
            ]}
          />
          <ProFormText
            name="nickname"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder={t('register.nickname')}
          />
          <ProFormText
            name="email"
            fieldProps={{ size: 'large', prefix: <MailOutlined />, autoComplete: 'email' }}
            placeholder={t('register.email')}
            rules={[{ type: 'email', message: t('register.email') }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined />, autoComplete: 'new-password' }}
            placeholder={t('register.password')}
            rules={[
              { required: true, message: t('login.passwordRequired') },
              { min: 4, message: t('register.passwordRule') },
            ]}
          />
          <ProFormText.Password
            name="confirm_password"
            fieldProps={{ size: 'large', prefix: <LockOutlined />, autoComplete: 'new-password' }}
            placeholder={t('register.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('login.passwordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error(t('register.passwordMismatch')));
                },
              }),
            ]}
          />
          <div style={{ marginTop: 4 }}>
            <Link to="/login">{t('register.back')}</Link>
          </div>
        </LoginForm>
      </div>
    </div>
  );
}
