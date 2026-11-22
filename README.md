# RustDesk Admin（api-web）

[api-web 前端] 本仓库是 [lejianwen/rustdesk-api-web](https://github.com/lejianwen/rustdesk-api-web) 的分支，**上游已停止维护**；自 fork 起由 xzplays 独立维护，`master` 为唯一主干。

> 感谢原作者 [lejianwen](https://github.com/lejianwen)：最初的 Vue3 + Element Plus 后台由他完成，数据字段、接口约定与页面结构是本仓库重写时的重要参考。配套服务端见 [xzplays/rustdesk-api](https://github.com/xzplays/rustdesk-api)（fork 自 [lejianwen/rustdesk-api](https://github.com/lejianwen/rustdesk-api)）。

## 现状

界面已整体重写为 **React 18 + TypeScript + Ant Design v6 + Pro Components v6**，替代原来的 Vue3 版本，功能对齐服务端全部接口：

- 概览：用户/设备/地址簿/令牌统计，登录审计结果分布，最近登录记录
- 管理：用户、设备、用户组、设备分组、标签、地址簿、收藏夹、共享规则
- 审计：登录审计、连接审计、文件传输审计、登录日志、登录令牌、分享记录
- 单点登录（OAuth/OIDC 提供商）、系统设置（含客户端接入 TOML 与下载入口）
- 用户中心：我的设备（改别名/解绑）、我的地址簿、个人资料与改密
- 中英双语（`简体中文` / `English`），切换即时生效，无需刷新

## 开发

```bash
npm ci          # 或 npm install
npm run dev     # 默认 http://localhost:5173，/api 代理到 https://rustdesk.xzplay.com
npm run build   # 产物在 dist/
```

构建产物直接覆盖到服务端仓库的 `resources/admin`（embed.FS 会把它打进单文件二进制）：

```bash
rm -rf ../api/resources/admin && cp -a dist/. ../api/resources/admin/
```

## 与服务端的约定

- 管理端接口：`POST /api/admin/login`（`{username,password}`）→ `data.token`；后续请求头 **`api-token: <token>`**
- 用户端接口：`Authorization: Bearer <access_token>`（普通用户访问 `/api/my/*`、`/api/ab*`）
- 列表接口统一返回 `{code,message,data:{list,page,total,page_size}}`
- 路由使用 hash 模式，部署在 `/_admin/` 下

## 目录结构

```
src/
  api/         axios 封装与接口定义
  locales/     zh_CN / en_US 文案
  layouts/     ProLayout 侧边栏 + 顶栏
  pages/       各业务页面（管理端 + 用户中心）
  components/  CrudPage 等通用列表/表单组件
  i18n.ts      i18next 初始化与语言切换
```

## 许可证

MIT，见 [LICENSE](LICENSE)。原始版权归 lejianwen 及贡献者所有；本分支的修改同样以 MIT 发布。
