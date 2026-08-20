import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../config/site";
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const locale = useLocale();
	const { t } = useTranslation();
	const homePath = locale === "en" ? "/en" : "/";
	const featuresPath = locale === "en" ? "/en/features" : "/features";
	const demoPath = locale === "en" ? "/en/demo" : "/demo";
	return (
		<header className="app-header">
			<nav className="app-nav">
				<Link to={homePath} className="brand-link">
					<span className="brand-mark" aria-hidden="true" />
					{siteConfig.name}
				</Link>
				<div className="nav-links">
					<Link to={featuresPath}>{t("app.nav.features")}</Link>
					<Link to={demoPath}>{t("app.nav.demo")}</Link>
					<a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
						{t("app.nav.github")}
					</a>
				</div>
				<div className="nav-controls">
					<LanguageToggle />
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
