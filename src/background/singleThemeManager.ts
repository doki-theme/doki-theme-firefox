import { ThemeManager } from "./themeManager";
import {
  ContentType,
  DEFAULT_DOKI_THEME,
  DokiTheme,
  DokiThemes,
} from "../themes/DokiTheme";
import { pluginSettings } from "../Storage";
import {
  PluginEvent,
  PluginEventTypes,
  TabAttachedEventPayload,
  ThemeSetEventPayload,
} from "../Events";

export type ThemeStuff = {
  themeId: string | undefined;
  content: ContentType | undefined;
};

export class SingleThemeManager extends ThemeManager {
  async initialize(): Promise<void> {
    await super.initialize();
    const { currentContentType, currentTheme } = await pluginSettings.getAll();
    this.currentContentType = currentContentType;
    this.currentTheme = DokiThemes[currentTheme] || DEFAULT_DOKI_THEME
  }

  async initializeTheme(): Promise<void> {
    try {
      const { themeId } = this.getCurrentThemeAndContentType();
      await this.setTheme(DokiThemes[themeId!!] || DEFAULT_DOKI_THEME);
    } catch (e) {
      console.error("unable to initialize theme", e);
    }
  }

  async handleTabCreation({ tabId }: any): Promise<void> {
    // todo: no-op
  }

  protected getCurrentThemeAndContentType(): ThemeStuff {
    return {
      themeId: this.currentTheme?.themeId,
      content: this.currentContentType,
    };
  }

  private async tellTabItsTheme(tabId: number) {
    const { content, themeId } = this.getCurrentThemeAndContentType();
    if (themeId === undefined || content === undefined) {
      return;
    }
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        content,
        themeId: themeId,
      },
    };
    await browser.tabs.sendMessage(tabId, themeSetEvent);
  }

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.TAB_ATTACHED) {
      const tabAttachMentPayload: TabAttachedEventPayload = message.payload;
      await this.tellTabItsTheme(tabAttachMentPayload.tabId);
    } else if (message.type === PluginEventTypes.THEME_SET) {
      await this.saveThemeAndTellAllTabs(message);
    }
  }

  private async saveThemeAndTellAllTabs(
    message: PluginEvent<ThemeSetEventPayload>
  ) {
    const messagePayload: ThemeSetEventPayload = message.payload;
    this.currentContentType = messagePayload.content;
    await this.tellAllTabsTheirNewTheme()
  }

  private currentTheme: DokiTheme | undefined;
  private currentContentType: ContentType | undefined;

  async setTheme(dokiTheme: DokiTheme) {
    await super.setTheme(dokiTheme);
    this.currentTheme = dokiTheme;
  }

  getThemeForTab(tabId: number): ThemeSetEventPayload {
    return {
      content: this.currentContentType!!,
      themeId: this.currentTheme!!.themeId,
    };
  }
}
