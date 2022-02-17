import React, { FC, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME_ID } from "./DokiTheme";
import { pluginSettings } from "../Storage";
import { FeatureSetEventPayload, PluginEvent, PluginEventTypes } from "../Events";

export interface PluginFeatures {
  showWidget: boolean;
}

export interface PluginFeatureContext {
  setFeatures: (context: PluginFeatures) => void;
  isInitialized: boolean;
  features: PluginFeatures;
}

export const defaultFeatures = {
  showWidget: true
};

export const FeatureContext = React.createContext<PluginFeatureContext>({
  setFeatures: (context: PluginFeatures) => {
  },
  isInitialized: false,
  features: defaultFeatures
});

const FeatureProvider: FC = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [features, setFeatures] = useState<PluginFeatures>(defaultFeatures);
  const setTheme = (context: PluginFeatures) => {
    const themeSetEvent: PluginEvent<FeatureSetEventPayload> = {
      type: PluginEventTypes.FEATURE_SET,
      payload: {
        features: context
      }
    };
    setFeatures(context);

    browser.runtime.sendMessage(themeSetEvent);
  };

  useEffect(() => {
    pluginSettings.getAll().then((setting) => {
      setFeatures({
        showWidget: setting.showWidget
      });
      setInitialized(true);
    });
  }, []);

  const featureContext = useMemo<PluginFeatureContext>(
    () => ({
      setFeatures: setTheme,
      isInitialized: initialized,
      features
    }),
    [initialized, features]
  );

  return (
    <FeatureContext.Provider value={featureContext}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureProvider;
