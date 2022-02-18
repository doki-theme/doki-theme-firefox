import { PluginFeatures } from "./themes/FeatureProvider";
import { ContentType } from "./themes/DokiTheme";

export enum PluginEventTypes {
  THEME_SET, FEATURE_SET,
}

export interface PluginEvent<T> {
  type: PluginEventTypes;
  payload: T
}

export interface ThemeSetEventPayload {
  themeId: string;
  content: ContentType;
}

export interface FeatureSetEventPayload {
  features: PluginFeatures;
}
