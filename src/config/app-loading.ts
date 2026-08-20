import {
	type AppLoaderComponent,
	CircleLoader,
} from "../components/AppLoadingScreen";
import { siteConfig } from "./site";

export interface AppLoadingConfig {
	delayMs: number;
	enabled: boolean;
	Loader: AppLoaderComponent;
}

export const appLoadingScreen: AppLoadingConfig = {
	delayMs: siteConfig.loadingScreenDelayMs,
	enabled: siteConfig.loadingScreen,
	Loader: CircleLoader,
};

export const appNavigationProgress = {
	delayMs: siteConfig.navigationProgressDelayMs,
	enabled: siteConfig.navigationProgress,
} as const;
