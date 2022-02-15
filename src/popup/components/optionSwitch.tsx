import React, { FC } from "react";
import { PluginMode } from "../../Storage";
import SingleModeSettings from "./singleModeSettings";

export const OptionSwitch: FC<{ pluginMode: PluginMode }> = ({ pluginMode }) => {
  switch (pluginMode) {
    case PluginMode.DAY_NIGHT:
      return <div>Day Night</div>;
    case PluginMode.MIXED:
      return <div>Mixed</div>;
    case PluginMode.SINGLE:
    default:
      return <SingleModeSettings/>;
  }
};
