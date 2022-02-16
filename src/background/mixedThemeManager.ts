import { ThemeManager } from "./themeManager";
import { Message } from "./message";

export class MixedThemeManager extends ThemeManager {
  initializeTheme(): Promise<void> {
    return Promise.resolve(undefined);
  }

  handleMessage(message: Message): void {
  }

}
