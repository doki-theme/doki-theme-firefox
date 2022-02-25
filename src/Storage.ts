import OptionsSync, { Options } from "webext-options-sync";
import {
  ContentType,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
} from "./themes/DokiTheme";
import { ThemePools } from "./Events";

export enum PluginMode {
  SINGLE = "single",
  MIXED = "mixed",
  DEVICE_MATCH = "device match",
}

export interface PluginLocalStorage extends Options {
  currentMode: PluginMode;
  currentTheme: string;
  currentContentType: ContentType;
  darkThemeId: string;
  darkContentType: ContentType;
  lightThemeId: string;
  lightContentType: ContentType;
  showWidget: boolean;
  themePool: ThemePools;
  injectSelection: boolean;
  injectScrollbars: boolean;
}

// todo: figure out why this blows up without an ID in manifest.
export const pluginSettings = new OptionsSync<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    currentTheme: DEFAULT_DARK_THEME_ID,
    currentContentType: ContentType.PRIMARY,
    darkThemeId: DEFAULT_DARK_THEME_ID,
    darkContentType: ContentType.PRIMARY,
    lightThemeId: DEFAULT_LIGHT_THEME_ID,
    lightContentType: ContentType.PRIMARY,
    showWidget: true,
    themePool: ThemePools.DEFAULT,
    injectSelection: false,
    injectScrollbars: false,
  },
});
