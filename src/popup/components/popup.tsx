import React from "react";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];


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
            minHeight: '500px',
          }}>
            <header>
              <h1 style={{ margin: "0 0 1rem 0" }}>Doki Theme</h1>
            </header>

            Current Theme: {theme.themeId}
            <Select options={options}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: colors.editorAccentColor,
                        neutral50: colors.infoForeground,
                        neutral10: colors.borderColor
                      }
                    })}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: colors.buttonColor,
                        borderColor: colors.borderColor,
                        ":hover": {
                          ...styles[":hover"],
                          borderColor: colors.editorAccentColor + "99"
                        }
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        borderBottom: `1px dotted ${colors.infoForeground}`,
                        color: state.isSelected ? colors.selectionForeground : colors.foregroundColorEditor,
                        ':hover': {
                          ...provided[':hover'],
                          backgroundColor: colors.selectionBackground,
                          color: colors.selectionForeground,
                        },
                        ':active': {
                          ...provided[':active'],
                          backgroundColor: colors.selectionBackground,
                          color: colors.selectionForeground,
                        }
                      }),
                      menu: (styles) => ({
                        ...styles,
                        backgroundColor: colors.lightEditorColor,
                        borderColor: colors.borderColor,
                      }),
                      indicatorSeparator: (styles) => ({
                        ...styles,
                        backgroundColor: colors.baseIconColor,
                      }),
                      dropdownIndicator: (styles) => ({
                        ...styles,
                        color: colors.baseIconColor,
                        borderColor: colors.borderColor
                      })

                    }} />
          </div>;
        }
      }
    </ThemeContext.Consumer>
  );
};

export default Popup;
