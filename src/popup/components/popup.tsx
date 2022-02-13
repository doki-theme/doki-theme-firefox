import React from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";

const Popup = () => {
  return (
    <ThemeContext.Consumer>
      {
        ({ theme }) => <div>
          Current Theme: {theme.themeId}
        </div>
      }
    </ThemeContext.Consumer>
  );
};

export default Popup;
