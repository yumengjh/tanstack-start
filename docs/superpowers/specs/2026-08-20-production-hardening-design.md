# TanStack Start 模板生产硬化设计

## 目标

将模板从可用的前端起步项目强化为可稳定复用的生产基线：生成兼容社交平台的 PNG OG 图、以统一环境配置驱动公开站点信息、通过 Nitro 写入安全头、提供健康检查和部署入口、增加 SSR 端到端验证，并固定依赖与 CI 治理。

不加入认证、API 客户端、业务状态管理、监控或其他可选业务模块。

## 公开配置和静态资产

`.env.example` 定义可公开的 `VITE_SITE_NAME`、`VITE_SITE_URL`、`VITE_SITE_DESCRIPTION`、`VITE_SITE_AUTHOR`、`VITE_SITE_GITHUB_URL` 和 `VITE_SITE_OG_IMAGE`。`src/config/site.ts` 只读取这些公开构建变量，并保留安全的开发默认值；生产构建要求 `VITE_SITE_URL` 是 HTTPS 绝对 URL。

`scripts/generate-og.mjs` 是零交互 Node 命令，支持 `--title`、`--subtitle`、`--accent` 和 `--output`。没有参数时从公开环境配置读取标题和说明，生成 1200×630 的 PNG。生成器同时可写入对应的 SVG 源图，便于审阅和品牌调整。应用使用 PNG 作为 Open Graph/Twitter 图。

新增 favicon、apple touch icon 和 Web Manifest；根路由 head 引用它们。sitemap 和 robots 由同一配置和公开路由清单生成，禁止手工复制站点 URL。

## 安全和部署

当前 `vite.config.ts` 的 Nitro 插件接收 `routeRules`。`/**` 注入 CSP Report-Only、Permissions-Policy、Referrer-Policy、X-Content-Type-Options 和 X-Frame-Options；仅生产模式追加 HSTS。CSP 初始采用 Report-Only，显式允许当前主题初始化所需内联脚本，避免将策略升级本身变成模板不可用的破坏性变更。

`server/routes/health.get.ts` 返回 `{"status":"ok"}`。包脚本增加 `start`，在 Node 运行 Nitro 输出；README 给出环境文件、生成资产、构建和运行方式。

## SEO 与国际化

SEO helper 生成每个页面的 canonical、Open Graph、Twitter、JSON-LD 和 `hreflang`（`zh-CN`、`en-US`、`x-default`）alternate links。404 响应设置 `noindex, nofollow`，并保持本地化 UI。

## 质量与治理

引入 Playwright，仅使用 Chromium；它启动构建后的 SSR Node 服务于独立端口，验证中文/英文页面、语言切换、SEO/hreflang、404 noindex、健康检查与安全响应头。Vitest 继续覆盖纯配置、SEO、静态输出与 OG 参数验证。

固定当前已验证的 TanStack 版本，声明 Node 与 pnpm 版本，修正 pnpm v11 配置位置，增加 GitHub Actions 和 Dependabot。CI 顺序为安装、路由生成、Biome、类型检查、单元测试、构建和 E2E。
