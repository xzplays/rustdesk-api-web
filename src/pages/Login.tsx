import React, { useEffect, useState } from 'react';
import { GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { loginOptions } from '../api';
import { LANGS, setLang, type LangKey } from '../i18n';
import logo from '../assets/logo.svg';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [canRegister, setCanRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loginOptions()
      .then((o) => setCanRegister(!!o.register))
      .catch(() => setCanRegister(false));
  }, []);

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-top">
          <img src={logo} alt="" width={32} height={32} />
          <span>RustDesk</span>
        </div>
        <div className="auth-brand-body">
          <h1 className="auth-brand-title">{t('login.brandTitle')}</h1>
          <p className="auth-brand-desc">{t('login.brandDesc')}</p>
          <ul className="auth-points">
            <li>{t('login.brandPoint1')}</li>
            <li>{t('login.brandPoint2')}</li>
            <li>{t('login.brandPoint3')}</li>
          </ul>
        </div>
        <div className="auth-brand-foot">{t('app.footer')}</div>
      </aside>

      <main className="auth-panel">
        <div className="auth-lang">
          <Select
            size="small"
            variant="borderless"
            value={i18n.language as LangKey}
            options={LANGS.map((l) => ({ value: l.key, label: l.label }))}
            onChange={(v) => setLang(v)}
            prefix={<GlobalOutlined />}
            popupMatchSelectWidth={false}
          />
        </div>

        <div className="auth-card">
          <header className="auth-head">
            <h2 className="auth-title">{t('login.title')}</h2>
            <p className="auth-desc">{t('login.subtitle')}</p>
          </header>

          <Form
            layout="vertical"
            requiredMark={false}
            size="large"
            onFinish={async (values) => {
              setSubmitting(true);
              try {
                const res = await signIn(values.username as string, values.password as string);
                message.success(t('login.success'));
                navigate(res.is_admin ? '/dashboard' : '/my/devices', { replace: true });
              } catch {
                message.error(t('login.failed'));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: t('login.usernameRequired') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('login.usernamePlaceholder')}
                autoComplete="username"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('login.passwordPlaceholder')}
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item className="auth-submit">
              <Button type="primary" htmlType="submit" block loading={submitting}>
                {t('login.submit')}
              </Button>
            </Form.Item>
          </Form>

          {canRegister ? (
            <p className="auth-switch">
              {t('login.noAccount')} <Link to="/register">{t('login.toRegister')}</Link>
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
