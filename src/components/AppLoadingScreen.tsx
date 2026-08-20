import { type ComponentType, useEffect } from "react";

export type AppLoaderComponent = ComponentType;

type AppLoadingScreenProps = {
	Loader: AppLoaderComponent;
};

export function AppLoadingScreen({ Loader }: AppLoadingScreenProps) {
	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			window.dispatchEvent(new Event("app-ready"));
		});

		return () => window.cancelAnimationFrame(frame);
	}, []);

	return (
		<output
			id="app-loading-screen"
			className="app-loading-screen"
			aria-live="polite"
			aria-label="Loading"
		>
			<div className="app-loading-screen__content">
				<Loader />
			</div>
		</output>
	);
}

export function CircleLoader() {
	return (
		<div className="app-circle-loader" aria-hidden="true">
			<svg viewBox="25 25 50 50">
				<title>Loading</title>
				<circle r="20" cy="50" cx="50" />
			</svg>
		</div>
	);
}
