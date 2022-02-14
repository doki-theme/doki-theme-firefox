import { DokiTheme } from "../themes/DokiTheme";
import { svgToPng } from "./svgTools";


export function setThemedFavicon(dokiTheme: DokiTheme) {
  const faviconOptions = { width: 32, height: 32 };
  svgToPng(dokiTheme, faviconOptions).then((imgData: any) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = imgData;
  });
}

export function themeExtensionIconInToolBar(dokiTheme: DokiTheme) {
  const extensionIconOptions = {width: 74, height: 74, useCanvasData: true};
  svgToPng(dokiTheme, extensionIconOptions).then((imageData) =>
    browser.browserAction.setIcon({
      imageData
    }));
}
