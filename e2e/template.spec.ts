import { expect, test } from "@playwright/test";

test("shows a top progress indicator during client-side navigation", async ({
	page,
}) => {
	await page.route("**/FeaturesPage-*.js", async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		await route.continue();
	});

	await page.goto("/");
	const progress = page.locator("#page-navigation-progress");
	await expect(progress).toHaveAttribute("data-active", "false");

	await page.getByRole("link", { name: "功能", exact: true }).click();
	await expect(progress).toHaveAttribute("data-active", "true");
	await expect(page).toHaveURL(/\/features$/);
	await expect(progress).toHaveAttribute("data-active", "false");
});

test("renders localized SSR metadata and switches language", async ({ page }) => {
	const response = await page.goto("/");

	expect(response?.status()).toBe(200);
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page).toHaveTitle(/^首页 .+ .+$/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://example.com/",
	);
	await expect(page.locator('link[rel="alternate"][hreflang="en-US"]')).toHaveAttribute(
		"href",
		"https://example.com/en",
	);

	await page.getByRole("button", { name: "EN" }).click();
	await expect(page).toHaveURL(/\/en$/);
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(page.getByRole("heading", { name: "Start clear. Build faster." })).toBeVisible();
});

test("returns a noindex 404 page and protected response headers", async ({ page, request }) => {
	const missingResponse = await page.goto("/missing-page");
	expect(missingResponse?.status()).toBe(404);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");

	const health = await request.get("/health");
	expect(health.ok()).toBeTruthy();
	expect(await health.json()).toEqual({ status: "ok" });

	const home = await request.get("/");
	expect(home.headers()["x-content-type-options"]).toBe("nosniff");
	expect(home.headers()["x-frame-options"]).toBe("DENY");
	expect(home.headers()["strict-transport-security"]).toContain("max-age=31536000");
});
