import React, { useMemo } from "react";
import { Formik } from "formik";
import { characterThemes } from "./Characters";
import { CharacterTheme, ContentType, DokiTheme } from "../../themes/DokiTheme";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import { chooseRandomTheme } from "../../common/ThemeTools";
import DokiThemeComponent, { CharacterOption } from "./DokiThemeComponent";

interface FormValues {
  selected: {
    character: CharacterTheme;
    contentType: ContentType;
    selectedTheme: DokiTheme;
  };
}

const SingleModeSettings = () => {
  const options: CharacterOption[] = useMemo(() => {
    const characterOptions = characterThemes.map((characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name,
    }));
    characterOptions.sort((a, b) => a.label.localeCompare(b.label));
    return characterOptions;
  }, []);

  function findCharacter(theme: DokiTheme) {
    return characterThemes.find((character) =>
      character.themes.some((dokiTheme) => dokiTheme.equals(theme))
    )!!;
  }

  const pickRandomTheme =
    (
      resetForm: (nextState?: any) => void,
      setTheme: (context: ThemeContext) => void
    ) =>
    () => {
      const { dokiTheme, contentType } = chooseRandomTheme();
      setTheme({
        contentType,
        selectedTheme: dokiTheme,
      });

      const nextFormState: FormValues = {
        selected: {
          character: findCharacter(dokiTheme),
          selectedTheme: dokiTheme,
          contentType: contentType,
        },
      };
      resetForm({
        values: nextFormState,
      });
    };

  return (
    <>
      <ThemeContext.Consumer>
        {({ theme, setTheme, isInitialized }) => {
          if (!isInitialized) return <></>;

          const initialValues: FormValues = {
            selected: {
              character: findCharacter(theme),
              contentType: ContentType.PRIMARY,
              selectedTheme: theme.dokiTheme,
            },
          };
          return (
            <>
              <h3>Choose a character</h3>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, formikHelpers) => {
                  setTheme({
                    selectedTheme: values.selected.selectedTheme,
                    contentType: values.selected.contentType,
                  });

                  formikHelpers.resetForm({
                    values: values,
                  });
                }}
              >
                {({
                  values,
                  handleSubmit,
                  isSubmitting,
                  dirty,
                  setFieldValue,
                  resetForm,
                }) => (
                  <>
                    <button onClick={pickRandomTheme(resetForm, setTheme)}>
                      Choose Random Theme
                    </button>
                    <DokiThemeComponent
                      values={values}
                      options={options}
                      prefix={"selected"}
                      setFieldValue={setFieldValue}
                    />
                    <form onSubmit={handleSubmit}>
                      <button type="submit" disabled={isSubmitting || !dirty}>
                        Apply
                      </button>
                    </form>
                  </>
                )}
              </Formik>
            </>
          );
        }}
      </ThemeContext.Consumer>
    </>
  );
};

export default SingleModeSettings;
