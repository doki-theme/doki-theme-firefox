import React, { useState } from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import ThemedSelect from "./ThemedSelect";
import { PluginMode } from "../../Storage";
import { OptionSwitch } from "./optionSwitch";
import { ThemeStuff } from "../../common/ThemeTools";
import Switch from "react-switch";
import { FeatureContext } from "../../themes/FeatureProvider";

const options: { value: PluginMode; label: string }[] = [
  { value: PluginMode.SINGLE, label: "Individual" },
  { value: PluginMode.DAY_NIGHT, label: "Day/Night" },
  { value: PluginMode.MIXED, label: "Mixed" },
];

const Popup = () => {
  const [currentMode, setCurrentMode] = useState<PluginMode>(options[0].value);
  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const colors = theme.colors;
        return (
          <FeatureContext.Consumer>
            {({ features, setFeatures }) => {
              const handleWidgetChange = (isSet: boolean) => {
                setFeatures({
                  ...features,
                  showWidget: isSet,
                });
              };
              return (
                <div
                  style={{
                    backgroundColor: colors.baseBackground,
                    color: colors.lineNumberColor,
                    padding: "1rem",
                    minHeight: "500px",
                    minWidth: "250px",
                  }}
                >
                  <ThemeStuff theme={theme}></ThemeStuff>
                  <header>
                    <h1 style={{ margin: "0 0 1rem 0" }}>Doki Theme</h1>
                  </header>
                  <Switch
                    onChange={handleWidgetChange}
                    checked={features.showWidget}
                  />
                  <label>Plugin Mode</label>
                  <ThemedSelect
                    options={options}
                    onChange={(thing) => {
                      setCurrentMode(thing!!.value);
                    }}
                    defaultValue={options[0]}
                  />
                  <OptionSwitch pluginMode={currentMode} />
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
