import React from 'react';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import logo from '../assets/logo.svg';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(135deg,#0b1f3a 0%,#123a6b 55%,#1d5fbf 100%)' }}>
      <LoginFormPage
        logo={logo}
        title="RustDesk"
        subTitle="私有化服务端 · 管理后台"
        backgroundImageUrl=""
        containerStyle={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: '8px 0' }}
        onFinish={async (values) => {
          try {
            await signIn(values.username as string, values.password as string);
            message.success('登录成功');
            navigate('/dashboard', { replace: true });
            return true;
          } catch {
            return false;
          }
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <div style={{ marginTop: 8, marginBottom: 8, color: '#999', fontSize: 12 }}>
          默认账号 admin，密码见服务器 /root/rdtest-secrets.env
        </div>
      </LoginFormPage>
    </div>
  );
}
