import React, { FC, useMemo, useState } from "react";
import { ContentType, DokiTheme, DokiThemes } from "./DokiTheme";
import { DEFAULT_DOKI_THEME } from "../background/background";

interface ThemeContext {
  selectedTheme: DokiTheme;
  contentType: ContentType;
}

export interface DokiThemeContext {
  theme: DokiTheme;
  setTheme: (context: ThemeContext) => void;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: DEFAULT_DOKI_THEME,
  setTheme: (context: ThemeContext) => {
  }
});

const DokiThemeProvider: FC = ({ children }) => {

  const [themeId, setThemeId] = useState<string>("e55e70ea-454b-47ef-9270-d46390dd2769");
  const setTheme = (context: ThemeContext) => {
    // do stuff
    setThemeId(context.selectedTheme.themeId);
  };

  const themeContext = useMemo<DokiThemeContext>(() => ({
    setTheme,
    theme: DokiThemes[themeId]
  }), [themeId]);


  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
