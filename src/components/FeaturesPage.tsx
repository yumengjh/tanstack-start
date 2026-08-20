import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLocale } from "./LocaleProvider";

const featureIndexes = [0, 1, 2] as const;

export function FeaturesPage() {
	const { t } = useTranslation();
	const locale = useLocale();
	return (
		<main className="template-page">
			<section className="page-content">
				<Link to={locale === "en" ? "/en" : "/"} className="apple-button-link">
					← {t("app.backHome")}
				</Link>
				<div className="mt-12">
					<span className="apple-label">{t("features.eyebrow")}</span>
					<h1 className="apple-title-large mt-3">{t("features.title")}</h1>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
					{featureIndexes.map((index) => (
						<article className="apple-card p-8" key={index}>
							<div className="w-10 h-10 rounded-xl bg-[var(--c-bg-2)] flex items-center justify-center mb-6 text-lg">
								✦
							</div>
							<h2 className="text-lg font-bold">
								{t(`features.items.${index}.title`)}
							</h2>
							<p className="text-sm leading-relaxed text-[var(--c-text-2)] mt-3">
								{t(`features.items.${index}.description`)}
							</p>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}
