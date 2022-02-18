import React, { FC, useEffect, useMemo, useState } from "react";
import { ContentType, DEFAULT_DOKI_THEME, DEFAULT_THEME_ID, DokiThemes } from "./DokiTheme";
import { pluginSettings } from "../Storage";
import { PluginEventTypes, ThemeSetEventPayload } from "../Events";
import {
  DokiThemeContext, FireFoxDokiTheme,
  ThemeContext
} from "./DokiThemeProvider";

export const ThemeContextContentScript = React.createContext<DokiThemeContext>({
  theme: new FireFoxDokiTheme(DEFAULT_DOKI_THEME, ContentType.PRIMARY),
  setTheme: (context: ThemeContext) => {},
  isInitialized: false,
});

const DokiThemeProviderContentScript: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<ContentType>(ContentType.PRIMARY);
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
      // todo: initialize content
    });

    const themeSetListener = (message: any) => {
      if (message.type === PluginEventTypes.THEME_SET) {
        const payload: ThemeSetEventPayload = message.payload;
        setThemeId(payload.themeId);
        setCurrentContent(payload.content);
      }
    };
    browser.runtime.onMessage.addListener(themeSetListener);
    return () => {
      browser.runtime.onMessage.removeListener(themeSetListener);
    };
  }, []);

  const themeContext = useMemo<DokiThemeContext>(
    () => ({
      setTheme,
      theme: new FireFoxDokiTheme(DokiThemes[themeId], currentContent),
      isInitialized: initialized,
    }),
    [themeId, initialized, currentContent]
  );

  return (
    <ThemeContextContentScript.Provider value={themeContext}>
      {children}
    </ThemeContextContentScript.Provider>
  );
};

export default DokiThemeProviderContentScript;
