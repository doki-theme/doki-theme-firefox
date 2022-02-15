import React, { useMemo } from "react";
import { Formik, Field } from "formik";
import ThemedSelect from "./ThemedSelect";
import { characterThemes } from "./Characters";
import { CharacterTheme, ContentType, DokiTheme } from "../../themes/DokiTheme";
import { ThemeContext } from "../../themes/DokiThemeProvider";

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
  defaultValue: { value: DokiTheme; label: string },
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
          defaultValue={defaultValue}
          onChange={(selectedCharacter) =>
            setFieldValue("selectedTheme", selectedCharacter!!.value)
          }
        />
      </label>
    </>
  );
}

const SingleModeSettings = () => {
  const [options, defaultChar] = useMemo(() => {
    const characterOptions = characterThemes.map((characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name
    }));
    characterOptions.sort((a, b) => a.label.localeCompare(b.label));
    return [
      characterOptions,
      characterOptions.find((theme) => theme.value.name === "Zero Two")
    ];
  }, []);

  const initialValues: FormValues = {
    character: defaultChar!!.value,
    contentType: ContentType.PRIMARY,
    selectedTheme: defaultChar!!.value.themes[0]
  };

  const dokiTheme = defaultChar!!.value.themes[0];
  const defaultTheme = {
    value: dokiTheme,
    label: createThemeVariantName(dokiTheme)
  };

  return (
    <ThemeContext.Consumer>
      {({setTheme}) =>
        (<>
          <h3>Choose a character</h3>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              setTheme({
                selectedTheme: values.selectedTheme,
                contentType: values.contentType
              })
            }}
          >
            {({ values, handleSubmit, isSubmitting, dirty, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ThemedSelect
                  options={options}
                  defaultValue={defaultChar}
                  onChange={(selectedCharacter) => {
                    const characterValue = selectedCharacter!!.value;
                    setFieldValue("selectedTheme", characterValue.themes[0]);
                    return setFieldValue("character", characterValue);
                  }}
                />

                {values.character.hasMultipleThemes &&
                  getThemeSelector(values, defaultTheme, setFieldValue)}

                {values.character.hasSecondaryContent && (
                  <>
                    <div id="contentTypeGroup">Content Type</div>
                    <div role="group" aria-labelledby="contentTypeGroup">
                      <label>
                        <Field
                          type="radio"
                          name="contentType"
                          value={ContentType.PRIMARY}
                        />
                        Primary
                      </label>
                      <label>
                        <Field
                          type="radio"
                          name="contentType"
                          value={ContentType.SECONDARY}
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
            )}
          </Formik>


        </>)

      }

    </ThemeContext.Consumer>
  );
};

export default SingleModeSettings;
