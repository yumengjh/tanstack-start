# TanStack Start Starter Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing TanStack Start app into a reusable Apple-styled, bilingual, theme-aware, SSR SEO-ready starter template.

**Architecture:** Keep file-based TanStack Router routes and its native `head` API as the sole metadata renderer. Add a small `src/i18n` layer around `i18next`/`react-i18next`, a `src/config/site.ts` configuration boundary, and shared presentation components; routes obtain language from a pathless locale layout and generate page-specific head data through pure SEO helpers.

**Tech Stack:** React 19, TanStack Start/Router, TypeScript, Tailwind CSS 4, i18next, react-i18next, Vitest, Biome.

**Spec:** `docs/superpowers/specs/2026-08-19-tanstack-starter-template-design.md`

## Global Constraints

- Keep the current React, TanStack Start, Tailwind and Biome tooling; do not add Nuxt, Vue, UnoCSS, Oxlint or Oxfmt.
- Do not change the existing Biome configuration or its script names.
- Use `i18next` and `react-i18next`; all visible template text and accessibility labels live in translation resources.
- Use TanStack route `head` and `<HeadContent />` for SSR metadata. Do not add Helmet.
- Use generic `TanStack Start Template` placeholder branding and non-branded local OG assets.
- Support default Chinese routes and `/en` English routes, with equivalent paths between locales.
- Do not create git commits unless the user explicitly authorizes commits.

---

## File Structure

- `src/config/site.ts`: site-wide replaceable name, URL, author, social image and links.
- `src/i18n/index.ts`, `src/i18n/locales/{zh,en}.ts`, `src/i18n/routing.ts`: typed resources, i18next creation, locale parsing and URL conversion.
- `src/lib/seo.ts`: pure canonical URL, page meta and JSON-LD builders.
- `src/components/{LocaleProvider,LanguageToggle,Header,Footer,ThemeToggle}.tsx`: shared application shell controls.
- `src/routes/{__root,index,features,demo,en,index,en/features,en/demo,$404}.tsx`: localized pages and metadata entry points.
- `src/styles.css`: reference-project `--c-*` tokens plus responsive Apple-style primitives.
- `public/{og-default.png,robots.txt,sitemap.xml}`: generic social image and discoverability assets.
- `src/**/*.test.ts[x]`: unit coverage for i18n routing, SEO and theme helpers.
- `vitest.config.ts`, `README.md`, `package.json`: testing setup, documentation and scripts/dependencies.

### Task 1: Establish typed configuration, locale routing, and SEO primitives

**Files:**
- Create: `src/config/site.ts`
- Create: `src/i18n/locales/zh.ts`
- Create: `src/i18n/locales/en.ts`
- Create: `src/i18n/index.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/lib/seo.ts`
- Create: `src/i18n/routing.test.ts`
- Create: `src/lib/seo.test.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Interfaces:**
- Produces `siteConfig`, `Locale`, `localeFromPathname(pathname)`, `localizePath(pathname, locale)`, `createI18n(locale)`, `getPageSeo(input)` and `getWebPageSchema(input)`.
- Consumed by all localized routes and shared shell components.

- [ ] **Step 1: Add failing locale-routing tests**

```ts
import { describe, expect, it } from 'vitest'
import { localeFromPathname, localizePath } from './routing'

describe('locale routing', () => {
  it('uses Chinese without a prefix', () => {
    expect(localeFromPathname('/features')).toBe('zh')
    expect(localizePath('/features', 'zh')).toBe('/features')
  })

  it('uses an /en prefix for English', () => {
    expect(localeFromPathname('/en/demo')).toBe('en')
    expect(localizePath('/demo', 'en')).toBe('/en/demo')
  })
})
```

- [ ] **Step 2: Add failing SEO tests**

```ts
import { describe, expect, it } from 'vitest'
import { getPageSeo } from './seo'

it('creates absolute canonical and OG URLs', () => {
  const seo = getPageSeo({ path: '/en/features', title: 'Features', description: 'Template features' })
  expect(seo.canonicalUrl).toBe('https://example.com/en/features')
  expect(seo.meta).toContainEqual({ property: 'og:url', content: seo.canonicalUrl })
})
```

- [ ] **Step 3: Run targeted tests and confirm they fail because the modules do not exist**

Run: `pnpm vitest run src/i18n/routing.test.ts src/lib/seo.test.ts`

Expected: FAIL with module-resolution errors for `./routing` and `./seo`.

- [ ] **Step 4: Add dependencies and the minimal test command**

```json
{
  "scripts": { "test": "vitest run" },
  "dependencies": { "i18next": "^25.0.0", "react-i18next": "^16.0.0" },
  "devDependencies": { "vitest": "^4.0.0" }
}
```

Add a `vitest.config.ts` which imports `defineConfig` from `vitest/config` and sets `environment: 'node'`.

- [ ] **Step 5: Implement configuration and locale helpers**

```ts
export const appLocales = ['zh', 'en'] as const
export type Locale = (typeof appLocales)[number]

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh'
}

