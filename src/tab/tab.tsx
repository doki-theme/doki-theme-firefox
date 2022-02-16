import * as React from "react";
import * as ReactDOM from "react-dom";
import Tab from "./components/tab";
import DokiThemeProviderContentScript from "../themes/DokiThemeProviderContentScript";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <DokiThemeProviderContentScript>
      <Tab />
    </DokiThemeProviderContentScript>
    ,
    document.getElementById("tab")
  );
});
