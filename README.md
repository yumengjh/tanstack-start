# TanStack Start Template

这是一个基于 TanStack Start、React、Nitro 与 Tailwind CSS 的双语 Web 项目启动模板。当前模板已包含文件路由、SSR、站点元数据、深浅主题、可生成的社交图片与爬虫资产、基础安全头、健康检查、单元测试、Chromium E2E、CI 和依赖更新策略。

它是一个前端与 SSR 基线，不包含身份认证、用户系统、数据库、业务 API、状态管理框架或可观测性服务。

## 目录

- [快速开始](#快速开始)
- [当前能力与页面](#当前能力与页面)
- [站点配置](#站点配置)
- [项目结构](#项目结构)
- [国际化、路由与界面](#国际化路由与界面)
- [SEO、OG 与静态资产](#seoog-与静态资产)
- [安全、服务端与运行](#安全服务端与运行)
- [命令与验证](#命令与验证)
- [测试与自动化](#测试与自动化)
- [依赖、代码质量与编辑器](#依赖代码质量与编辑器)
- [模板启用清单](#模板启用清单)

## 快速开始

运行环境由 `package.json` 固定为 Node.js 22+ 与 pnpm 11.10.0。首次克隆后执行：

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

开发服务器使用 Vite，默认监听 `http://localhost:3000`。`.env` 被 Git 忽略；`.env.example` 是应提交并复制的公开配置示例。

所有 `VITE_` 环境变量都会被嵌入浏览器包，不能放置密码、令牌或其他私密信息。

## 当前能力与页面

| 能力 | 当前实现 |
| --- | --- |
| 应用框架 | TanStack Start + React 19 + Nitro SSR，TanStack Router 文件路由 |
| 默认语言 | 中文；英文使用稳定的 `/en` 前缀 |
| 页面 | 首页、功能说明页、交互演示页、404 页面 |
| 导航 | 顶部品牌链接、功能/演示/GitHub 链接、语言切换、主题切换；移动端隐藏 GitHub 导航项 |
| 主题 | `auto`、`light`、`dark` 三态；保存至浏览器 localStorage，并随系统主题变化更新 `auto` 模式 |
| SEO | 路由级 SSR head、canonical、Open Graph、Twitter Card、JSON-LD、`hreflang` |
| 静态资产 | robots、sitemap、Web Manifest、SVG favicon、Apple Touch Icon、192/512 PNG 图标、默认 OG PNG |
| 服务端 | `GET /health` 返回 `{ "status": "ok" }` |
| 质量保障 | Vitest 单元测试、Playwright Chromium E2E、GitHub Actions、Dependabot |

公开页面与语言对应关系如下。每个页面都由各自路由文件提供本地化 title、description、keywords、canonical 与 JSON-LD。

| 中文路径 | 英文路径 | 页面 |
| --- | --- | --- |
| `/` | `/en` | 首页：模板说明、功能入口、演示入口和 GitHub CTA |
| `/features` | `/en/features` | 三项模板基础能力说明 |
| `/demo` | `/en/demo` | React 计数器、双倍值和当前视口宽度演示 |
| 任意未匹配路径 | 任意未匹配路径 | 本地化 404 页面，返回 404 且标记为 `noindex, nofollow` |

页脚的“隐私政策”和“使用条款”目前仅指向 `#privacy` 与 `#terms` 锚点，不是已实现的政策页面。

## 站点配置

站点配置由 `src/config/site.ts` 在运行时读取 `import.meta.env`，并调用 `src/config/site-config.ts` 处理默认值、空字符串和 URL 规范化。复制 `.env.example` 后按下表替换占位值。

| 变量 | 默认值 | 实际作用 |
| --- | --- | --- |
| `VITE_SITE_NAME` | `TanStack Start Template` | 顶部品牌、页脚、默认 OG 图片标题、Web Manifest 名称、Open Graph 站点名 |
| `VITE_SITE_URL` | `https://example.com` | canonical、OG URL、JSON-LD、`hreflang`、robots 与 sitemap 的域名来源 |
| `VITE_SITE_DESCRIPTION` | 通用英文模板说明 | 默认站点描述与自动生成 OG 图片说明 |
| `VITE_SITE_AUTHOR` | `Your team` | 页面 SEO `author` meta |
| `VITE_SITE_GITHUB_URL` | `https://github.com/your-org/your-project` | 顶部导航和首页 CTA 的外链 |
| `VITE_SITE_OG_IMAGE` | `/og-default.png` | SEO 使用的默认社交图片 URL；本地路径会在资产生成时写入 `public/` |

`VITE_SITE_URL` 会被规范化为 origin，因此不要填写部署子路径；例如 `https://acme.example/docs/` 最终使用 `https://acme.example`。生产构建中它必须是 HTTPS URL；非 HTTPS 会导致站点配置初始化失败。

## 项目结构

```text
src/
  routes/                 TanStack Router 文件路由；中文与 en 路由各自声明 SSR head
  components/             Header、Footer、首页、功能页、演示页、语言/主题切换与 404 UI
  config/                 VITE_SITE_* 配置读取、默认值和生产 URL 校验
  i18n/                   i18next 实例、zh/en 翻译资源和 URL 语言映射
  lib/                    SEO、主题解析和安全响应头纯函数
  styles.css              Tailwind 与 token 入口、响应式布局和 Apple 风格组件类
  styles/tokens/theme.css 集中管理字体、亮色/暗色主题与 CSS 变量
  router.tsx              Router：滚动恢复与 intent 预加载
server/routes/health.ts   Nitro 健康检查文件路由
scripts/                  OG 图片与站点静态资产生成脚本
public/                   生成后的站点资产与保留的 og-default.svg
e2e/                      Playwright Chromium E2E
.github/                  CI 与 Dependabot 配置
```

`src/routeTree.gen.ts` 由 `pnpm generate-routes` 生成；VS Code 设置已将其标记为只读，并从文件监听和搜索中排除。不要手改该文件。

`docs/superpowers/` 保存本项目此前的设计与执行计划，属于工程过程记录，不参与运行时构建。`.cta.json` 是初始脚手架元数据，其中的 `packageManager: npm` 不代表当前项目实际包管理器；实际来源是 `package.json` 的 `pnpm@11.10.0`。

## 国际化、路由与界面

### 国际化

- 语言资源位于 `src/i18n/locales/zh.ts` 与 `src/i18n/locales/en.ts`，当前使用 `react-i18next` 和 `i18next`。
- `LocaleProvider` 会按当前路由创建 i18next 实例；默认回退语言是中文。
- `localeFromPathname` 以 `/en` 或 `/en/...` 判断英文，其他路径均为中文。
- 语言切换会保留去除或添加 `/en` 前缀后的同一路径，例如 `/features` 与 `/en/features`；切换使用完整页面跳转。
- 新增可翻译 UI 时，应同时更新两份语言资源，并新增中英文对应路由和 sitemap 生成列表。

### 主题与视觉 token

主题按钮的循环顺序为 `auto → light → dark → auto`。选择保存在 localStorage 的 `theme` 键中；`auto` 会读取 `prefers-color-scheme`，并监听系统主题变化。根路由在 `<head>` 中先执行一个无依赖主题初始化脚本，以在 React 水合前应用选择的主题。

`src/styles/tokens/theme.css` 是 CSS token 的专用位置，包含：

- 亮色、暗色和系统暗色的 `--c-*` 颜色 token：背景、文字、边框、主色与交互色。
- `--ld-*` 卡片背景与阴影 token。
- Tailwind 使用的 `--font-sans` 字体 token。

`src/styles.css` 仅引入 Tailwind 与 token 文件，并维护全局基础样式和界面类，包括：

- 可复用的 `apple-label`、`apple-title-large`、`apple-title-medium`、`apple-body`、`apple-card`、`apple-button-primary`、`apple-button-link`、`apple-button` 类。
- 粘性半透明导航、响应式页面容器、卡片悬停效果和小屏布局规则。

样式以 Tailwind CSS v4 的 Vite 插件为基础，页面还直接使用 Tailwind 工具类。后续新增 CSS 变量请放入 `src/styles/tokens/` 下按职责拆分的文件，并从 `src/styles.css` 引入；修改品牌视觉时应优先替换 token，而不是在组件中硬编码颜色。

## SEO、OG 与静态资产

### SSR head 与结构化数据

`src/lib/seo.ts` 为六个公开页面生成以下内容：

- title、description、keywords、author 和 `robots: index, follow`。
- canonical URL。
- `zh-CN`、`en-US` 与指向中文页的 `x-default` alternate links。
- Open Graph：类型、站点名、URL、标题、描述与图片。
- Twitter `summary_large_image` 卡片。
- 每页一个 JSON-LD 脚本，包含 `WebSite` 与 `WebPage`。

根路由还声明 viewport、favicon、Apple Touch Icon、Web Manifest。根级 `noindex, nofollow` 作为未命中路由的默认值；公开页面的路由级 head 会覆盖为 `index, follow`。

### OG 图片命令

`scripts/generate-og.mjs` 使用 `@resvg/resvg-js` 将内置 SVG 渲染为 1200×630 PNG。所有参数均为可选的成对参数：

```bash
pnpm generate:og -- \
  --title "Acme" \
  --description "A reusable product starter" \
  --site-name "Acme" \
  --accent "#0071e3" \
  --background "#f5f5f7" \
  --foreground "#1d1d1f" \
  --output public/og-default.png
```

省略参数时会使用模板默认值。脚本会创建输出目录，并对文字转义、按空格分两行截断。`public/og-default.png` 是当前默认 SEO 图片；`public/og-default.svg` 仍保留在仓库中，但默认配置与自动生成流程不再引用它。

### 自动生成的站点资产

`pnpm build` 的 `prebuild` 钩子会先运行 `pnpm generate:site-assets`。该脚本读取当前 Vite 环境变量，生成或覆盖：

- `public/robots.txt`：允许抓取并指向当前站点的 sitemap。
- `public/sitemap.xml`：列出当前六个公开的中英文页面。
- `public/site.webmanifest`：站点名、短名称、主题色、背景色和 PNG 图标声明。
- `public/favicon.svg`、`public/apple-touch-icon.png`、`public/icon-192.png`、`public/icon-512.png`。
- `VITE_SITE_OG_IMAGE` 指向的本地 PNG，例如 `/social/acme.png` 会写为 `public/social/acme.png`。

可独立运行并指定测试或临时目录：

```bash
pnpm generate:site-assets -- --public-dir ./tmp-public
```

当 `VITE_SITE_OG_IMAGE` 是外部 URL（不以 `/` 开头）时，脚本不会生成该图片；需要由外部存储或 CDN 提供。新增公开页面时，需要同步更新 `scripts/generate-site-assets.mjs` 中的 `routes` 数组，否则不会进入 sitemap。

## 安全、服务端与运行

### 安全响应头

Nitro 在 `vite.config.ts` 中为 `/**` 设置以下响应头：

| 响应头 | 当前值或策略 |
| --- | --- |
| `Content-Security-Policy-Report-Only` | self 为默认源；允许 `data:` 与 HTTPS 图片/字体/连接；内联脚本与样式当前被允许 |
| `Permissions-Policy` | 禁用 camera、geolocation、microphone |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Strict-Transport-Security` | 仅 production 模式：`max-age=31536000; includeSubDomains` |

CSP 目前是 Report-Only，不会阻断资源。接入第三方脚本、字体、图片或 API 域名时，应先检查违规报告，再按实际来源收紧策略。安全漏洞报告流程见 [SECURITY.md](SECURITY.md)；其中的私密报告渠道仍是启用项目时需要替换的占位说明。

### Nitro 服务端与部署

Nitro 的服务端目录为 `server/`，目前唯一自定义服务端路由是 `GET /health`。生产构建命令会生成 `.output/server/index.mjs`；运行顺序为：

```bash
pnpm build
pnpm start
```

`pnpm start` 不会自动构建，只运行已有产物。`pnpm preview` 保留为 Vite Preview 命令，适合预览，不等同于通过 Nitro Node 产物启动的生产服务器。

Vite 配置启用了 TanStack Devtools 与 Router Devtools 的开发支持；生产构建会移除对应 Devtools 代码。Router 同时启用滚动恢复和基于 intent 的预加载。Nitro 构建配置将 `@sentry/*` 声明为 external，但当前没有 Sentry 依赖、DSN 或错误上报实现。

## 命令与验证

| 命令 | 行为 |
| --- | --- |
| `pnpm dev` | 启动端口 3000 的 Vite 开发服务器 |
| `pnpm generate-routes` | 根据 `src/routes/` 重新生成 `src/routeTree.gen.ts` |
| `pnpm generate:og -- [参数]` | 生成一张 PNG Open Graph 图片 |
| `pnpm generate:site-assets -- [参数]` | 生成 robots、sitemap、图标、manifest 与本地 OG 图片 |
| `pnpm prebuild` | 单独执行构建前的站点资产生成钩子 |
| `pnpm build` | 先生成站点资产，再构建 Vite SSR 与 Nitro Node 产物 |
| `pnpm start` | 启动已有 `.output/server/index.mjs` |
| `pnpm preview` | 运行 `vite preview` |
| `pnpm test` | 运行 Vitest 单元测试；显式排除 `e2e/**` |
| `pnpm test:e2e` | 先构建，再运行 Playwright Chromium E2E |
| `pnpm typecheck` | 运行不产出文件的 TypeScript 检查 |
| `pnpm format` | 使用 Biome 格式化其配置范围内的文件 |
| `pnpm lint` | 使用 Biome 执行 lint |
| `pnpm check` | 使用 Biome 同时执行格式、lint 与辅助检查 |

首次运行 E2E 前安装浏览器：

```bash
pnpm exec playwright install chromium
```

Playwright 测试运行已构建的 Nitro 产物，固定使用 `127.0.0.1:4173`，并以 `/health` 作为服务就绪检查。

## 测试与自动化

### 当前测试覆盖

Vitest 使用 Node 环境，当前共有 13 项测试，覆盖：

- `VITE_SITE_*` 默认值、覆盖值、URL origin 规范化与 production HTTPS 限制。
- 中英文 URL 映射。
- `auto` 主题解析。
- 基础安全头与仅生产环境的 HSTS。
- canonical、Open Graph URL、三种 `hreflang` 与 sitemap 的六个公开页面。
- OG 命令生成有效 PNG。
- 站点资产命令生成可配置的 robots、sitemap、manifest 和本地 OG PNG。

Playwright 有 2 项 Chromium E2E，覆盖中文首页的 SSR 状态、canonical、英文 alternate link、语言切换、英文页面内容、404 的 noindex、`/health` JSON 以及关键安全响应头。

### CI 与依赖更新

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) 会在所有 Pull Request，以及推送到 `main` 或 `master` 时执行：检出代码、安装 pnpm 11.10.0、设置 Node 22 和 pnpm 缓存、锁文件安装、Biome 检查、TypeScript 检查、Vitest、安装 Chromium 及 Playwright E2E。

[`.github/dependabot.yml`](.github/dependabot.yml) 每周检查 npm 与 GitHub Actions 更新；开发依赖会被归为一个 Dependabot 更新组。

## 依赖、代码质量与编辑器

所有直接依赖均锁定为精确版本。生产依赖如下：

| 包 | 版本 | 当前用途 |
| --- | --- | --- |
| `@resvg/resvg-js` | 2.6.2 | OG、favicon 与 PNG 图标渲染 |
| `@tailwindcss/vite` | 4.3.3 | Vite 中的 Tailwind CSS 集成 |
| `@tanstack/react-devtools` | 0.10.10 | 根路由中的 TanStack Devtools 面板 |
| `@tanstack/react-router` | 1.170.30 | 文件路由与链接 |
| `@tanstack/react-router-devtools` | 1.167.1 | Router Devtools 面板 |
| `@tanstack/react-start` | 1.168.47 | TanStack Start Vite 集成与 SSR |
| `i18next` | 25.10.10 | 翻译实例与资源管理 |
| `nitro` | 3.0.260610-beta | SSR、Node 产物、文件服务端路由与 route rules |
| `react` | 19.2.8 | UI 运行时 |
| `react-dom` | 19.2.8 | 浏览器与 SSR DOM 渲染 |
| `react-i18next` | 16.6.6 | React 翻译 Provider 与 Hook |
| `tailwindcss` | 4.3.3 | CSS 工具类与 `@import "tailwindcss"` |

开发依赖如下：

| 包 | 版本 | 当前用途 |
| --- | --- | --- |
| `@biomejs/biome` | 2.4.5 | 格式化、lint 与检查 |
| `@playwright/test` | 1.62.1 | Chromium E2E |
| `@tailwindcss/typography` | 0.5.20 | 已安装的 Tailwind Typography 插件；当前源码未显式引用 |
| `@tanstack/devtools-vite` | 0.8.3 | 构建时处理 TanStack Devtools |
| `@tanstack/router-cli` | 1.167.30 | `tsr generate` 路由树生成命令 |
| `@types/node` | 22.20.1 | Node 类型 |
| `@types/react` | 19.2.18 | React 类型 |
| `@types/react-dom` | 19.2.4 | React DOM 类型 |
| `@vitejs/plugin-react` | 6.0.5 | Vite React 插件 |
| `typescript` | 6.0.3 | 类型检查 |
| `vite` | 8.2.1 | 开发服务器、构建与 Preview |
| `vitest` | 4.1.10 | 单元测试 |

`pnpm-workspace.yaml` 只允许 `esbuild` 和 `lightningcss` 执行构建脚本。

TypeScript 以 ES2022、严格模式、Bundler 模块解析和 `noEmit` 运行，并定义 `#/*`、`@/*` 到 `src/*` 的路径别名。Biome 使用 tab 缩进、双引号与 recommended lint 规则；其 `files.includes` 明确覆盖 `src/`、`.vscode/`、`vite.config.ts` 等配置范围，且不格式化生成的 `routeTree.gen.ts` 或 `styles.css`。

`.vscode/settings.json` 将 JavaScript、TypeScript、JSON 与 CSS 的默认格式化器设置为 Biome，并把“组织导入”设置为显式保存操作。`.gitignore` 排除 `.env`、构建产物、工具缓存、Playwright 报告和测试结果。

## 模板启用清单

创建真实项目后，请至少完成以下替换与确认：

1. 从 `.env.example` 创建本地 `.env`，替换所有 `VITE_SITE_*` 占位值，尤其是 HTTPS 域名与 GitHub URL。
2. 运行 `pnpm build`，使 sitemap、robots、manifest、图标和默认 OG 图片按新站点配置重新生成。
3. 在 `src/i18n/locales/zh.ts` 与 `src/i18n/locales/en.ts` 替换模板文案；新增页面时同步添加两种语言路由、SEO head 和 sitemap 路径。
4. 在 `src/styles/tokens/theme.css` 更新 token、品牌主色和视觉样式；需要时用 `pnpm generate:og` 生成匹配品牌的社交图片。
5. 替换 [LICENSE](LICENSE) 中的 `Your Name`，并在 [SECURITY.md](SECURITY.md) 填写实际私密漏洞报告渠道。
6. 为真实的隐私政策、使用条款、业务 API、认证、数据存储和监控分别新增实现、环境变量和测试；这些能力当前没有提供。
7. 在提交或发布前运行 `pnpm check && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`。
