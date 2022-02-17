import * as React from "react";
import * as ReactDOM from "react-dom";
import Tab from "./components/tab";
import DokiThemeProviderContentScript from "../themes/DokiThemeProviderContentScript";
import FeatureProvider from "../themes/FeatureProvider";
import FeatureProviderContentScripts from "../themes/FeatureProviderContentScript";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <DokiThemeProviderContentScript>
      <FeatureProviderContentScripts>
        <Tab />
      </FeatureProviderContentScripts>
    </DokiThemeProviderContentScript>
    ,
    document.getElementById("tab")
  );
});
