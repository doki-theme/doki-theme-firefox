import { ThemeManager } from "./themeManager";
import { FireFoxDokiTheme } from "../themes/DokiThemeProvider";
import {
  MixedModeSettingsChangedPayload,
  PluginEvent,
  PluginEventTypes,
  TabAttachedEventPayload,
  ThemePools,
  ThemeSetEventPayload
} from "../Events";
import { chooseRandomTheme } from "../common/ThemeTools";
import { pluginSettings } from "../Storage";
import { DokiTheme } from "../themes/DokiTheme";

export const CollectAndDebounce = <T>(
  toDebounce: (t: T[]) => void,
  interval: number
): ((t: T) => void) => {
  let lastTimeout: NodeJS.Timeout | undefined = undefined;
  let collection: T[] = [];
  return (t: T) => {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    collection.push(t);

    lastTimeout = setTimeout(() => {
      lastTimeout = undefined;
      toDebounce(collection);
      collection = [];
    }, interval);
  };
};

export class MixedThemeManager extends ThemeManager {
  private tabToTheme: { [tabId: string]: FireFoxDokiTheme } = {};

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.TAB_ATTACHED) {
      await this.tellTabToSetItsThemePls(message);
    } else if (message.type === PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED) {
      const settingChangedPayload: MixedModeSettingsChangedPayload = message.payload;
      this.currentThemePool = settingChangedPayload.themePool;
    }
  }

  private async tellTabToSetItsThemePls(message: PluginEvent<any>) {
    const tabAttachedPayload: TabAttachedEventPayload = message.payload;
    const tabId = tabAttachedPayload.tabId;
    await this.tellTabItsTheme(tabId);
  }

  private async tellTabItsTheme(tabId: number) {
    const associatedTheme = this.getAssociatedTheme(tabId);
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: associatedTheme.themeId,
        content: associatedTheme.activeContent
      }
    };
    await browser.tabs.sendMessage(tabId, themeSetEvent);
  }

  private getAssociatedTheme(tabId: number): FireFoxDokiTheme {
    const rememberedTheme = this.tabToTheme[tabId];
    if(!rememberedTheme) {
      const newlyAssociatedTab = this.associateThemeWithTab(tabId); // todo: could infinitely recurse.....
      this.tellTabItsTheme(tabId);
      return newlyAssociatedTab;
    } else {
      return rememberedTheme;
    }
  }

  async handleTabCreation({ id }: any): Promise<void> {
    this.associateThemeWithTab(id);
  }

  private associateThemeWithTab(tabId: number): FireFoxDokiTheme {
    const { dokiTheme, contentType } = chooseRandomTheme(
      this.isInCurrentPool.bind(this)
    );
    this.tabToTheme[tabId] = new FireFoxDokiTheme(dokiTheme, contentType);
    return this.tabToTheme[tabId];
  }

  private debouncedSetTheme = CollectAndDebounce((tabIds: number[]) => {
    const lastActiveTab = tabIds[tabIds.length - 1];
    const dokiTheme = this.getAssociatedTheme(lastActiveTab);
    this.setTheme(dokiTheme);
  }, 100);

  async handleTabActivation({ tabId }: any): Promise<void> {
    this.debouncedSetTheme(tabId);
  }

  async handleTabRemoval({ tabId }: any): Promise<void> {
    delete this.tabToTheme[tabId];
  }

  private currentThemePool: ThemePools = ThemePools.DEFAULT;

  async initialize() {
    await super.initialize();
    try {
      const { themePool } = await pluginSettings.getAll();
      this.currentThemePool = themePool;
    } catch (e) {
    }
  }

  connect() {
    super.connect();
    browser.tabs.onActivated.addListener(this.handleTabActivation.bind(this));
    browser.tabs.onRemoved.addListener(this.handleTabRemoval.bind(this));
  }

  disconnect() {
    super.disconnect();
    browser.tabs.onActivated.removeListener(this.handleTabActivation.bind(this));
    browser.tabs.onRemoved.removeListener(this.handleTabRemoval.bind(this));
  }

  private isInCurrentPool(dokiTheme: DokiTheme): boolean {
    switch (this.currentThemePool) {
      case ThemePools.MATCH_DEVICE:
        return true;// todo: match device.....
      case ThemePools.LIGHT:
        return !dokiTheme.dark;
      case ThemePools.DARK:
        return dokiTheme.dark;
      case ThemePools.DEFAULT:
      default:
        return true;
    }
  }
}
