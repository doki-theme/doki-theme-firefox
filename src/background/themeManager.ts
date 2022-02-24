import { DEFAULT_DOKI_THEME, DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { themeExtensionIconInToolBar } from "./themedIcon";
import { pluginSettings } from "../Storage";
import {
  CurrentThemeSetEventPayload,
  PluginEvent,
  PluginEventTypes,
  ThemeSetEventPayload,
} from "../Events";

export abstract class ThemeManager {
  abstract handleMessage(message: any): Promise<void>;

  abstract handleTabCreation(message: any): Promise<void>;

  async initializeTheme(): Promise<void> {
    try {
      const { currentTheme } = await pluginSettings.getAll();
      await this.setTheme(DokiThemes[currentTheme] || DEFAULT_DOKI_THEME);
    } catch (e) {
      console.error("unable to initialize theme", e);
    }
  }

  async initializeFirefox() {
    await this.initialize();
    await this.initializeTheme();
    // todo: tell existing tabs their themes
  }

  async setTheme(dokiTheme: DokiTheme) {
    themeExtensionIconInToolBar(dokiTheme);
    browser.theme.update(dokiTheme.browserTheme);
    await pluginSettings.set({ currentTheme: dokiTheme.themeId });
    await this.dispatchCurrentThemeSet(dokiTheme);
  }

  private async dispatchCurrentThemeSet(dokiTheme: DokiTheme) {
    const currentThemeSetEvent: PluginEvent<CurrentThemeSetEventPayload> = {
      type: PluginEventTypes.CURRENT_THEME_UPDATED,
      payload: {
        themeDefinition: dokiTheme.dokiDefinition,
      },
    };
    const tabs = await browser.tabs.query({});
    try {
      await Promise.all(
        tabs.map((tab) =>
          browser.tabs
            .sendMessage(tab.id!!, currentThemeSetEvent)
            .catch((e) =>
              console.warn(
                `Unable to broadcast to tab ${tab.id}, that current theme was updated.`,
                e
              )
            )
        )
      );
    } catch (e) {
      console.warn(
        "Unable to broadcast to all tabs current theme was updated.",
        e
      );
    }
  }

  async initialize() {
    this.connect();
  }

  private _messageListener = this.handleContentScriptMessage.bind(this);
  private _tabCreationListener = this.handleTabCreation.bind(this);
  connect() {
    browser.runtime.onMessage.addListener(this._messageListener);
    browser.tabs.onCreated.addListener(this._tabCreationListener);
  }

  async handleContentScriptMessage(event: PluginEvent<any>) {
    if (event.type === PluginEventTypes.THEME_SET) {
      const payload = event.payload as ThemeSetEventPayload;
      await this.setTheme(DokiThemes[payload.themeId]);
    } else if (event.type === PluginEventTypes.CONTENT_SCRIPT_INJECTED) {
      const { currentTheme } = await pluginSettings.getAll();
      await this.dispatchCurrentThemeSet(DokiThemes[currentTheme]);
    }
    await this.handleMessage(event);
  }

  disconnect() {
    browser.runtime.onMessage.removeListener(this._messageListener);
    browser.tabs.onCreated.removeListener(this._tabCreationListener);
  }
}
