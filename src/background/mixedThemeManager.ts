import { ThemeManager } from "./themeManager";

export class MixedThemeManager extends ThemeManager {
  initializeTheme(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async handleMessage(message: any): Promise<void> {
  }

}
