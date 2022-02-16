import { ThemeManager } from "./themeManager";
import { DEFAULT_DOKI_THEME, DokiTheme } from "../themes/DokiTheme";
import { pluginSettings } from "../Storage";

export class SingleThemeManager extends ThemeManager {

  async initializeTheme(): Promise<void> {
    await this.setTheme(DEFAULT_DOKI_THEME);
  }

  async handleMessage(message: any): Promise<void> {
    try {

    const tabs = await browser.tabs.query({title: "New Tab"});
    await Promise.all(
      tabs.map(
        tab => browser.tabs.sendMessage(tab.id!!, message)
      )
    )
    } catch (e) {
      console.error("unable to set theme", e);
    }
  }


  async setTheme(dokiTheme: DokiTheme) {
    await super.setTheme(dokiTheme);
    await pluginSettings.set({singleModeTheme: dokiTheme.themeId})
  }
}
