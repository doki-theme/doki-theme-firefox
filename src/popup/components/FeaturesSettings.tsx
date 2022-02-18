import React from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import Switch from "react-switch";
import { FeatureContext } from "../../themes/FeatureProvider";

async function reloadTabs(obj: any) {
  const tabs: browser.tabs.Tab[] = await browser.tabs.query(obj);
  Promise.all(tabs.map(tab => browser.tabs.reload(tab.id!!)));
}

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
                  if (granted && isSet) {
                    browser.contentScripts.register({
                      js: [{ file: "./js/styleInjection.js" }],
                      matches: ["<all_urls>"],
                    }).then(()=> reloadTabs({ url: "*://*/*" }));

                  }
                  setFeatures({ ...features, injectSelection: isSet });
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
              </>
            );
          }}
        </FeatureContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
};

export default FeaturesSettings;
