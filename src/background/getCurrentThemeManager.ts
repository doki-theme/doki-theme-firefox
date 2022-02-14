import { PluginMode, pluginSettings } from "../Storage";
import { DayNightThemeManager } from "./dayNightThemeManager";
import { MixedThemeManager } from "./mixedThemeManager";
import { SingleThemeManager } from "./singleThemeManager";
import { ThemeManager } from "./themeManager";

export async function getCurrentThemeManager<T>(): Promise<ThemeManager<T>> {
  const { currentMode } = await pluginSettings.getAll();
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
