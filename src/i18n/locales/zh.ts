export const zh = {
	app: {
		brand: "TanStack Start Template",
		nav: { features: "功能", demo: "演示", github: "GitHub" },
		switchLocale: "EN",
		theme: {
			auto: "跟随系统",
			light: "浅色模式",
			dark: "深色模式",
			label: "主题：{{mode}}。点击切换主题。",
		},
		footer: {
			rights: "保留所有权利。",
			privacy: "隐私政策",
			terms: "使用条款",
		},
		backHome: "返回首页",
	},
	home: {
		badge: "TANSTACK START 模板",
		title: "从清晰的起点，构建更快的产品。",
		description:
			"为现代 React 应用准备的双语、主题与 SEO 基础能力，让每个新项目从正确的架构开始。",
		start: "查看功能",
		github: "查看 GitHub",
		featuresCard: {
			title: "现代开发基线",
			description:
				"包含 TanStack Start、类型安全路由与可配置的服务端渲染能力。",
		},
		demoCard: {
			title: "交互状态演示",
			description: "用一个小型仪表盘展示响应式状态、视口感知与完整主题支持。",
		},
	},
	features: {
		eyebrow: "功能",
		title: "为长期维护准备的基础能力。",
		items: [
			{
				title: "TanStack Start",
				description: "类型安全路由、服务端渲染与按需加载，均以 React 为中心。",
			},
			{
				title: "React i18next",
				description: "可扩展的翻译资源与稳定的中英文页面地址策略。",
			},
			{
				title: "原生 SEO",
				description: "每个路由以服务端 head 输出元数据、结构化数据和社交卡片。",
			},
		],
	},
	demo: {
		eyebrow: "演示",
		title: "交互式状态面板",
		count: "计数",
		double: "双倍数值",
		decrease: "减少计数",
		increase: "增加计数",
		viewport: "当前视口",
	},
	notFound: {
		title: "找不到这个页面",
		description: "页面可能已移动，或链接地址有误。",
	},
	seo: {
		home: {
			title: "首页",
			description: "可复用的 TanStack Start 双语应用启动模板。",
			keywords: "TanStack Start, React, 启动模板, SEO, 国际化",
		},
		features: {
			title: "功能",
			description: "了解模板已集成的前端基础能力。",
			keywords: "TanStack Start, React, i18n, SEO",
		},
		demo: {
			title: "演示",
			description: "浏览模板中的 React 交互示例。",
			keywords: "TanStack Start, React 演示",
		},
	},
} as const;
