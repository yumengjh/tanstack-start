import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLocale } from "./LocaleProvider";

export function NotFoundPage() {
	const { t } = useTranslation();
	const locale = useLocale();
	return (
		<main className="template-page">
			<section className="page-content text-center">
				<span className="apple-label">404</span>
				<h1 className="apple-title-large mt-3">{t("notFound.title")}</h1>
				<p className="apple-body mt-5">{t("notFound.description")}</p>
				<Link
					to={locale === "en" ? "/en" : "/"}
					className="apple-button-primary mt-8"
				>
					{t("app.backHome")}
				</Link>
			</section>
		</main>
	);
}
