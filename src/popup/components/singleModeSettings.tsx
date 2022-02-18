import React, { useMemo } from "react";
import { Field, Formik } from "formik";
import ThemedSelect from "./ThemedSelect";
import { characterThemes } from "./Characters";
import { CharacterTheme, ContentType, DokiTheme } from "../../themes/DokiTheme";
import { ThemeContext } from "../../themes/DokiThemeProvider";
import { chooseRandomTheme } from "../../common/ThemeTools";

interface FormValues {
  character: CharacterTheme;
  contentType: ContentType;
  selectedTheme: DokiTheme;
}

function createThemeVariantName(theme: DokiTheme) {
  const trimmedVariant = theme.name
    .replace(theme.displayName, "")
    .replace(":", "")
    .trim();
  return trimmedVariant || (theme.dark ? "Dark" : "Light");
}

function getThemeSelector(
  values: FormValues,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
) {
  const options = values.character.themes.map((theme) => ({
    value: theme,
    label: createThemeVariantName(theme)
  }));
  return (
    <>
      <label>
        Theme Variant
        <ThemedSelect
          options={options}
          value={{
            value: values.selectedTheme,
            label: createThemeVariantName(values.selectedTheme)
          }}
          onChange={(selectedCharacter) =>
            setFieldValue("selectedTheme", selectedCharacter!!.value)
          }
        />
      </label>
    </>
  );
}


const SingleModeSettings = () => {
  const options = useMemo(() => {
    const characterOptions = characterThemes.map((characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name
    }));
    characterOptions.sort((a, b) => a.label.localeCompare(b.label));
    return characterOptions;
  }, []);

  function findCharacter(theme: DokiTheme) {
    return characterThemes.find((character) =>
      character.themes.some(
        (dokiTheme) => dokiTheme.equals(theme)
      )
    )!!;
  }

  const pickRandomTheme =
    (resetForm: (nextState?: any) => void, setTheme: (context: ThemeContext) => void) =>
      () => {
        const { dokiTheme, contentType } = chooseRandomTheme();
        setTheme({
          contentType,
          selectedTheme: dokiTheme
        });

        const nextFormState: FormValues = {
          character: findCharacter(dokiTheme),
          selectedTheme: dokiTheme,
          contentType: contentType
        };
        resetForm({
          values: nextFormState
        });
      };

  return (
    <>
      <ThemeContext.Consumer>
        {({ theme, setTheme, isInitialized }) => {
          if (!isInitialized) return <></>;

          const initialValues: FormValues = {
            character: findCharacter(theme),
            contentType: ContentType.PRIMARY,
            selectedTheme: theme.dokiTheme
          };
          return (
            <>
              <h3>Choose a character</h3>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, formikHelpers) => {
                  setTheme({
                    selectedTheme: values.selectedTheme,
                    contentType: values.contentType
                  });

                  formikHelpers.resetForm({
                    values: values
                  });
                }}
              >
                {({
                    values,
                    handleSubmit,
                    isSubmitting,
                    dirty,
                    setFieldValue,
                    resetForm
                  }) => (
                  <>
                    <button onClick={pickRandomTheme(resetForm, setTheme)}>
                      Choose Random Theme
                    </button>
                    <form onSubmit={handleSubmit}>
                      <ThemedSelect
                        options={options}
                        value={{
                          label: values.character.name,
                          value: values.character
                        }}
                        onChange={(selectedCharacter) => {
                          const characterValue = selectedCharacter!!.value;
                          setFieldValue(
                            "selectedTheme",
                            characterValue.themes[0]
                          );
                          return setFieldValue("character", characterValue);
                        }}
                      />

                      {values.character.hasMultipleThemes &&
                        getThemeSelector(values, setFieldValue)}

                      {values.character.hasSecondaryContent && (
                        <>
                          <div id="contentTypeGroup">Content Type</div>
                          <div role="group" aria-labelledby="contentTypeGroup">
                            <label>
                              <Field
                                type="radio"
                                name="contentType"
                                value={ContentType.PRIMARY}
                                onChange={() => {
                                  setFieldValue(
                                    "contentType",
                                    ContentType.PRIMARY
                                  );
                                }}
                              />
                              Primary
                            </label>
                            <label>
                              <Field
                                type="radio"
                                name="contentType"
                                value={ContentType.SECONDARY}
                                onChange={() => {
                                  setFieldValue(
                                    "contentType",
                                    ContentType.SECONDARY
                                  );
                                }}
                              />
                              Secondary
                            </label>
                          </div>
                        </>
                      )}
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
