import { pluginSettings } from "../Storage";
import { DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { svgToPng } from "../background/svgTools";

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


export const attachBackgroundListener = ()=> {
  pluginSettings.getAll().then((setting) => {
    const currentTheme = DokiThemes[setting.currentTheme];
    if (currentTheme) {
      setThemedFavicon(currentTheme)
    }
  })
}
