import React, { FC, useEffect } from "react";
import { DokiTheme } from "../themes/DokiTheme";

export const ThemeStuff: FC<{ theme: DokiTheme }> = ({ theme }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--base-background", theme.colors.baseBackground);
  }, [theme]);
  return <></>;
};
