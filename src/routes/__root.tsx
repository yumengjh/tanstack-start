import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AppLoadingScreen } from "../components/AppLoadingScreen";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { LocaleProvider } from "../components/LocaleProvider";
import { NavigationProgress } from "../components/NavigationProgress";
import { NotFoundPage } from "../components/NotFoundPage";
import { appLoadingScreen, appNavigationProgress } from "../config/app-loading";
import { siteConfig } from "../config/site";
import { localeFromPathname } from "../i18n/routing";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
function getAppLoadingFallbackScript(delayMs: number) {
	return `(function(){var root=document.documentElement;var finished=false;var reveal=window.setTimeout(function(){root.dataset.appLoadingVisible='true'},${delayMs});var done=function(){if(finished)return;finished=true;window.clearTimeout(reveal);root.dataset.appReady='true';root.removeAttribute('data-app-loading-visible');window.removeEventListener('app-ready',done)};window.addEventListener('app-ready',done,{once:true});window.setTimeout(done,8000);window.addEventListener('load',function(){window.setTimeout(done,1500)},{once:true})})();`;
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: siteConfig.name,
			},
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const locale = localeFromPathname(pathname);

	return (
		<html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
			<head>
				<script>{THEME_INIT_SCRIPT}</script>
				<HeadContent />
			</head>
			<body className="font-sans antialiased">
				{appLoadingScreen.enabled ? (
					<>
						<AppLoadingScreen Loader={appLoadingScreen.Loader} />
						<script>
							{getAppLoadingFallbackScript(appLoadingScreen.delayMs)}
						</script>
						<noscript>
							<style>{"#app-loading-screen{display:none}"}</style>
						</noscript>
					</>
				) : null}
				{appNavigationProgress.enabled ? (
					<NavigationProgress delayMs={appNavigationProgress.delayMs} />
				) : null}
				<LocaleProvider locale={locale}>
					<Header />
					{children}
					<Footer />
				</LocaleProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
