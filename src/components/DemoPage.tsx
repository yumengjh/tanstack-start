import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "./LocaleProvider";

export function DemoPage() {
	const { t } = useTranslation();
	const locale = useLocale();
	const [count, setCount] = useState(0);
	const [width, setWidth] = useState<number | null>(null);
	useEffect(() => {
		const update = () => setWidth(window.innerWidth);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);
	return (
		<main className="template-page">
			<section className="page-content max-w-lg">
				<Link to={locale === "en" ? "/en" : "/"} className="apple-button-link">
					← {t("app.backHome")}
				</Link>
				<div className="text-center mt-12">
					<span className="apple-label">{t("demo.eyebrow")}</span>
					<h1 className="apple-title-medium mt-3">{t("demo.title")}</h1>
				</div>
				<div className="apple-card p-8 mt-10">
					<div className="text-center py-6">
						<p className="text-7xl font-bold tracking-tight tabular-nums m-0">
							{count}
						</p>
						<p className="text-sm text-[var(--c-text-2)] mt-3">
							{t("demo.double")}:{" "}
							<strong className="text-[var(--c-text)]">{count * 2}</strong>
						</p>
					</div>
					<div className="flex gap-4 mt-4">
						<button
							type="button"
							className="apple-button flex-1 text-xl"
							aria-label={t("demo.decrease")}
							onClick={() => setCount((value) => value - 1)}
						>
							−
						</button>
						<button
							type="button"
							className="apple-button-primary flex-1 text-xl"
							aria-label={t("demo.increase")}
							onClick={() => setCount((value) => value + 1)}
						>
							+
						</button>
					</div>
					<div className="flex justify-between text-xs text-[var(--c-text-2)] mt-8 pt-6 border-t border-[var(--c-border)]">
						<span>{t("demo.viewport")}</span>
						<span className="font-mono font-semibold text-[var(--c-text)]">
							{width === null ? "…" : `${width}px`}
						</span>
					</div>
				</div>
			</section>
		</main>
	);
}
