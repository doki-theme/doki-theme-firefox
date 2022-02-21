import {
  DeviceMatchSettingsChangedEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";
import { pluginSettings } from "../Storage";
import { SingleThemeManager } from "./singleThemeManager";

export class DeviceThemeManager extends SingleThemeManager {
  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.DEVICE_MATCH_SETTINGS_CHANGED) {
      const settings: DeviceMatchSettingsChangedEventPayload = message.payload;
      await pluginSettings.set({
        darkThemeId: settings.dark.themeId,
        darkContentType: settings.dark.content,
        lightThemeId: settings.light.themeId,
        lightContentType: settings.light.content,
      });
    }
  }
}
