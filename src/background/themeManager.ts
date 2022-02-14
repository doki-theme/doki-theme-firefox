import { DokiTheme } from "../themes/DokiTheme";
import { setThemedFavicon } from "./themedIcon";

export abstract class ThemeManager<T> {

  async initializeFirefox() {
    this.connect()
    await this.initializeTheme()
  }

  abstract initializeTheme(): Promise<void>;

  setTheme(dokiTheme: DokiTheme) {
    setThemedFavicon(dokiTheme);
    browser.theme.update(dokiTheme.browserTheme);
  }

  abstract handleMessage(message: T): void

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
