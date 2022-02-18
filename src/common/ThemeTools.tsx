import React, { FC, useEffect } from "react";
import { ContentType, DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { sample } from "lodash";

export const ThemeStuff: FC<{ theme: DokiTheme }> = ({ theme }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--base-background", theme.colors.baseBackground);
    document.documentElement.style.setProperty("--highlight-color", theme.colors.highlightColor);
    document.documentElement.style.setProperty("--accent-color", theme.colors.accentColor);
  }, [theme]);
  return <></>;
};

export function chooseRandomTheme(): {
  dokiTheme: DokiTheme,
  contentType: ContentType,
} {
  const dokiTheme = sample(DokiThemes)!!;
  const contentType = dokiTheme.hasSecondaryContent ?
    sample([ContentType.SECONDARY, ContentType.PRIMARY])!! : ContentType.PRIMARY
  return {
    dokiTheme,
    contentType
  }
}
