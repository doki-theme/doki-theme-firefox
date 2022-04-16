import * as React from "react";
import { createRoot } from "react-dom/client";
import Popup from "./components/popup";
import DokiThemeProvider from "../common/DokiThemeProvider";
import FeatureProvider from "../common/FeatureProvider";
import "react-tabs/style/react-tabs.css";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  const container = document.getElementById("popup");
  const root = createRoot(container!);
  root.render(
    <DokiThemeProvider>
      <FeatureProvider>
        <Popup />
      </FeatureProvider>
    </DokiThemeProvider>
  );
});
