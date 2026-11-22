import { buildQuery, PageData, request } from './http';

export interface LoginResult {
  username: string;
  email: string;
  avatar: string;
  token: string;
  route_names: string[];
  nickname: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  group_id: number;
  is_admin: boolean;
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
  route_names?: string[];
  token?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  return request<LoginResult>({
    url: '/api/admin/login',
    method: 'POST',
    data: { username, password },
  });
}

export interface LoginOptions {
  ops: string[];
  register: boolean;
  need_captcha: boolean;
  disable_pwd: boolean;
  auto_oidc: boolean;
}

export async function loginOptions(): Promise<LoginOptions> {
  return request<LoginOptions>({ url: '/api/admin/login-options', method: 'GET' });
}

export async function register(data: {
  username: string;
  email?: string;
  nickname?: string;
  password: string;
  confirm_password: string;
}): Promise<LoginResult> {
  return request<LoginResult>({ url: '/api/admin/user/register', method: 'POST', data });
}

export interface MyPeer {
  row_id: number;
  id: string;
  uuid: string;
  alias: string;
  hostname: string;
  os: string;
  version: string;
  last_online_ip: string;
  last_online_time: number;
  info?: any;
}

export async function myPeers(page = 1, pageSize = 20) {
  return request<{ list: MyPeer[]; page: number; total: number; page_size: number }>({
    url: `/api/my/peers?page=${page}&page_size=${pageSize}`,
    method: 'GET',
  });
}

export async function myPeerUpdate(row_id: number, alias: string) {
  return request({ url: '/api/my/peer/update', method: 'POST', data: { row_id, alias } });
}

export async function myPeerUnbind(row_id: number) {
  return request({ url: '/api/my/peer/unbind', method: 'POST', data: { row_id } });
}

export interface MyAddressBookEntry {
  row_id: number;
  id: string;
  username: string;
  hostname: string;
  alias: string;
  platform: string;
  tags: string[] | null;
  online: boolean;
  collection_id: number;
}

export async function myAddressBook(page = 1, pageSize = 50) {
  return request<{ list: MyAddressBookEntry[]; page: number; total: number; page_size: number }>({
    url: `/api/my/address_book?page=${page}&page_size=${pageSize}`,
    method: 'GET',
  });
}

export async function logout(): Promise<void> {
  return request({ url: '/api/admin/logout', method: 'POST' });
}

export async function currentUser(): Promise<AdminUser> {
  return request<AdminUser>({ url: '/api/admin/user/current', method: 'GET' });
}

export async function changePassword(data: {
  old_password: string;
  new_password: string;
  confirm_password?: string;
}): Promise<void> {
  return request({ url: '/api/admin/user/changeCurPwd', method: 'POST', data });
}

/** Generic paginated GET for every /api/admin/<module>/list endpoint. */
export async function list<T = any>(
  module: string,
  params: Record<string, any> = {},
): Promise<PageData<T>> {
  const query = buildQuery({ page: 1, page_size: 20, ...params });
  const data = await request<PageData<T>>({
    url: `/api/admin/${module}/list${query}`,
    method: 'GET',
  });
  return { list: data?.list ?? [], page: data?.page ?? 1, total: data?.total ?? 0, page_size: data?.page_size ?? 20 };
}

export async function detail<T = any>(module: string, id: number | string): Promise<T> {
  return request<T>({ url: `/api/admin/${module}/detail/${id}`, method: 'GET' });
}

export async function create(module: string, data: any): Promise<any> {
  return request({ url: `/api/admin/${module}/create`, method: 'POST', data });
}

export async function update(module: string, data: any): Promise<any> {
  return request({ url: `/api/admin/${module}/update`, method: 'POST', data });
}

export async function remove(module: string, id: number | string): Promise<any> {
  return request({ url: `/api/admin/${module}/delete`, method: 'POST', data: { id } });
}

export async function batchRemove(
  module: string,
  ids: (number | string)[],
  key = 'ids',
): Promise<any> {
  return request({ url: `/api/admin/${module}/batchDelete`, method: 'POST', data: { [key]: ids } });
}

export async function serverConfig(): Promise<any> {
  return request({ url: '/api/admin/config/server', method: 'GET' });
}

export async function appConfig(): Promise<any> {
  return request({ url: '/api/admin/config/app', method: 'GET' });
}

/** Raw endpoint escape hatch for the few non-CRUD routes (audit, share, cmd). */
export async function raw<T = any>(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any,
  params?: Record<string, any>,
): Promise<T> {
  const query = params ? buildQuery(params) : '';
  return request<T>({ url: `${url}${query}`, method, data });
}
