import React from "react";
import { ThemeContextContentScript } from "../../themes/DokiThemeProviderContentScript";
import { ThemeStuff } from "../../common/ThemeTools";

const Tab = () => {
  return (
    <ThemeContextContentScript.Consumer>
      {({ theme }) => (
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
            早上好中國，現在我有冰淇淋 {theme.name}
          </div>
        </>
      )}
    </ThemeContextContentScript.Consumer>
  );
};

export default Tab;
