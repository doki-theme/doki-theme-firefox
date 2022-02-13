import React, { FC, useMemo, useState } from "react";
import { DokiTheme } from "./DokiTheme";
import { DEFAULT_DOKI_THEME } from "../background/background";

export interface DokiThemeContext {
  theme: DokiTheme;
  setTheme: (themeId: string) => void;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: DEFAULT_DOKI_THEME,
  setTheme: (themeId: string) => {
  }
});

const DokiThemeProvider: FC = ({ children }) => {

  const [themeId, setThemeId] = useState<string>("e55e70ea-454b-47ef-9270-d46390dd2769");
  const setTheme = (newThemeId: string) => {
    // do stuff
    setThemeId(newThemeId);
  };

  const themeContext = useMemo<DokiThemeContext>(() => ({
    setTheme,
    theme: DEFAULT_DOKI_THEME
  }), [themeId]);


  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
