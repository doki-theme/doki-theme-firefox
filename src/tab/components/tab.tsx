import React from "react";
import { ThemeContextContentScript } from "../../themes/DokiThemeProviderContentScript";
import { ThemeStuff } from "../../common/ThemeTools";
import SearchWidget from "./SearchWidget";

const Tab = () => {
  return (
    <ThemeContextContentScript.Consumer>
      {({ theme, features }) => (
        <>
          <ThemeStuff theme={theme}></ThemeStuff>
          <div
            style={{
              color: theme.colors.foregroundColor,
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url(${browser.runtime.getURL(
                "backgrounds/rikka_dark.png"
              )})`,
            }}
          >
            { features.showWidget && (<SearchWidget theme={theme}/>)}
          </div>
        </>
      )}
    </ThemeContextContentScript.Consumer>
  );
};

export default Tab;
