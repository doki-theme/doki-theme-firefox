import OptionsSync, { Options } from "webext-options-sync";
import { ContentType, DEFAULT_THEME_ID } from "./themes/DokiTheme";
import { ThemePools } from "./Events";

export enum PluginMode {
  SINGLE = "single",
  MIXED = "mixed",
  DEVICE_MATCH = "device match",
}

export interface PluginLocalStorage extends Options {
  currentMode: PluginMode;
  singleModeTheme: string;
  currentTheme: string;
  currentContentType: ContentType;
  showWidget: boolean;
  themePool: ThemePools;
  injectSelection: boolean;
  injectScrollbars: boolean;
}

export const pluginSettings = new OptionsSync<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    singleModeTheme: DEFAULT_THEME_ID,
    currentTheme: DEFAULT_THEME_ID,
    currentContentType: ContentType.PRIMARY,
    showWidget: true,
    themePool: ThemePools.DEFAULT,
    injectSelection: false,
    injectScrollbars: false,
  },
});
