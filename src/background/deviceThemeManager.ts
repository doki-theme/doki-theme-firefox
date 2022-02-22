import {
  DeviceMatchSettingsChangedEventPayload,
  PluginEvent,
  PluginEventTypes,
  ThemeSetEventPayload,
} from "../Events";
import { pluginSettings } from "../Storage";
import { SingleThemeManager, ThemeStuff } from "./singleThemeManager";

const mediaQuery = "(prefers-color-scheme: dark)";

export class DeviceThemeManager extends SingleThemeManager {
  private darkThemeStuff: ThemeStuff = {
    themeId: undefined,
    content: undefined,
  };
  private lightThemeStuff: ThemeStuff = {
    themeId: undefined,
    content: undefined,
  };

  async initialize(): Promise<void> {
    await super.initialize();
    const { darkContentType, darkThemeId, lightContentType, lightThemeId } =
      await pluginSettings.getAll();
    this.darkThemeStuff = {
      content: darkContentType,
      themeId: darkThemeId,
    };
    this.lightThemeStuff = {
      content: lightContentType,
      themeId: lightThemeId,
    };
    try {
      // @ts-ignore
      browser.browserSettings.overrideContentColorScheme.set({
        value: "system",
      });
    } catch (e) {
      console.log("failed to get browser settings", e);
    }
  }

  private handleMediaChange(event: any) {
    this.dispatchNewThemeSet();
  }

  private dispatchNewThemeSet() {
    const { themeId, content } = this.getCurrentThemeAndContentType();
    const themeSetMessage: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: themeId!!,
        content: content!!,
      },
    };
    this.handleContentScriptMessage(themeSetMessage);
  }

  protected getCurrentThemeAndContentType(): ThemeStuff {
    if (DeviceThemeManager.isDark()) {
      return this.darkThemeStuff;
    }

    return this.lightThemeStuff;
  }

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.DEVICE_MATCH_SETTINGS_CHANGED) {
      const settings: DeviceMatchSettingsChangedEventPayload = message.payload;
      const darkThemeId = settings.dark.themeId;
      const darkContentType = settings.dark.content;
      this.darkThemeStuff = {
        themeId: darkThemeId,
        content: darkContentType,
      };
      const lightThemeId = settings.light.themeId;
      const lightContentType = settings.light.content;
      this.lightThemeStuff = {
        themeId: lightThemeId,
        content: lightContentType,
      };
      await pluginSettings.set({
        darkThemeId: darkThemeId,
        darkContentType: darkContentType,
        lightThemeId: lightThemeId,
        lightContentType: lightContentType,
      });
      this.dispatchNewThemeSet();
    } else {
      await super.handleMessage(message);
    }
  }

  private static isDark() {
    return window.matchMedia(mediaQuery).matches;
  }

  connect() {
    super.connect();
    window
      .matchMedia(mediaQuery)
      .addEventListener("change", this.handleMediaChange.bind(this));
  }

  disconnect() {
    super.disconnect();
    window
      .matchMedia(mediaQuery)
      .removeEventListener("change", this.handleMediaChange.bind(this));
  }
}
