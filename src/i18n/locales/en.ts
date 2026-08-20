export const en = {
	app: {
		brand: "TanStack Start Template",
		nav: { features: "Features", demo: "Demo", github: "GitHub" },
		switchLocale: "中文",
		theme: {
			auto: "System",
			light: "Light",
			dark: "Dark",
			label: "Theme: {{mode}}. Click to change theme.",
		},
		footer: {
			rights: "All rights reserved.",
			privacy: "Privacy Policy",
			terms: "Terms of Use",
		},
		backHome: "Back to Home",
	},
	home: {
		badge: "TANSTACK START TEMPLATE",
		title: "Start clear. Build faster.",
		description:
			"A bilingual, theme-aware, SEO-ready baseline for modern React applications—so every new project starts with the right architecture.",
		start: "Explore features",
		github: "View GitHub",
		featuresCard: {
			title: "Modern foundations",
			description:
				"TanStack Start, type-safe routing, and configurable server rendering are ready on day one.",
		},
		demoCard: {
			title: "Interactive state",
			description:
				"A compact dashboard shows reactive state, viewport awareness, and complete theme support.",
		},
	},
	features: {
		eyebrow: "Features",
		title: "Foundations made for long-lived products.",
		items: [
			{
				title: "TanStack Start",
				description:
					"Type-safe routing, server rendering, and code splitting built around React.",
			},
			{
				title: "React i18next",
				description:
					"Extensible translation resources with stable Chinese and English page URLs.",
			},
			{
				title: "Native SEO",
				description:
					"Each route renders metadata, structured data, and social cards from the server.",
			},
		],
	},
	demo: {
		eyebrow: "Demo",
		title: "Interactive state panel",
		count: "Count",
		double: "Double",
		decrease: "Decrease count",
		increase: "Increase count",
		viewport: "Viewport",
	},
	notFound: {
		title: "Page not found",
		description: "The page may have moved, or the link may be incorrect.",
	},
	seo: {
		home: {
			title: "Home",
			description:
				"A reusable bilingual application starter for TanStack Start.",
			keywords: "TanStack Start, React, starter template, SEO, i18n",
		},
		features: {
			title: "Features",
			description:
				"Explore the frontend foundations included in this template.",
			keywords: "TanStack Start, React, i18n, SEO",
		},
		demo: {
			title: "Demo",
			description: "Explore an interactive React example in the template.",
			keywords: "TanStack Start, React demo",
		},
	},
} as const;
