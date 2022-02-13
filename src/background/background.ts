import { DokiTheme } from "../themes/DokiTheme";
import DokiThemeDefinitions from "../DokiThemeDefinitions";
import {
  getCurrentThemeManager,
  ThemeManager
} from "./themeManager";

console.log("早上好中國。現在我有冰淇淋。");

export const DEFAULT_DOKI_THEME = new DokiTheme(DokiThemeDefinitions["8c99ec4b-fda0-4ab7-95ad-a6bf80c3924b"]);

var currentThemeManager: ThemeManager;

const initializePlugin = async () => {
  currentThemeManager = await getCurrentThemeManager();
  await currentThemeManager.initializeFirefox()
};

initializePlugin().then(()=> {
  console.log('Plugin Initialized!');
});
