import React, { FC, useEffect, useMemo, useState } from "react";
import { ContentType, DEFAULT_DOKI_THEME, DEFAULT_THEME_ID, DokiTheme, DokiThemes } from "./DokiTheme";
import { pluginSettings } from "../Storage";
import { PluginEvent, PluginEventTypes, ThemeSetEventPayload } from "../Events";

export interface PluginFeatures {
  showWidget: boolean;
}

export interface ThemeContext {
  selectedTheme: DokiTheme;
  contentType: ContentType;
  features: PluginFeatures;
}

export interface DokiThemeContext {
  theme: DokiTheme;
  setTheme: (context: ThemeContext) => void;
  isInitialized: boolean;
  features: PluginFeatures;
}

export const defaultFeatures = {
  showWidget: true
};

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: DEFAULT_DOKI_THEME,
  setTheme: (context: ThemeContext) => {
  },
  isInitialized: false,
  features: defaultFeatures
});

const DokiThemeProvider: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [features, setFeatures] = useState<PluginFeatures>(defaultFeatures);
  const setTheme = (context: ThemeContext) => {
    const nextTheme = context.selectedTheme.themeId;
    setThemeId(nextTheme);
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: nextTheme,
      }
    }
    setFeatures(context.features);

    browser.runtime.sendMessage(themeSetEvent)
  };

  useEffect(() => {
    pluginSettings.getAll().then((setting) => {
      const currentTheme = setting.currentTheme;
      if (currentTheme) {
        setThemeId(currentTheme);
      }
      setInitialized(true);
    });
  }, []);

  const themeContext = useMemo<DokiThemeContext>(
    () => ({
      setTheme,
      theme: DokiThemes[themeId],
      isInitialized: initialized,
      features,
    }),
    [themeId, initialized, features]
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
