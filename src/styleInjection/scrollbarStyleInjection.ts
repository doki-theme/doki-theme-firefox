// todo notify attachment & get theme for tab...

import { ContentScriptInjectedPayload, CurrentThemeSetEventPayload, PluginEvent, PluginEventTypes } from "../Events";
import { DokiThemeDefinition } from "../themes/DokiTheme";

abstract class ContentInjector {

  constructor(private readonly styleId: string) {
  }

  initialize() {

  }

  abstract createStyles(dokiTheme: DokiThemeDefinition) : string
}

function injectContent(message: PluginEvent<CurrentThemeSetEventPayload>) {
  const accentColor = message.payload.themeDefinition.colors.accentColor;
  const style = `:root{
  scrollbar-color: ${accentColor} rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;
}`;

  const previousStyle = document.head.querySelector("style[id='doki_scrollbar']");
  if(previousStyle) {
    document.head.removeChild(previousStyle)
  }
  const styleText = document.createTextNode(style);
  const styleTag = document.createElement('style');
  styleTag.id = 'doki_scrollbar';
  styleTag.append(styleText);
  document.head.append(styleTag);
}

async function applyScrollbar() {
  browser.runtime.onMessage.addListener(message => {
    if(message.type === PluginEventTypes.CURRENT_THEME_UPDATED) {
      injectContent(message)
    } else if(message.type === PluginEventTypes.REPLIED_WITH_CURRENT_THEME) {
      injectContent(message)
    }
  });

  console.log(`hello I am also in your tab :)`);

  const injectedEvent: PluginEvent<ContentScriptInjectedPayload> = {
    type: PluginEventTypes.CONTENT_SCRIPT_INJECTED,
    payload: {}
  }
  browser.runtime.sendMessage(injectedEvent)
}

applyScrollbar();
