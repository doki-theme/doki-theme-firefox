import React, { FC } from "react";
import ThemedSelect from "./ThemedSelect";
import { Field } from "formik";
import { CharacterTheme, ContentType, DokiTheme } from "../../themes/DokiTheme";

function createThemeVariantName(theme: DokiTheme) {
  const trimmedVariant = theme.name
    .replace(theme.displayName, "")
    .replace(":", "")
    .trim();
  return trimmedVariant || (theme.dark ? "Dark" : "Light");
}

function getThemeSelector(
  values: any,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  prefix: string,
) {
  const options = values[prefix].character.themes.map((theme: DokiTheme) => ({
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
            value: values[prefix].selectedTheme,
            label: createThemeVariantName(values[prefix].selectedTheme)
          }}
          onChange={(selectedCharacter) =>
            setFieldValue(`${prefix}.selectedTheme`, selectedCharacter!!.value)
          }
        />
      </label>
    </>
  );
}

export type CharacterOption = { label: string; value: CharacterTheme };

interface Props {
  values: any;
  setFieldValue: any;
  prefix: string;
  options: CharacterOption[]
}

const DokiThemeComponent: FC<Props> = ({
  values,
  setFieldValue,
  prefix,
  options,
                            }) => {
  return (
    <div>
      <ThemedSelect
        options={options}
        value={{
          label: values[prefix].character.name,
          value: values[prefix].character
        }}
        onChange={(selectedCharacter) => {
          const characterValue = selectedCharacter!!.value;
          setFieldValue(
            `${prefix}.selectedTheme`,
            characterValue.themes[0]
          );
          return setFieldValue(`${prefix}.character`, characterValue);
        }}
      />

      {values[prefix].character.hasMultipleThemes &&
        getThemeSelector(values, setFieldValue, prefix)}

      {values[prefix].character.hasSecondaryContent && (
        <>
          <div id="contentTypeGroup">Content Type</div>
          <div role="group" aria-labelledby="contentTypeGroup">
            <label>
              <Field
                type="radio"
                name={`${prefix}.contentType`}
                value={ContentType.PRIMARY}
                onChange={() => {
                  setFieldValue(
                    `${prefix}.contentType`,
                    ContentType.PRIMARY
                  );
                }}
              />
              Primary
            </label>
            <label>
              <Field
                type="radio"
                name={`${prefix}.contentType`}
                value={ContentType.SECONDARY}
                onChange={() => {
                  setFieldValue(
                    `${prefix}.contentType`,
                    ContentType.SECONDARY
                  );
                }}
              />
              Secondary
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default DokiThemeComponent;