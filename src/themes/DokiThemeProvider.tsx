import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ContentType,
  DEFAULT_DOKI_THEME,
  DEFAULT_THEME_ID,
  DokiTheme,
  DokiThemes
} from "./DokiTheme";
import { pluginSettings } from "../Storage";

interface ThemeContext {
  selectedTheme: DokiTheme;
  contentType: ContentType;
}

export interface DokiThemeContext {
  theme: DokiTheme;
  setTheme: (context: ThemeContext) => void;
  isInitialized: boolean;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: DEFAULT_DOKI_THEME,
  setTheme: (context: ThemeContext) => {
  },
  isInitialized: false
});

const DokiThemeProvider: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [initialized, setInitialized] = useState<boolean>(false);
  const setTheme = (context: ThemeContext) => {
    // do stuff
    setThemeId(context.selectedTheme.themeId);
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
      isInitialized: initialized
    }),
    [themeId, initialized]
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
