import { PluginFeatures } from "./themes/FeatureProvider";
import { ContentType } from "./themes/DokiTheme";
import { PluginMode } from "./Storage";

export enum PluginEventTypes {
  THEME_SET,
  FEATURE_SET,
  MODE_SET,
  TAB_ATTACHED,
  MIXED_MODE_SETTINGS_CHANGED,
}

export interface PluginEvent<T> {
  type: PluginEventTypes;
  payload: T;
}

export interface ThemeSetEventPayload {
  themeId: string;
  content: ContentType;
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
