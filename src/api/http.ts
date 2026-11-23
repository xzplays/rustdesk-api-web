import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import i18n from '@/i18n';

const TOKEN_KEY = 'rd_admin_token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiResp<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageData<T = any> {
  list?: T[];
  page: number;
  total: number;
  page_size: number;
}

const instance = axios.create({
  baseURL: window.location.origin,
  timeout: 30000,
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    // admin endpoints authenticate with api-token, user (/api/my/*) endpoints with Bearer
    (config.headers as any)['api-token'] = token;
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    const body = error?.response?.data;
    if (status === 401 || status === 403) {
      clearToken();
      if (!location.hash.includes('/login')) {
        location.hash = '#/login';
      }
    }
    const text = body?.message || body?.error || error.message || i18n.t('common.requestFailed');
    message.error(text);
    return Promise.reject(error);
  },
);

export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  const resp = await instance.request<ApiResp<T>>({
    ...config,
    // the API is mounted under /api on the same origin (nginx -> 127.0.0.1:31114)
    url: config.url?.startsWith('/api') ? config.url : `/api${config.url}`,
  });
  const body = resp.data;
  if (body && typeof body === 'object' && 'code' in body) {
    if (body.code !== 0) {
      message.error(body.message || i18n.t('common.requestFailed'));
      throw new Error(body.message || `code ${body.code}`);
    }
    return body.data as T;
  }
  return body as unknown as T;
}

export function buildQuery(params: Record<string, any>): string {
  const q = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => q.append(k, String(item)));
    else q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}
