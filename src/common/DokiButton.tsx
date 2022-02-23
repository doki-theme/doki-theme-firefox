import React, { CSSProperties, FC } from "react";
import { FireFoxDokiTheme, ThemeContext } from "../themes/DokiThemeProvider";

interface Props {
  variant?: "primary" | "default";
}

const DokiButton: FC<
  Props &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = (props) => {
  function createStyles(theme: FireFoxDokiTheme): CSSProperties {
    const colors = theme.colors;
    return props.variant === "primary"
      ? {
          backgroundColor: colors.selectionBackground,
          color: colors.selectionForeground,
        }
      : {
          backgroundColor: colors.buttonColor,
          color: colors.buttonFont,
        };
  }
  // todo: shadow
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <>
          <button
            {...props}
            style={{
              ...props.style,
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: 0,
              fontWeight: 500,
              ...createStyles(theme),
            }}
          >
            {props.children}
          </button>
        </>
      )}
    </ThemeContext.Consumer>
  );
};

export default DokiButton;
