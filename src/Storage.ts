import OptionsSync, {Options} from "webext-options-sync";
import { DEFAULT_THEME_ID } from "./themes/DokiTheme";

export enum PluginMode {
  SINGLE, MIXED, DAY_NIGHT
}

export interface PluginLocalStorage extends Options {
  currentMode: PluginMode;
  singleModeTheme: string;
  currentTheme: string;
  showWidget: boolean;
}

export const pluginSettings = new OptionsSync<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    singleModeTheme: DEFAULT_THEME_ID,
    currentTheme: DEFAULT_THEME_ID,
    showWidget: true,
  }
});
