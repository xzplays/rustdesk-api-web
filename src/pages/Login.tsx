import React, { useEffect, useState } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Select, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { loginOptions } from '../api';
import { LANGS, setLang, type LangKey } from '../i18n';
import logo from '../assets/logo.svg';

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    loginOptions()
      .then((o) => setCanRegister(!!o.register))
      .catch(() => setCanRegister(false));
  }, []);

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <img src={logo} alt="RustDesk" width={56} height={56} />
          <Title level={2} style={{ color: '#fff', marginTop: 20 }}>
            {t('login.brandTitle')}
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,.78)', fontSize: 15 }}>
            {t('app.subtitle')}
          </Paragraph>
          <ul className="auth-points">
            <li>{t('login.brandPoint1')}</li>
            <li>{t('login.brandPoint2')}</li>
            <li>{t('login.brandPoint3')}</li>
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
          title="RustDesk"
          subTitle={t('login.subtitle')}
          onFinish={async (values) => {
            try {
              const res = await signIn(values.username as string, values.password as string);
              message.success(t('login.success'));
              navigate(res.is_admin ? '/dashboard' : '/my/devices', { replace: true });
              return true;
            } catch {
              message.error(t('login.failed'));
              return false;
            }
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined />, autoComplete: 'username' }}
            placeholder={t('login.username')}
            rules={[{ required: true, message: t('login.usernameRequired') }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined />, autoComplete: 'current-password' }}
            placeholder={t('login.password')}
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          />
          {canRegister ? (
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <Link to="/register">{t('login.toRegister')}</Link>
            </div>
          ) : null}
        </LoginForm>
      </div>
    </div>
  );
}
