import { describe, expect, it } from "vitest";

import { createSiteConfig } from "./site-config";

describe("createSiteConfig", () => {
	it("uses safe template defaults when no public environment variables are set", () => {
		expect(createSiteConfig({})).toMatchObject({
			name: "TanStack Start Template",
			url: "https://example.com",
			ogImage: "/og-default.png",
		});
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
