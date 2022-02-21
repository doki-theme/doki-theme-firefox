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
  singleModeTheme: string;
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

export const pluginSettings = new OptionsSync<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    singleModeTheme: DEFAULT_DARK_THEME_ID,
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
