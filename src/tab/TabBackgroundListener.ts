import { pluginSettings } from "../Storage";
import { DokiTheme, DokiThemes } from "../themes/DokiTheme";
import { svgToPng } from "../background/svgTools";
import { PluginEvent, PluginEventTypes, TabAttachedEventPayload, ThemeSetEventPayload } from "../Events";

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


function themeFavicon(themeId: string) {
  const currentTheme = DokiThemes[themeId];
  if (currentTheme) {
    setThemedFavicon(currentTheme);
  }
}

export const notifyTabAttached = () => {
  browser.tabs.getCurrent().then(tab => {
    const tabAttachedEvent: PluginEvent<TabAttachedEventPayload> = {
      type: PluginEventTypes.TAB_ATTACHED,
      payload: {
        tabId: tab.id!!
      }
    }
    return browser.runtime.sendMessage(tabAttachedEvent);
  })
}

export const attachBackgroundListener = ()=> {
  pluginSettings.getAll().then((setting) => {
    const themeId = setting.currentTheme;
    themeFavicon(themeId);
  })
  browser.runtime.onMessage.addListener((event: any) => {
    if(event.type === PluginEventTypes.THEME_SET) {
      const themeSetPayload: ThemeSetEventPayload = event.payload;
      themeFavicon(themeSetPayload.themeId)
    }
  });
}
