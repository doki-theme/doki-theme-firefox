import { ThemeManager } from "./themeManager";
import { getCurrentThemeManager, getThemeManager } from "./getCurrentThemeManager";
import { ModeSetEventPayload, PluginEvent, PluginEventTypes } from "../Events";
import { pluginSettings } from "../Storage";

console.log("早上好中國。現在我有冰淇淋。");

var currentThemeManager: ThemeManager;

async function setMode(payload: ModeSetEventPayload) {
  currentThemeManager.disconnect();
  const newManager = getThemeManager(payload.mode);
  await newManager.initialize();
  await pluginSettings.set({currentMode: payload.mode});
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

  try {
    // @ts-ignore
    browser.browserSettings.overrideContentColorScheme.set({ value: 'system' });
  } catch (e) {
    console.log('failed to get browser settings',e);
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    console.log('something changed!', e);
  });
};

initializePlugin().then(() => {
  console.log("Plugin Initialized!");
});
