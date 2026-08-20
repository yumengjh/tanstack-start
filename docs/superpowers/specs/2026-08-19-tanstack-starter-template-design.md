# TanStack Start 通用启动模板设计

## 目标

将当前 TanStack Start 项目升级为可复用的通用 Web 应用启动模板，以
`/Users/yaopinxin/project/GitHub/nuxt-start` 的产品能力和 Apple 风格首页为基准。
保留当前 React、TanStack Start、Tailwind 和 Biome 工具链；不迁移参考项目的
Nuxt、Vue、UnoCSS、Oxlint 或 Oxfmt。

默认站点为中性占位配置，而非 YumGJS 品牌。参考项目中可复用且不带品牌绑定的
默认 OG 静态图会被复用。

## 页面与路由

- 中文是默认语言：`/`、`/features`、`/demo`；英文使用 `/en`、`/en/features`、
  `/en/demo`。
- 首页、Features、Demo 和 404 页面采用参考项目相同的信息架构与 Apple 风格，
  但全部文案来自本地翻译资源并使用通用模板措辞。
- 顶部导航包含品牌、页面链接、GitHub 占位链接、语言切换和主题切换；页脚包含
  通用版权、隐私和条款占位链接。
- 语言切换在同一页面的中文和英文地址之间转换；未知地址渲染可本地化的 404。

## 国际化

- 使用 `i18next` 与 `react-i18next`，翻译资源按语言放入 `src/i18n`。
- 创建独立 i18n 实例，并通过 `I18nextProvider` 让 React 组件获取 `t` 与当前语言。
- 路由布局根据 URL 解析语言，初始化与 URL 一致的语言，避免 SSR 和客户端首屏文字
  不一致。
- 所有模板界面文字、页面标题、描述和无障碍标签均进入翻译资源；不在组件中保留
  面向用户的硬编码文案。

## 主题和设计系统

- 抽取参考项目的 `--c-*` 亮色/暗色 CSS token，存放于全局样式；组件只消费语义 token。
- 支持 `light`、`dark` 与 `auto` 三态，并将选择保存到 localStorage；服务端输出的内联
  初始化脚本在首帧前解析主题，防止闪烁。
- 首页与次级页使用共享的 `Header`、`Footer`、按钮、卡片和布局类，保持苹果式留白、
  圆角、层级和响应式行为。

## SEO 与站点发现

- 使用 TanStack Router/Start 的路由 `head`，在 SSR HTML 中输出每页 title、description、
  keywords、canonical、Open Graph 与 Twitter Card 元数据。
- 提供 `src/config/site.ts` 作为唯一站点配置入口：名称、描述、生产 URL、作者、社交
  图片和 GitHub URL 均为中性占位值，可在创建项目后替换。
- 将 WebSite 与 WebPage JSON-LD 放入路由 head，字段从站点配置和翻译资源生成。
- 增加 `public/robots.txt` 与由站点配置驱动的 `sitemap.xml`，覆盖中英文公开页面。
- OG 图片使用参考项目中已存在、可复用的默认静态资产；若该资产不存在或带有 YumGJS
  品牌，则改用通用本地占位图，避免错误继承品牌。

## 工程边界与验证

- 保持现有 Biome 配置、命令和规则不变；不引入参考项目的代码格式化或质量工具。
- 新增 Vitest 作为模板能力的回归测试工具，覆盖语言 URL 映射、站点配置、各页面 head
  元数据、sitemap/robots 内容及主题初始化逻辑。
- 更新 README，说明开发、构建、路由约定、站点配置、翻译、主题和 SEO/OG 替换位置。
- 验证包含类型检查、Biome 现有 `check`、测试、生产构建，以及必要时的本地 SSR HTML
  检查；不得将未执行或失败的检查报告为通过。

## 非目标

- 不迁移 Nuxt、Pinia、VueUse、UnoCSS、API 代理或参考项目的业务计数器。
- 不接入第三方翻译服务、CMS、分析平台或真实社交账号。
- 不更换 Biome 格式化与代码质量工具链。
