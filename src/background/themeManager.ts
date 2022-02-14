import { DokiTheme } from "../themes/DokiTheme";
import { themeExtensionIconInToolBar } from "./themedIcon";

export abstract class ThemeManager<T> {

  abstract initializeTheme(): Promise<void>;

  abstract handleMessage(message: T): void

  async initializeFirefox() {
    this.connect()
    await this.initializeTheme()
  }

  setTheme(dokiTheme: DokiTheme) {
    themeExtensionIconInToolBar(dokiTheme);
    browser.theme.update(dokiTheme.browserTheme);
  }

  connect() {
    browser.runtime.onMessage.addListener(this.dispatchMessage)
  }

  dispatchMessage(event: any) {
    this.handleMessage(event)
  }

  disconnect() {
    browser.runtime.onMessage.removeListener(this.dispatchMessage)
  }
}
