import React, { useEffect, useState } from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import ThemedSelect from "./ThemedSelect";
import { PluginMode, pluginSettings } from "../../Storage";
import { OptionSwitch } from "./optionSwitch";
import { ThemeStuff } from "../../common/ThemeTools";
import Switch from "react-switch";
import { FeatureContext } from "../../themes/FeatureProvider";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "./popup.css";
import { ModeSetEventPayload, PluginEvent, PluginEventTypes } from "../../Events";
import FeaturesSettings from "./FeaturesSettings";

const options: { value: PluginMode; label: string }[] = [
  { value: PluginMode.SINGLE, label: "Individual" },
  { value: PluginMode.DAY_NIGHT, label: "Day/Night" },
  { value: PluginMode.MIXED, label: "Mixed" }
];

const Popup = () => {
  const [currentMode, setCurrentMode] = useState<PluginMode>(options[0].value);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    pluginSettings.getAll().then(({ currentMode }) => {
      setCurrentMode(currentMode);
      setInitialized(true);
    });
  });
  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const colors = theme.colors;
        return (
          <FeatureContext.Consumer>
            {({ features, setFeatures }) => {

              const handleModeChange = (thing: any) => {
                setCurrentMode(thing!!.value);
                const modeSetEvent: PluginEvent<ModeSetEventPayload> = {
                  type: PluginEventTypes.MODE_SET,
                  payload: {
                    mode: thing!!.value
                  }
                };
                browser.runtime.sendMessage(modeSetEvent);
              };
              return (
                <div
                  style={{
                    backgroundColor: colors.baseBackground,
                    color: colors.foregroundColor,
                    padding: "1rem",
                    minHeight: "500px",
                    minWidth: "250px"
                  }}
                >
                  <ThemeStuff theme={theme}></ThemeStuff>
                  {initialized ? (
                    <>
                      <header>
                        <h1 style={{ margin: "0 0 1rem 0" }}>Doki Theme</h1>
                      </header>
                      <Tabs>
                        <TabList className="doki-tabs__tab-list">
                          <Tab selectedClassName="doki-tabs__tab--selected">
                            Theme Settings
                          </Tab>
                          <Tab selectedClassName="doki-tabs__tab--selected">
                            Plugin Features
                          </Tab>
                        </TabList>
                        <TabPanel>
                          <label>Plugin Mode</label>
                          <ThemedSelect
                            options={options}
                            onChange={handleModeChange}
                            defaultValue={
                              options.find(option => option.value === currentMode)!!
                            }
                          />
                          <OptionSwitch pluginMode={currentMode} />
                        </TabPanel>
                        <TabPanel>
                          <FeaturesSettings/>
                        </TabPanel>
                      </Tabs>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            }}
          </FeatureContext.Consumer>
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default Popup;
