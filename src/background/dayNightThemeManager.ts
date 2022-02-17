import { ThemeManager } from "./themeManager";

export class DayNightThemeManager extends ThemeManager {
  initializeTheme(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async handleMessage(message: any): Promise<void> {
  }

}
