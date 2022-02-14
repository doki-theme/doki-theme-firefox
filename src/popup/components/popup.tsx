import React, { FC, useEffect } from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import Select from "react-select";
import { DokiTheme } from "../../themes/DokiTheme";
import ThemedSelect from "./ThemedSelect";

const options: any[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

const ThemeStuff: FC<{ theme: DokiTheme }> = ({ theme }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--base-background", theme.colors.baseBackground);
  }, [theme]);
  return <></>;
};

const Popup = () => {

  return (
    <ThemeContext.Consumer>
      {
        ({ theme }) => {
          const colors = theme.colors;
          return <div style={{
            backgroundColor: colors.baseBackground,
            color: colors.lineNumberColor,
            padding: "1rem",
            minHeight: "500px",
            minWidth: "250px"
          }}>
            <ThemeStuff theme={theme}></ThemeStuff>
            <header>
              <h1 style={{ margin: "0 0 1rem 0" }}>Doki Theme</h1>
            </header>

            <ThemedSelect options={options}
                          defaultValue={options[0]} />
          </div>;
        }
      }
    </ThemeContext.Consumer>
  );
};

export default Popup;
