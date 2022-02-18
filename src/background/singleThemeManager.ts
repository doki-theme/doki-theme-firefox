import { ThemeManager } from "./themeManager";
import { ContentType, DokiTheme } from "../themes/DokiTheme";
import { pluginSettings } from "../Storage";
import {
  PluginEvent,
  PluginEventTypes,
  TabAttachedEventPayload,
  ThemeSetEventPayload,
} from "../Events";

export class SingleThemeManager extends ThemeManager {
  async initialize(): Promise<void> {
    await super.initialize();
    const { currentContentType } = await pluginSettings.getAll();
    this.currentContentType = currentContentType;
  }

  async handleTabCreation({ tabId }: any): Promise<void> {
    // todo: no-op
  }

  private async tellTabItsTheme(tabId: number) {
    if (
      this.currentTheme === undefined ||
      this.currentContentType === undefined
    ){
      return;
    }
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: this.currentTheme.themeId,
        content: this.currentContentType,
      },
    };
    await browser.tabs.sendMessage(tabId, themeSetEvent);
  }

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.TAB_ATTACHED) {
      const tabAttachMentPayload: TabAttachedEventPayload = message.payload;
      await this.tellTabItsTheme(tabAttachMentPayload.tabId);
    } else if (message.type === PluginEventTypes.THEME_SET) {
      await this.tellAllTabsTheirNewTheme(message);
    }
  }

  private async tellAllTabsTheirNewTheme(message: PluginEvent<any>) {
    const messagePayload: ThemeSetEventPayload = message.payload;
    this.currentContentType = messagePayload.content;
    try {
      const tabs = await browser.tabs.query({ title: "New Tab" });
      await Promise.all(
        tabs.map((tab) => browser.tabs.sendMessage(tab.id!!, message))
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
