
import * as React from "react";
import { SessionProvider } from "next-auth/react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import "@/styles/global.css";

import { appConfig } from "@/config/app";
import { getSettings as getPersistedSettings } from "@/lib/settings";
import { Analytics } from "@/components/core/analytics";
import { EmotionCacheProvider } from "@/components/core/emotion-cache";
import { I18nProvider } from "@/components/core/i18n-provider";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { Rtl } from "@/components/core/rtl";
import { SettingsButton } from "@/components/core/settings/settings-button";
import { SettingsProvider } from "@/components/core/settings/settings-context";
import { ThemeProvider } from "@/components/core/theme-provider";
import { Toaster } from "@/components/core/toaster";
import SessionProviderClientComponent from "./_session_provider";



interface LayoutProps {
  children: React.ReactNode;
  pageProps: {
    session?: any; // The session prop is passed here
  };
}

export default async function Layout({ children, pageProps }: LayoutProps): Promise<React.JSX.Element> {
	const settings = await getPersistedSettings();
	const direction = settings.direction ?? appConfig.direction;
	const language = settings.language ?? appConfig.language;

	return (
		<html dir={direction} lang={language} suppressHydrationWarning>
			<body>
				<InitColorSchemeScript attribute="class" />
					<Analytics>
						<LocalizationProvider>
							<SettingsProvider settings={settings}>
								<I18nProvider lng={language}>
									<EmotionCacheProvider options={{ key: "mui" }}>
										<Rtl direction={direction}>
										    <SessionProviderClientComponent session={pageProps && pageProps.session || null}>
												<ThemeProvider>
													{children}
													<SettingsButton />
													<Toaster position="bottom-right" />
												</ThemeProvider>
											</SessionProviderClientComponent>
										</Rtl>
									</EmotionCacheProvider>
								</I18nProvider>
							</SettingsProvider>
						</LocalizationProvider>
					</Analytics>
			</body>
		</html>
	);
}
