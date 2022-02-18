import React, { FC } from "react";
import { PluginMode } from "../../Storage";
import SingleModeSettings from "./singleModeSettings";
import MixedModeSettings from "./mixedModeSettings";

export const OptionSwitch: FC<{ pluginMode: PluginMode }> = ({ pluginMode }) => {
  switch (pluginMode) {
    case PluginMode.DAY_NIGHT:
      return <div>Day Night</div>;
    case PluginMode.MIXED:
      return <MixedModeSettings/>;
    case PluginMode.SINGLE:
    default:
      return <SingleModeSettings/>;
  }
};
