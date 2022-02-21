import {
  DeviceMatchSettingsChangedEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";
import { pluginSettings } from "../Storage";
import { SingleThemeManager, ThemeStuff } from "./singleThemeManager";

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
  }

  protected getCurrentThemeAndContentType(): ThemeStuff {
    if (this.isDark()) {
      return this.darkThemeStuff;
    }

    return this.lightThemeStuff;
  }

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.DEVICE_MATCH_SETTINGS_CHANGED) {
      const settings: DeviceMatchSettingsChangedEventPayload = message.payload;
      await pluginSettings.set({
        darkThemeId: settings.dark.themeId,
        darkContentType: settings.dark.content,
        lightThemeId: settings.light.themeId,
        lightContentType: settings.light.content,
      });
    } else {
      await super.handleMessage(message);
    }
  }

  private isDark() {
    return false;
  }
}
