import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./components/popup";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(<Popup />, document.getElementById("popup"));
});
