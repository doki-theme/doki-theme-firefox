import { ThemeManager } from "./themeManager";
import { ContentType, DEFAULT_DOKI_THEME, DokiTheme } from "../themes/DokiTheme";
import { pluginSettings } from "../Storage";
import { PluginEvent, PluginEventTypes, ThemeSetEventPayload } from "../Events";

export class SingleThemeManager extends ThemeManager {
  async handleTabCreation({ tabId }: any): Promise<void> {
    if (!(this.currentTheme && this.currentContentType)) return;
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: this.currentTheme.themeId,
        content: this.currentContentType
      }
    };
    await browser.tabs.sendMessage(tabId, themeSetEvent);
  }

  async handleMessage(message: any): Promise<void> {
    if (message.type !== PluginEventTypes.THEME_SET) return;

    const messagePayload: ThemeSetEventPayload = message.payload;
    this.currentContentType = messagePayload.content;
    try {
      const tabs = await browser.tabs.query({ title: "New Tab" });
      await Promise.all(
        tabs.map(
          tab => browser.tabs.sendMessage(tab.id!!, message)
        )
      );
    } catch (e) {
      console.error("unable to set theme", e);
    }
  }

  private currentTheme: DokiTheme | undefined;
  private currentContentType: ContentType | undefined;

  async setTheme(dokiTheme: DokiTheme) {
    await super.setTheme(dokiTheme);
    this.currentTheme = dokiTheme;
    await pluginSettings.set({ singleModeTheme: dokiTheme.themeId });
  }
}
