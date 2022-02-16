import {
  ThemeManager
} from "./themeManager";
import { getCurrentThemeManager } from "./getCurrentThemeManager";

console.log("早上好中國。現在我有冰淇淋。");

var currentThemeManager: ThemeManager;

const initializePlugin = async () => {
  currentThemeManager = await getCurrentThemeManager();
  await currentThemeManager.initializeFirefox();
};

initializePlugin().then(() => {
  console.log("Plugin Initialized!");
});
