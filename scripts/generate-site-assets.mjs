import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import { loadEnv } from "vite";

import { generateOg } from "./generate-og.mjs";

const defaultConfig = {
	description: "A modern, bilingual TanStack Start template for production-ready web applications.",
	name: "TanStack Start Template",
	ogImage: "/og-default.png",
	url: "https://example.com",
};

const routes = ["/", "/features", "/demo", "/en", "/en/features", "/en/demo"];

function getConfig() {
	const env = { ...loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "VITE_"), ...process.env };
	const url = new URL(env.VITE_SITE_URL?.trim() || defaultConfig.url);

	return {
		description: env.VITE_SITE_DESCRIPTION?.trim() || defaultConfig.description,
		name: env.VITE_SITE_NAME?.trim() || defaultConfig.name,
		ogImage: env.VITE_SITE_OG_IMAGE?.trim() || defaultConfig.ogImage,
		url: url.origin,
	};
}

function getOption(argumentsList, name, fallback) {
	const index = argumentsList.indexOf(name);
	return index === -1 ? fallback : argumentsList[index + 1] || fallback;
}

function iconSvg() {
	return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="112" fill="#0071e3"/><path d="M136 142h240v70h-76v158h-88V212h-76v-70Z" fill="white"/></svg>`;
}

function absoluteAssetPath(publicDirectory, assetPath) {
	if (!assetPath.startsWith("/")) return null;
	const target = resolve(publicDirectory, `.${assetPath}`);
	if (relative(publicDirectory, target).startsWith("..")) {
		throw new Error("VITE_SITE_OG_IMAGE must stay inside public/ when using a local path");
	}
	return target;
}

async function writeIcon(output, width) {
	await mkdir(dirname(output), { recursive: true });
	const renderer = new Resvg(iconSvg(), { fitTo: { mode: "width", value: width } });
	await writeFile(output, renderer.render().asPng());
}

export async function generateSiteAssets({ publicDirectory } = {}) {
	const config = getConfig();
	const targetDirectory = resolve(publicDirectory ?? "public");
	const sitemap = routes
		.map((path) => `  <url><loc>${new URL(path, `${config.url}/`).toString()}</loc></url>`)
		.join("\n");

	await mkdir(targetDirectory, { recursive: true });
	await Promise.all([
		writeFile(
			join(targetDirectory, "robots.txt"),
			`User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap.xml\n`,
		),
		writeFile(
			join(targetDirectory, "sitemap.xml"),
			`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`,
		),
		writeFile(
			join(targetDirectory, "site.webmanifest"),
			`${JSON.stringify(
				{
					name: config.name,
					short_name: config.name.slice(0, 24),
					icons: [
						{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
						{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
					],
					theme_color: "#0071e3",
					background_color: "#f5f5f7",
					display: "standalone",
				},
				null,
				2,
			)}\n`,
		),
		writeFile(join(targetDirectory, "favicon.svg"), iconSvg()),
		writeIcon(join(targetDirectory, "apple-touch-icon.png"), 180),
		writeIcon(join(targetDirectory, "icon-192.png"), 192),
		writeIcon(join(targetDirectory, "icon-512.png"), 512),
	]);

	const localOgImage = absoluteAssetPath(targetDirectory, config.ogImage);
	if (localOgImage) {
		await generateOg({
			description: config.description,
			output: localOgImage,
			siteName: config.name,
			title: config.name,
		});
	}

	return { config, publicDirectory: targetDirectory };
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
	generateSiteAssets({
		publicDirectory: getOption(process.argv.slice(2), "--public-dir", "public"),
	})
		.then(({ publicDirectory }) => console.log(`Generated site assets in ${publicDirectory}`))
		.catch((error) => {
			console.error(error.message);
			process.exitCode = 1;
		});
}
