import {
  FeatureSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";
import { pluginSettings } from "../Storage";
import RegisteredContentScript = browser.contentScripts.RegisteredContentScript;

async function reloadTabs(obj: any) {
  const tabs: browser.tabs.Tab[] = await browser.tabs.query(obj);
  Promise.all(tabs.map((tab) => browser.tabs.reload(tab.id!!)));
}

export class StyleInjectionManager {
  private savedScripts: { [key: string]: RegisteredContentScript } = {};

  private async handleMessage(event: PluginEvent<any>) {
    if (event.type === PluginEventTypes.FEATURE_SET) {
      const featureSet: FeatureSetEventPayload = event.payload;
      // todo: un-register if unset & conditionals

      await this.injectSelectionScript();
      await this.injectScrollbarScript();

      await reloadTabs({ url: "*://*/*" });
    }
  }

  private async injectSelectionScript() {
    const contentKey = "selection";
    const script = "js/selectionStyleInjection.js";
    await this.injectScript(contentKey, script);
  }
  private async injectScrollbarScript() {
    const contentKey = "scrollbar";
    const script = "js/scrollbarStyleInjection.js";
    await this.injectScript(contentKey, script);
  }

  private async injectScript(contentKey: string, script: string) {
    if (this.savedScripts[contentKey]) {
      try {
        await this.savedScripts[contentKey].unregister();
      } catch (e) {
        console.error("unable to unregister style", e);
      }
    }

    try {
      this.savedScripts[contentKey] = await browser.contentScripts.register({
        js: [{ file: script }],
        matches: ["<all_urls>"],
      });
    } catch (e) {
      console.error("unable to set style injections", e);
    }
  }

  async initialize() {
    browser.runtime.onMessage.addListener(this.handleMessage.bind(this));

    const { injectScrollbars, injectSelection } = await pluginSettings.getAll();
    if (injectSelection) {
      await this.injectSelectionScript();
    }

    if (injectScrollbars) {
      await this.injectScrollbarScript();
    }
  }
}
