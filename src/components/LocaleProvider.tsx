import { createContext, type ReactNode, useContext, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "../i18n";
import type { Locale } from "../i18n/routing";

const LocaleContext = createContext<Locale>("zh");

export function LocaleProvider({
	children,
	locale,
}: {
	children: ReactNode;
	locale: Locale;
}) {
	const i18n = useMemo(() => createI18n(locale), [locale]);
	return (
		<LocaleContext.Provider value={locale}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	return useContext(LocaleContext);
}
