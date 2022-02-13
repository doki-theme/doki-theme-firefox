import { DokiTheme } from "../themes/DokiTheme";
import { DEFAULT_DOKI_THEME } from "./background";
import { PluginMode, pluginSettings } from "../Storage";

export abstract class ThemeManager {

  abstract initializeFirefox(): Promise<void>;

  setTheme(dokiTheme: DokiTheme) {
    browser.theme.update(dokiTheme.browserTheme);
  }
}

export class SingleThemeManager extends ThemeManager {
  initializeFirefox(): Promise<void> {
    this.setTheme(DEFAULT_DOKI_THEME)
    return Promise.resolve(undefined);
  }
}

export class MixedThemeManager extends ThemeManager {
  initializeFirefox(): Promise<void> {
    return Promise.resolve(undefined);
  }

}

export class DayNightThemeManager extends ThemeManager {
  initializeFirefox(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export async function getCurrentThemeManager(): Promise<ThemeManager> {
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
