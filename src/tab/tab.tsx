import * as React from "react";
import * as ReactDOM from "react-dom";
import Tab from "./components/tab";
import DokiThemeProviderContentScript from "../themes/DokiThemeProviderContentScript";
import FeatureProviderContentScripts from "../themes/FeatureProviderContentScript";
import { attachBackgroundListener } from "./TabBackgroundListener";


document.addEventListener('DOMContentLoaded',  ()=> {
attachBackgroundListener();
  ReactDOM.render(
    <DokiThemeProviderContentScript>
      <FeatureProviderContentScripts>
        <Tab />
      </FeatureProviderContentScripts>
    </DokiThemeProviderContentScript>
    ,
    document.getElementById("tab")
  );
}, false);