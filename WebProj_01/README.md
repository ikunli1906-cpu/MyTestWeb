# 公司信息展示静态网站

专业商务风格的企业展示静态网站，集成 Netlify CMS 内容管理系统。

## 功能模块

| 页面 | 功能 |
|------|------|
| `index.html` | 首页（Hero + 公司简介预览 + 服务预览 + 优势展示） |
| `about.html` | 关于我们（公司详情 + 发展历程时间轴） |
| `services.html` | 产品服务（卡片网格展示） |
| `contact.html` | 联系我们（联系信息 + 留言表单 + 百度地图） |
| `admin/` | Netlify CMS 后台（登录即可编辑内容） |

## 快速开始

### 本地预览

```bash
# 安装 netlify-cms-proxy-server（仅首次）
npm install -g netlify-cms-proxy-server

# 启动本地 CMS 预览
npx netlify-cms-proxy-server

# 在另一终端启动静态服务器
npx serve .
```

然后访问 `http://localhost:3000/admin/` 即可进入 CMS 后台（本地模式无需 GitHub 登录）。

### 修改百度地图 AK

在 `contact.html` 中将 `YOUR_BAIDU_MAP_AK` 替换为你的百度地图 AK：

```html
<script src="https://api.map.baidu.com/api?v=3.0&ak=YOUR_BAIDU_MAP_AK"></script>
```

申请地址：<https://lbsyun.baidu.com/apiconsole/key>

## Netlify CMS 使用说明

### 部署到 Netlify（推荐）

1. 将代码推送到 GitHub 仓库
2. 登录 <https://app.netlify.com> → "Add new site" → 选择仓库
3. Build settings：`Publish directory = .`（无需构建）
4. 在 Netlify 控制台 → Identity → Enable Identity
5. 在 Identity → Services → Git Gateway → Enable Git Gateway

### 登录 CMS 后台

部署后访问 `https://your-site.netlify.app/admin/`，用 Netlify Identity 账号登录即可。

### 内容管理

CMS 后台提供三个集合：

| 集合 | 对应文件 | 可编辑字段 |
|------|-----------|-------------|
| 公司简介 | `_data/about.json` | 公司名称、简介、Hero 标题/副标题、发展历程 |
| 产品服务 | `_data/services.json` | 服务名称、描述、图标（图片上传） |
| 联系信息 | `_data/contact.json` | 地址、电话、邮箱、工作时间、地图坐标 |

保存后内容自动提交到 Git，网站实时更新。

## 安全配置

`netlify.toml` 已预配置以下安全头部：

- `Content-Security-Policy` — 防 XSS 攻击
- `X-Frame-Options: DENY` — 防点击劫持
- `X-Content-Type-Options: nosniff` — 防 MIME 嗅探
- `X-XSS-Protection` — IE 防 XSS
- `Referrer-Policy` — 控制引用信息
- `Permissions-Policy` — 限制浏览器特性

## 目录结构

```
├── index.html          # 首页
├── about.html          # 关于我们
├── services.html       # 产品服务
├── contact.html        # 联系我们
├── css/
│   ├── style.css      # 主样式（CSS 变量主题系统）
│   └── responsive.css # 响应式适配
├── js/
│   ├── main.js        # 导航交互、滚动动画
│   ├── cms-render.js # CMS 数据渲染
│   └── map.js        # 百度地图初始化
├── admin/
│   └── index.html     # CMS 后台入口
├── _data/             # CMS 管理的 JSON 数据
│   ├── about.json
│   ├── services.json
│   └── contact.json
├── config.yml         # Netlify CMS 配置
├── netlify.toml       # 部署 & 安全头部配置
└── public/
    ├── images/
    └── uploads/       # CMS 图片上传目录
```

## 自定义样式

修改 `css/style.css` 顶部的 CSS 变量即可全局换色：

```css
:root {
  --primary-dark:  #1a365d;   /* 主色（深蓝）*/
  --primary-accent: #c9a84c;   /* 强调色（金色）*/
  --fs-heading:    32px;        /* 标题字号 */
  /* ... */
}
```
