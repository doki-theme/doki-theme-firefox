import { ThemeManager } from "./themeManager";
import { DEFAULT_DOKI_THEME, DokiTheme } from "../themes/DokiTheme";
import { pluginSettings } from "../Storage";
import { ThemeSetEventPayload } from "../Events";

export class SingleThemeManager extends ThemeManager {

  async initializeTheme(): Promise<void> {
    await this.setTheme(DEFAULT_DOKI_THEME);
  }

  handleMessage(message: ThemeSetEventPayload): void {
  }


  async setTheme(dokiTheme: DokiTheme) {
    await super.setTheme(dokiTheme);
    await pluginSettings.set({singleModeTheme: dokiTheme.themeId})
  }
}
