import React, { FC, useEffect, useMemo, useState } from "react";
import { DEFAULT_DOKI_THEME, DEFAULT_THEME_ID, DokiThemes } from "./DokiTheme";
import { pluginSettings } from "../Storage";
import { PluginEventTypes, ThemeSetEventPayload } from "../Events";
import {
  defaultFeatures,
  DokiThemeContext, PluginFeatures,
  ThemeContext
} from "./DokiThemeProvider";

export const ThemeContextContentScript = React.createContext<DokiThemeContext>({
  theme: DEFAULT_DOKI_THEME,
  setTheme: (context: ThemeContext) => {},
  features: defaultFeatures,
  isInitialized: false,
});

const DokiThemeProviderContentScript: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [features, setFeatures] = useState<PluginFeatures>(defaultFeatures);
  const setTheme = (context: ThemeContext) => {
    // no-op
  };

  useEffect(() => {
    pluginSettings.getAll().then((setting) => {
      const currentTheme = setting.currentTheme;
      if (currentTheme) {
        setThemeId(currentTheme);
      }
      setInitialized(true);
    });

    const themeSetListener = (message: any) => {
      console.log("heard message", message);
      if (message.type === PluginEventTypes.THEME_SET) {
        const payload: ThemeSetEventPayload = message.payload;
        setThemeId(payload.themeId);
      }
    };
    browser.runtime.onMessage.addListener(themeSetListener);
    return () => {
      browser.runtime.onMessage.removeListener(themeSetListener);
    };
  }, []);

  const themeContext = useMemo<DokiThemeContext>(
    () => ({
      features,
      setTheme,
      theme: DokiThemes[themeId],
      isInitialized: initialized,
    }),
    [themeId, initialized]
  );

  return (
    <ThemeContextContentScript.Provider value={themeContext}>
      {children}
    </ThemeContextContentScript.Provider>
  );
};

export default DokiThemeProviderContentScript;
