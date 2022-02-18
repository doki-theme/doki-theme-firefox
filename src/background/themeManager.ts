import { DEFAULT_DOKI_THEME, DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { themeExtensionIconInToolBar } from "./themedIcon";
import { pluginSettings } from "../Storage";
import { PluginEventTypes, ThemeSetEventPayload } from "../Events";

export abstract class ThemeManager {

  abstract handleMessage(message: any): Promise<void>

  abstract handleTabCreation(message: any): Promise<void>

  async initializeTheme(): Promise<void> {
    try {
      const { currentTheme } = await pluginSettings.getAll();
      await this.setTheme(DokiThemes[currentTheme] || DEFAULT_DOKI_THEME);
    } catch (e) {
      console.error("unable to initialize theme", e);
    }
  }

  async initializeFirefox() {
    this.connect();
    await this.initializeTheme();
  }

  async setTheme(dokiTheme: DokiTheme) {
    themeExtensionIconInToolBar(dokiTheme);
    browser.theme.update(dokiTheme.browserTheme);
    await pluginSettings.set({ currentTheme: dokiTheme.themeId });
  }

  async initialize() {
    this.connect();
  }

  connect() {
    browser.runtime.onMessage.addListener(this.handleContentScriptMessage.bind(this));
    browser.tabs.onCreated.addListener(this.handleTabCreation.bind(this));
  }

  async handleContentScriptMessage(event: any) {
    if (event.type === PluginEventTypes.THEME_SET) {
      const payload = event.payload as ThemeSetEventPayload;
      await this.setTheme(DokiThemes[payload.themeId]);
    }
    await this.handleMessage(event);
  }

  disconnect() {
    browser.runtime.onMessage.removeListener(this.handleContentScriptMessage);
    browser.tabs.onCreated.removeListener(this.handleTabCreation.bind(this));
  }
}
