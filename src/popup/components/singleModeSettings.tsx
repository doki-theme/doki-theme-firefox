import React, { useMemo } from "react";
import { Formik, Field } from "formik";
import ThemedSelect from "./ThemedSelect";
import { characterThemes } from "./Characters";
import { CharacterTheme, ContentType } from "../../themes/DokiTheme";

interface FormValues {
  character: CharacterTheme;
  contentType: ContentType;
}

const SingleModeSettings = () => {
  const [options, defaultChar] = useMemo(() => {
    const characterOptions = characterThemes.map((characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name,
    }));
    characterOptions.sort((a, b) => a.label.localeCompare(b.label));
    return [characterOptions, characterOptions.find(((theme) => theme.value.name === "Zero Two"))];
  }, []);

  const initialValues: FormValues = {
    character: defaultChar!!.value,
    contentType: ContentType.PRIMARY,
  };

  return (
    <div>
      <h3>Choose a character</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, handleSubmit, isSubmitting, dirty, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <ThemedSelect
              options={options}
              defaultValue={defaultChar}
              onChange={(selectedCharacter) =>
                setFieldValue("character", selectedCharacter!!.value)
              }
            />

            {
              values.character.hasSecondaryContent &&
              (<>
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
              </>)
            }
            <button type="submit" disabled={isSubmitting || !dirty}>
              Apply
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default SingleModeSettings;
