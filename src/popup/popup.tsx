import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./components/popup";
import DokiThemeProvider from "../themes/DokiThemeProvider";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <DokiThemeProvider>
      <Popup />
    </DokiThemeProvider>
    ,
    document.getElementById("popup")
  );
});