export function localizePath(pathname: string, locale: Locale) {
  const path = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  return locale === 'en' ? `/en${path === '/' ? '' : path}` : path
}
```

Define `siteConfig.url` as `https://example.com`, export in-memory Chinese and English resources with matching keys, and create per-render i18next instances using `resources`, `lng`, `fallbackLng: 'zh'` and `initImmediate: false`.

- [ ] **Step 6: Implement pure SEO helpers**

```ts
export function getPageSeo(input: PageSeoInput) {
  const canonicalUrl = new URL(input.path, `${siteConfig.url}/`).toString()
  return {
    canonicalUrl,
    meta: [
      { title: input.title },
      { name: 'description', content: input.description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }
}
```

Include canonical link data, keywords, `og:type`, `og:site_name`, `og:image`, Twitter title/description/image, author, robots, and a WebSite/WebPage JSON-LD script result.

- [ ] **Step 7: Run format, targeted tests, and type checking**

Run: `pnpm check && pnpm test -- src/i18n/routing.test.ts src/lib/seo.test.ts && pnpm build`

Expected: all commands exit 0.

### Task 2: Build the localized shell, theme tokens, and shared controls

**Files:**
- Create: `src/components/LocaleProvider.tsx`
- Create: `src/components/LanguageToggle.tsx`
- Create: `src/lib/theme.ts`
- Create: `src/lib/theme.test.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes `Locale`, `createI18n`, `localizePath`, `siteConfig`.
- Produces `LocaleProvider`, `useLocale`, `LanguageToggle`, `getResolvedTheme(mode, prefersDark)` and a tokenized global document shell.

- [ ] **Step 1: Add a failing theme resolution test**

```ts
import { expect, it } from 'vitest'
import { getResolvedTheme } from './theme'

it('uses the system preference for auto mode', () => {
  expect(getResolvedTheme('auto', true)).toBe('dark')
  expect(getResolvedTheme('auto', false)).toBe('light')
})
```

- [ ] **Step 2: Run the targeted theme test and confirm failure**

Run: `pnpm test -- src/lib/theme.test.ts`

Expected: FAIL with a missing `./theme` module.

- [ ] **Step 3: Implement the pure theme helper and update ThemeToggle**

```ts
export type ThemeMode = 'light' | 'dark' | 'auto'
export function getResolvedTheme(mode: ThemeMode, prefersDark: boolean) {
  return mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode
}
```

Use it from the existing three-state toggle, retain the `theme` localStorage key, and translate its title and aria label with `useTranslation()`.

- [ ] **Step 4: Implement LocaleProvider and language toggle**

`LocaleProvider` receives `locale` and wraps children in an `I18nextProvider` backed by a memoized per-locale i18n instance. `LanguageToggle` reads the browser pathname, calls `localizePath(pathname, otherLocale)`, and assigns `window.location.href` to the corresponding SSR URL. It displays `EN` on Chinese pages and `中文` on English pages.

- [ ] **Step 5: Replace the shell with the reference style**

In `src/styles.css`, replace the sea-themed tokens with the reference project’s `--c-bg`, `--c-text`, `--c-border`, `--c-primary`, `--ld-*` light/dark tokens and Apple button/card primitives. Keep Tailwind imports. Update `Header` and `Footer` to the shared 4xl-wide reference layout with translated nav, GitHub placeholder link, language control, theme toggle, privacy/terms placeholders, and generic site config branding.

- [ ] **Step 6: Integrate the root document**

Keep `HeadContent`, `Scripts`, and the pre-paint theme script. Change `<html lang>` to be derived from the locale layout or language attribute passed by the root shell, insert `LocaleProvider` around Header/children/Footer, and leave development tools enabled only as they are today.

- [ ] **Step 7: Run checks**

Run: `pnpm check && pnpm test -- src/lib/theme.test.ts && pnpm build`

Expected: all commands exit 0.

### Task 3: Implement localized routes, head metadata, and discoverability assets

**Files:**
- Create: `src/routes/features.tsx`
- Create: `src/routes/demo.tsx`
- Create: `src/routes/en/index.tsx`
- Create: `src/routes/en/features.tsx`
- Create: `src/routes/en/demo.tsx`
- Create: `src/routes/$404.tsx`
- Create: `src/components/HomePage.tsx`
- Create: `src/components/FeaturesPage.tsx`
- Create: `src/components/DemoPage.tsx`
- Create: `src/components/NotFoundPage.tsx`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Copy: `/Users/yaopinxin/project/GitHub/nuxt-start/public/og-default.png` to `public/og-default.png` after visually confirming it contains no YumGJS branding.
- Modify: `src/routes/index.tsx`
- Delete: `src/routes/about.tsx`
- Modify: `src/routeTree.gen.ts`

**Interfaces:**
- Consumes `useTranslation`, `getPageSeo`, `getWebPageSchema`, `siteConfig` and the shared shell.
- Produces public Chinese/English page routes with static SSR head metadata.

- [ ] **Step 1: Add route/head tests that initially fail**

```ts
import { expect, it } from 'vitest'
import { getPageSeo } from '../lib/seo'

