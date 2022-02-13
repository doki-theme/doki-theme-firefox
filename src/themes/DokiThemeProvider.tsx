import React, { FC, useMemo, useState } from "react";
import { DokiTheme, ThemeManagerService } from "./DokiTheme";

export interface DokiThemeContext {
  theme: DokiTheme;
  setTheme: (themeId: string) => void;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: ThemeManagerService.getDefaultTheme(),
  setTheme: (themeId: string) => {
  }
});

const DokiThemeProvider: FC = ({ children }) => {

  const [themeId, setThemeId] = useState<string>(ThemeManagerService.getCurrentThemeId());
  const setTheme = (newThemeId: string) => {
    // do stuff
    setThemeId(newThemeId);
  };

  const themeContext = useMemo<DokiThemeContext>(() => ({
    setTheme,
    theme: ThemeManagerService.getThemeById(themeId)
  }), [themeId]);


  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;
