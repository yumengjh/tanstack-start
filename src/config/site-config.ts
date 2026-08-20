export interface PublicSiteEnvironment extends Record<string, unknown> {
	VITE_SITE_AUTHOR?: string;
	VITE_SITE_DESCRIPTION?: string;
	VITE_SITE_GITHUB_URL?: string;
	VITE_SITE_LOADING_SCREEN?: string;
	VITE_SITE_LOADING_SCREEN_DELAY_MS?: string;
	VITE_SITE_NAME?: string;
	VITE_SITE_NAVIGATION_PROGRESS?: string;
	VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS?: string;
	VITE_SITE_OG_IMAGE?: string;
	VITE_SITE_URL?: string;
}

const defaults = {
	name: "TanStack Start Template",
	url: "https://example.com",
	description:
		"A modern, bilingual TanStack Start template for production-ready web applications.",
	author: "Your team",
	ogImage: "/og-default.png",
	githubUrl: "https://github.com/your-org/your-project",
	loadingScreen: true,
	loadingScreenDelayMs: 120,
	navigationProgress: true,
	navigationProgressDelayMs: 120,
} as const;

function configuredValue(value: unknown, fallback: string) {
	return typeof value === "string" ? value.trim() || fallback : fallback;
}

function configuredBoolean(value: unknown, fallback: boolean) {
	if (typeof value !== "string") return fallback;
	if (value.trim().toLowerCase() === "true") return true;
	if (value.trim().toLowerCase() === "false") return false;
	return fallback;
}

function configuredDelay(value: unknown, fallback: number) {
	if (typeof value !== "string") return fallback;
	const delay = Number(value.trim());
	return Number.isInteger(delay) && delay >= 0 && delay <= 10_000
		? delay
		: fallback;
}

export function createSiteConfig(
	env: PublicSiteEnvironment,
	isProduction = false,
) {
	const configuredUrl = configuredValue(env.VITE_SITE_URL, defaults.url);
	const parsedUrl = new URL(configuredUrl);

	if (isProduction && parsedUrl.protocol !== "https:") {
		throw new Error("VITE_SITE_URL must use HTTPS in production");
	}

	return {
		name: configuredValue(env.VITE_SITE_NAME, defaults.name),
		url: parsedUrl.origin,
		description: configuredValue(
			env.VITE_SITE_DESCRIPTION,
			defaults.description,
		),
		author: configuredValue(env.VITE_SITE_AUTHOR, defaults.author),
		ogImage: configuredValue(env.VITE_SITE_OG_IMAGE, defaults.ogImage),
		githubUrl: configuredValue(env.VITE_SITE_GITHUB_URL, defaults.githubUrl),
		loadingScreen: configuredBoolean(
			env.VITE_SITE_LOADING_SCREEN,
			defaults.loadingScreen,
		),
		loadingScreenDelayMs: configuredDelay(
			env.VITE_SITE_LOADING_SCREEN_DELAY_MS,
			defaults.loadingScreenDelayMs,
		),
		navigationProgress: configuredBoolean(
			env.VITE_SITE_NAVIGATION_PROGRESS,
			defaults.navigationProgress,
		),
		navigationProgressDelayMs: configuredDelay(
			env.VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS,
			defaults.navigationProgressDelayMs,
		),
	} as const;
}
