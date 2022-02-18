import { ThemeManager } from "./themeManager";
import { getCurrentThemeManager, getThemeManager } from "./getCurrentThemeManager";
import { ModeSetEventPayload, PluginEvent, PluginEventTypes } from "../Events";

console.log("早上好中國。現在我有冰淇淋。");

var currentThemeManager: ThemeManager;

function setMode(payload: ModeSetEventPayload) {
  currentThemeManager.disconnect();
  const newManager = getThemeManager(payload.mode);
  newManager.connect();
}

const handleMessages = (message: PluginEvent<any>) => {
  if(message.type === PluginEventTypes.MODE_SET) {
    setMode(message.payload as ModeSetEventPayload)
  }
};

const initializePlugin = async () => {
  currentThemeManager = await getCurrentThemeManager();
  await currentThemeManager.initializeFirefox();
  browser.runtime.onMessage.addListener(handleMessages);
};

initializePlugin().then(() => {
  console.log("Plugin Initialized!");
});
