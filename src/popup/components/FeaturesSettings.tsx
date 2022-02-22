import React from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import Switch from "react-switch";
import { FeatureContext } from "../../themes/FeatureProvider";

const FeaturesSettings = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <FeatureContext.Consumer>
          {({ features, setFeatures }) => {
            const handleWidgetChange = (isSet: boolean) => {
              setFeatures({
                ...features,
                showWidget: isSet,
              });
            };
            const handleSelectionInjection = (isSet: boolean) => {
              browser.permissions
                .request({
                  permissions: ["tabs", "activeTab"],
                  origins: ["<all_urls>"],
                })
                .then((granted) => {
                  if (granted) {
                    setFeatures({ ...features, injectSelection: isSet });
                  }
                });
            };
            const handleScrollbarInjection = (isSet: boolean) => {
              browser.permissions
                .request({
                  permissions: ["tabs", "activeTab"],
                  origins: ["<all_urls>"],
                })
                .then((granted) => {
                  if (granted) {
                    setFeatures({ ...features, injectScrollbars: isSet });
                  }
                });
            };
            return (
              <>
                <Switch
                  onChange={handleWidgetChange}
                  checked={features.showWidget}
                />
                <Switch
                  onChange={handleSelectionInjection}
                  checked={features.injectSelection}
                />
                <Switch
                  onChange={handleScrollbarInjection}
                  checked={features.injectScrollbars}
                />
              </>
            );
          }}
        </FeatureContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
};

export default FeaturesSettings;
