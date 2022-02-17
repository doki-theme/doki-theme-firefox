import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./components/popup";
import DokiThemeProvider from "../themes/DokiThemeProvider";
import FeatureProvider from "../themes/FeatureProvider";
import "react-tabs/style/react-tabs.css";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <DokiThemeProvider>
      <FeatureProvider>
        <Popup />
      </FeatureProvider>
    </DokiThemeProvider>
    ,
    document.getElementById("popup")
  );
});
