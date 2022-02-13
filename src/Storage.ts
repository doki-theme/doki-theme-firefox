import OptionsSync, {Options} from "webext-options-sync";

export enum PluginMode {
  SINGLE, MIXED, DAY_NIGHT
}

export interface PluginLocalStorage extends Options {
  currentMode: PluginMode;
  singleModeTheme: string;
}

export const pluginSettings = new OptionsSync<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    singleModeTheme: "8c99ec4b-fda0-4ab7-95ad-a6bf80c3924b"
  }
});
