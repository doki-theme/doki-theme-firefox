import { PluginFeatures } from "./themes/FeatureProvider";
import { ContentType, DokiThemeDefinition } from "./themes/DokiTheme";
import { PluginMode } from "./Storage";

export enum PluginEventTypes {
  THEME_SET,
  FEATURE_SET,
  MODE_SET,
  TAB_ATTACHED,
  MIXED_MODE_SETTINGS_CHANGED,
  DEVICE_MATCH_SETTINGS_CHANGED,
  CURRENT_THEME_UPDATED,
  CONTENT_SCRIPT_INJECTED,
}

export interface PluginEvent<T> {
  type: PluginEventTypes;
  payload: T;
}

export interface ThemeSetEventPayload {
  themeId: string;
  content: ContentType;
}

export interface CurrentThemeSetEventPayload {
  themeDefinition: DokiThemeDefinition,
}

export interface FeatureSetEventPayload {
  features: PluginFeatures;
}

export interface ModeSetEventPayload {
  mode: PluginMode;
}

export interface TabAttachedEventPayload {
  tabId: number;
}

export enum ThemePools {
  DEFAULT,
  LIGHT,
  DARK,
  MATCH_DEVICE,
}

export interface MixedModeSettingsChangedPayload {
  themePool: ThemePools;
}

export interface ContentScriptInjectedPayload {
}

export interface DeviceMatchSettingsChangedEventPayload {
  dark: ThemeSetEventPayload;
  light: ThemeSetEventPayload;
}

