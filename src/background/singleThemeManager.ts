import { DEFAULT_DOKI_THEME } from "./background";
import { ThemeManager } from "./themeManager";
import { Message } from "./message";

export class SingleThemeManager extends ThemeManager<Message> {

  initializeTheme(): Promise<void> {
    this.setTheme(DEFAULT_DOKI_THEME);
    return Promise.resolve(undefined);
  }

  handleMessage(message: Message): void {
  }
}
