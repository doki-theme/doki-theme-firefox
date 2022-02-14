import { ThemeManager } from "./themeManager";
import { Message } from "./message";

export class DayNightThemeManager extends ThemeManager<Message> {
  initializeTheme(): Promise<void> {
    return Promise.resolve(undefined);
  }

  handleMessage(message: Message): void {
  }
}