it('has localized canonical addresses', () => {
  expect(getPageSeo({ path: '/en', title: 'Home', description: 'Home' }).canonicalUrl)
    .toBe('https://example.com/en')
})
```

Add a second test that reads `public/sitemap.xml` and expects `/`, `/features`, `/demo`, `/en`, `/en/features`, and `/en/demo`.

- [ ] **Step 2: Run new route tests and confirm the sitemap assertion fails**

Run: `pnpm test -- src/routes/seo-routes.test.ts`

Expected: FAIL because `public/sitemap.xml` does not exist.

- [ ] **Step 3: Create route-page components**

Implement page-only components so Chinese and English route files differ only in `locale`, URL path and route `head`. Recreate the reference homepage: centered badge, title, subtitle, two CTAs and two 300px feature cards. Implement a three-card features bento page and a counter/viewport demo using React `useState`, `useEffect`, and `window.innerWidth`. Render a translated 404 with a localized home `Link`.

- [ ] **Step 4: Add SEO head data to every public route**

Each file route calls `getPageSeo` in `head`, using a server-safe translation function obtained from `createI18n(locale).t`. Include its returned `meta`, canonical `links`, and JSON-LD script. Chinese route paths have no prefix; English paths start with `/en`.

- [ ] **Step 5: Add static discoverability files and asset**

Create `robots.txt` containing `User-agent: *`, `Allow: /`, and `Sitemap: https://example.com/sitemap.xml`. Create sitemap XML with six `loc` entries under `https://example.com`. Inspect the reference OG PNG before copying; only copy it if no visible YumGJS branding exists, otherwise create a neutral SVG-to-PNG-compatible local placeholder or point `siteConfig.ogImage` to `/og-default.svg`.

- [ ] **Step 6: Regenerate file routes and run all route tests**

Run: `pnpm generate-routes && pnpm test -- src/routes/seo-routes.test.ts && pnpm build`

Expected: route generation updates `src/routeTree.gen.ts`; tests and build exit 0.

### Task 4: Document the template and perform end-to-end verification

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify: `src/routeTree.gen.ts`

**Interfaces:**
- Consumes the finished application’s scripts, route shape, site configuration and assets.
- Produces setup instructions that let a new project owner safely customize the template.

- [ ] **Step 1: Update README usage instructions**

Document `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm check`, and `pnpm build`; list every value in `src/config/site.ts` a user must replace; explain route locale policy, where translations live, three theme modes, native route `head` SEO, and how to replace `public/og-default.*`.

- [ ] **Step 2: Add final scripts without changing Biome scripts**

Keep `format`, `lint`, and `check` unchanged. Ensure `test` runs `vitest run` and add `typecheck: "tsc --noEmit"` only if `tsc --noEmit` succeeds in this project.

- [ ] **Step 3: Run the full verification suite**

Run: `pnpm generate-routes && pnpm check && pnpm test && pnpm build`

Expected: all exit 0.

- [ ] **Step 4: Inspect production SSR metadata**

Run: `pnpm preview --host 127.0.0.1` and fetch `/` and `/en/features` with `curl`. Confirm returned HTML contains the localized `<title>`, a canonical link, `og:title`, `twitter:card`, JSON-LD, and Chinese/English page copy respectively. Stop the preview server afterward.

- [ ] **Step 5: Review uncommitted changes**

Run: `git status --short && git diff --check`

Expected: only template, test, documentation and generated route-tree changes are present; `git diff --check` exits 0. Do not stage or commit without explicit user authorization.
