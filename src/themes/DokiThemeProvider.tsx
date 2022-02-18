import React, { FC, useEffect, useMemo, useState } from "react";
import { ContentType, DEFAULT_DOKI_THEME, DEFAULT_THEME_ID, DokiTheme, DokiThemes } from "./DokiTheme";
import { pluginSettings } from "../Storage";
import { PluginEvent, PluginEventTypes, ThemeSetEventPayload } from "../Events";

export class FireFoxDokiTheme extends DokiTheme {

  constructor(
    readonly dokiTheme: DokiTheme,
    readonly activeContent: ContentType
  ) {
    super(dokiTheme.dokiDefinition);
  }

  public get content(): any { // todo: typed
    return this.activeContent === ContentType.SECONDARY ?
      this.secondaryContent : this.defaultContent;
  }
}

export interface ThemeContext {
  selectedTheme: DokiTheme;
  contentType: ContentType;
}

export interface DokiThemeContext {
  theme: FireFoxDokiTheme;
  setTheme: (context: ThemeContext) => void;
  isInitialized: boolean;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: new FireFoxDokiTheme(DEFAULT_DOKI_THEME, ContentType.PRIMARY),
  setTheme: (context: ThemeContext) => {
  },
  isInitialized: false
});

const DokiThemeProvider: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [currentContent, setCurrentContent] = useState<ContentType>(ContentType.PRIMARY);
  const [initialized, setInitialized] = useState<boolean>(false);
  const setTheme = (context: ThemeContext) => {
    const nextTheme = context.selectedTheme.themeId;
    setThemeId(nextTheme);
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: nextTheme,
        content: context.contentType
      }
    };
    setCurrentContent(context.contentType);
    browser.runtime.sendMessage(themeSetEvent);
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
      theme: new FireFoxDokiTheme(
        DokiThemes[themeId],
        currentContent
      ),
      isInitialized: initialized
    }),
    [themeId, initialized, currentContent]
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
