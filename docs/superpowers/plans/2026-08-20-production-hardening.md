# Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production-grade configuration, assets, security, runtime checks, E2E coverage and CI to the TanStack Start template.

**Architecture:** Public Vite variables feed one site configuration module and build-time Node generators. Nitro `routeRules` owns response headers and the health endpoint is a Nitro server route; Playwright exercises the built Node output rather than the development server.

**Tech Stack:** TanStack Start, Nitro, Node.js ESM, @resvg/resvg-js, Playwright, Vitest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-20-production-hardening-design.md`

## Global Constraints

- Use only `VITE_SITE_*` values for client-visible configuration; do not add secrets.
- Keep CSP in Report-Only mode and retain the current theme initialization behavior.
- Do not add authentication, API clients, state management or observability.
- Do not create a git commit without explicit authorization.

---

### Task 1: Public configuration and branded static assets

**Files:** Create `.env.example`, `scripts/generate-og.mjs`, `scripts/generate-site-files.mjs`, `public/site.webmanifest`; modify `src/config/site.ts`, `src/lib/seo.ts`, `src/routes/__root.tsx`, `package.json`, `README.md`.

- [ ] Add failing Vitest cases for public URL normalization, OG command argument validation and generated sitemap entries.
- [ ] Add `@resvg/resvg-js`, write the two ESM generators, and generate generic PNG/favicon/manifest/sitemap/robots assets from `.env.example` defaults.
- [ ] Use generated PNG metadata and root links; add canonical locale alternate links.
- [ ] Run focused tests, Biome, typecheck and build.

### Task 2: Nitro security and health contract

**Files:** Create `server/routes/health.get.ts`, `src/lib/security.ts`, tests; modify `vite.config.ts`, `package.json`, README.

- [ ] Add failing unit tests for production/development security header sets and source-level health contract.
- [ ] Configure Nitro `routeRules` with the shared headers and production-only HSTS; implement health route and start script.
- [ ] Run focused tests and launch built output to assert `/health` plus headers.

### Task 3: Runtime SEO and browser regression coverage

**Files:** Create `playwright.config.ts`, `e2e/template.spec.ts`; modify 404 and SEO route helpers; add Playwright package/scripts.

- [ ] Add a failing browser test for canonical/hreflang, language navigation, 404 noindex, health and headers.
- [ ] Add noindex head data to the root not-found route and configure Playwright to build then serve on an isolated port.
- [ ] Install Chromium only when running E2E, execute the suite, and retain failure artifacts only through ignored output paths.

### Task 4: Deterministic dependencies and CI

**Files:** Create `.github/workflows/ci.yml`, `.github/dependabot.yml`, `pnpm-workspace.yaml`, `LICENSE`; modify package metadata, `.gitignore`, README.

- [ ] Pin the currently lockfile-resolved TanStack packages, declare Node/pnpm versions and move pnpm build allowlist to workspace configuration.
- [ ] Add CI executing route generation, check, typecheck, unit test, build and E2E; add Dependabot for npm and Actions.
- [ ] Run the complete local verification sequence and inspect the final git diff.
