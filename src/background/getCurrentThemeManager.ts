import { PluginMode, pluginSettings } from "../Storage";
import { DayNightThemeManager } from "./dayNightThemeManager";
import { MixedThemeManager } from "./mixedThemeManager";
import { SingleThemeManager } from "./singleThemeManager";
import { ThemeManager } from "./themeManager";

export function getThemeManager(currentMode: PluginMode) {
  switch (currentMode) {
    case PluginMode.DAY_NIGHT:
      return new DayNightThemeManager();
    case PluginMode.MIXED:
      return new MixedThemeManager();
    case PluginMode.SINGLE:
    default:
      return new SingleThemeManager();
  }
}

export async function getCurrentThemeManager(): Promise<ThemeManager> {
  const { currentMode } = await pluginSettings.getAll();
  return getThemeManager(currentMode);
}
