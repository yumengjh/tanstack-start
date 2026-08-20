import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../config/site";
import { useLocale } from "./LocaleProvider";

export function HomePage() {
	const { t } = useTranslation();
	const locale = useLocale();
	const featuresPath = locale === "en" ? "/en/features" : "/features";
	const demoPath = locale === "en" ? "/en/demo" : "/demo";
	return (
		<main className="template-page">
			<section className="page-content text-center">
				<span className="apple-label">{t("home.badge")}</span>
				<h1 className="apple-title-large mt-4 max-w-3xl mx-auto">
					{t("home.title")}
				</h1>
				<p className="apple-body max-w-2xl mx-auto mt-6">
					{t("home.description")}
				</p>
				<div className="flex justify-center items-center gap-6 mt-10">
					<Link to={featuresPath} className="apple-button-primary">
						{t("home.start")}
					</Link>
					<a
						href={siteConfig.githubUrl}
						target="_blank"
						rel="noreferrer"
						className="apple-button-link"
					>
						{t("home.github")} →
					</a>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-24">
					<Link
						to={featuresPath}
						className="apple-card p-10 text-left h-[300px] no-underline flex flex-col"
					>
						<span className="apple-label">{t("app.nav.features")}</span>
						<h2 className="text-2xl font-bold tracking-tight mt-3">
							{t("home.featuresCard.title")}
						</h2>
						<p className="text-sm leading-relaxed text-[var(--c-text-2)] mt-4">
							{t("home.featuresCard.description")}
						</p>
						<span className="apple-button-link mt-auto">
							{t("home.start")} →
						</span>
					</Link>
					<Link
						to={demoPath}
						className="apple-card p-10 text-left h-[300px] no-underline flex flex-col"
					>
						<span className="apple-label">{t("app.nav.demo")}</span>
						<h2 className="text-2xl font-bold tracking-tight mt-3">
							{t("home.demoCard.title")}
						</h2>
						<p className="text-sm leading-relaxed text-[var(--c-text-2)] mt-4">
							{t("home.demoCard.description")}
						</p>
						<span className="apple-button-link mt-auto">
							{t("app.nav.demo")} →
						</span>
					</Link>
				</div>
			</section>
		</main>
	);
}
