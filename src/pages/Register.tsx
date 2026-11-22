import React, { useEffect, useState } from 'react';
import { GlobalOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, App, Button, Form, Input, Select } from 'antd';
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loginOptions()
      .then((o) => setOpen(!!o.register))
      .catch(() => setOpen(false));
  }, []);

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-top">
          <img src={logo} alt="" width={32} height={32} />
          <span>RustDesk</span>
        </div>
        <div className="auth-brand-body">
          <h1 className="auth-brand-title">{t('register.brandTitle')}</h1>
          <p className="auth-brand-desc">{t('register.brandDesc')}</p>
          <ul className="auth-points">
            <li>{t('register.brandPoint1')}</li>
            <li>{t('register.brandPoint2')}</li>
            <li>{t('register.brandPoint3')}</li>
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
            <h2 className="auth-title">{t('register.title')}</h2>
            <p className="auth-desc">{t('register.subtitle')}</p>
          </header>

          {open === false ? (
            <Alert type="warning" showIcon title={t('register.closed')} className="auth-alert" />
          ) : null}

          <Form
            layout="vertical"
            requiredMark={false}
            size="large"
            onFinish={async (values) => {
              if (open === false) {
                message.error(t('register.closed'));
                return;
              }
              setSubmitting(true);
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
              } catch {
                /* the request layer already reported the failure */
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: t('login.usernameRequired') },
                { min: 2, max: 32, message: t('register.usernameRule') },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('register.usernamePlaceholder')}
                autoComplete="username"
                allowClear
              />
            </Form.Item>
            <Form.Item name="nickname">
              <Input
                prefix={<UserOutlined />}
                placeholder={t('register.nicknamePlaceholder')}
                autoComplete="nickname"
                allowClear
              />
            </Form.Item>
            <Form.Item name="email" rules={[{ type: 'email', message: t('register.emailInvalid') }]}>
              <Input
                prefix={<MailOutlined />}
                placeholder={t('register.emailPlaceholder')}
                autoComplete="email"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: t('login.passwordRequired') },
                { min: 4, message: t('register.passwordRule') },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('register.passwordPlaceholder')}
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: t('register.confirmRequired') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error(t('register.passwordMismatch')));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('register.confirmPlaceholder')}
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item className="auth-submit">
              <Button type="primary" htmlType="submit" block loading={submitting}>
                {t('register.submit')}
              </Button>
            </Form.Item>
          </Form>

          <p className="auth-switch">
            {t('register.haveAccount')} <Link to="/login">{t('register.back')}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
