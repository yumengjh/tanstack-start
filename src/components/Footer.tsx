import { useTranslation } from "react-i18next";
import { siteConfig } from "../config/site";

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="app-footer">
			<div className="app-footer-inner">
				<p>
					© {new Date().getFullYear()} {siteConfig.name}.{" "}
					{t("app.footer.rights")}
				</p>
				<div>
					<a href="#privacy">{t("app.footer.privacy")}</a>
					<a href="#terms">{t("app.footer.terms")}</a>
				</div>
			</div>
		</footer>
	);
}
