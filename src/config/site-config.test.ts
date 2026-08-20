import { describe, expect, it } from "vitest";

import { createSiteConfig } from "./site-config";

describe("createSiteConfig", () => {
	it("uses safe template defaults when no public environment variables are set", () => {
		expect(createSiteConfig({})).toMatchObject({
			name: "TanStack Start Template",
			url: "https://example.com",
			ogImage: "/og-default.png",
			loadingScreen: true,
			loadingScreenDelayMs: 120,
			navigationProgress: true,
			navigationProgressDelayMs: 120,
		});
	});

	it("supports independently configurable feedback delays and rejects invalid delay values", () => {
		expect(
			createSiteConfig({
				VITE_SITE_LOADING_SCREEN_DELAY_MS: "0",
				VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS: "300",
			}),
		).toMatchObject({
			loadingScreenDelayMs: 0,
			navigationProgressDelayMs: 300,
		});

		expect(
			createSiteConfig({ VITE_SITE_LOADING_SCREEN_DELAY_MS: "fast" }),
		).toMatchObject({ loadingScreenDelayMs: 120 });
	});

	it("allows the first-load screen to be disabled with a public environment variable", () => {
		expect(
			createSiteConfig({ VITE_SITE_LOADING_SCREEN: "false" }),
		).toMatchObject({ loadingScreen: false });
	});

	it("allows the navigation progress indicator to be disabled with a public environment variable", () => {
		expect(
			createSiteConfig({ VITE_SITE_NAVIGATION_PROGRESS: "false" }),
		).toMatchObject({ navigationProgress: false });
	});

	it("normalizes a configured site URL and accepts public overrides", () => {
		expect(
			createSiteConfig({
				VITE_SITE_NAME: "Acme",
				VITE_SITE_URL: "https://acme.example/docs/",
				VITE_SITE_OG_IMAGE: "/social.png",
			}),
		).toMatchObject({
			name: "Acme",
			url: "https://acme.example",
			ogImage: "/social.png",
		});
	});

	it("rejects a non-HTTPS public site URL for production builds", () => {
		expect(() =>
			createSiteConfig({ VITE_SITE_URL: "http://localhost:3000" }, true),
		).toThrow("VITE_SITE_URL must use HTTPS in production");
	});
});
