import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "../../components/DemoPage";
import { createI18n } from "../../i18n";
import { getPageSeo, getWebPageSchema } from "../../lib/seo";

const i18n = createI18n("en");
const title = i18n.t("seo.demo.title");
const description = i18n.t("seo.demo.description");

export const Route = createFileRoute("/en/demo")({
	head: () => ({
		...getPageSeo({
			path: "/en/demo",
			title,
			description,
			keywords: i18n.t("seo.demo.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({ path: "/en/demo", title, description }),
			},
		],
	}),
	component: DemoPage,
});
