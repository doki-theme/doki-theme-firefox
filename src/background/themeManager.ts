import { DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { themeExtensionIconInToolBar } from "./themedIcon";
import { pluginSettings } from "../Storage";
import { PluginEventTypes, ThemeSetEventPayload } from "../Events";

export abstract class ThemeManager {

  abstract initializeTheme(): Promise<void>;

  abstract handleMessage(message: any): Promise<void>

  async initializeFirefox() {
    this.connect()
    await this.initializeTheme()
  }

  async setTheme(dokiTheme: DokiTheme) {
    themeExtensionIconInToolBar(dokiTheme);
    browser.theme.update(dokiTheme.browserTheme);
    await pluginSettings.set({currentTheme: dokiTheme.themeId})
  }

  connect() {
    browser.runtime.onMessage.addListener(this.dispatchMessage.bind(this))
  }

  async dispatchMessage(event: any) {
    if(event.type === PluginEventTypes.THEME_SET) {
      const payload = event.payload as ThemeSetEventPayload
      await this.setTheme(DokiThemes[payload.themeId])
    }
    await this.handleMessage(event)
  }

  disconnect() {
    browser.runtime.onMessage.removeListener(this.dispatchMessage)
  }
}
