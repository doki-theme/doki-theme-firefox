import React, { useEffect, useMemo, useState } from "react";
import { ThemePools } from "../../Events";
import { Field, Formik } from "formik";
import { createCharacterThemes } from "./Characters";
import DokiThemeDefinitions from "../../DokiThemeDefinitions";
import {
  CharacterTheme,
  ContentType,
  DokiTheme,
  DokiThemeDefinition,
} from "../../themes/DokiTheme";
import DokiThemeComponent, { CharacterOption } from "./DokiThemeComponent";
import OptionalPermission = browser._manifest.OptionalPermission;

interface FormValues {
  dark: {
    character: CharacterTheme;
    contentType: ContentType;
    selectedTheme: DokiTheme;
  };
  light: {
    character: CharacterTheme;
    contentType: ContentType;
    selectedTheme: DokiTheme;
  };
}

const permissions: OptionalPermission[] = ["browserSettings"];
const browserSettingsPermissions = {
  permissions,
};

function createDeviceOption(
  dokiDefs: DokiThemeDefinition[]
): CharacterOption[] {
  const lightCharacterOptions = createCharacterThemes(dokiDefs).map(
    (characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name,
    })
  );
  lightCharacterOptions.sort((a, b) => a.label.localeCompare(b.label));
  return lightCharacterOptions;
}

const DeviceMatchSettings = () => {
  const {
    darkCharacterOptions,
    lightCharacterOptions,
  }: {
    darkCharacterOptions: CharacterOption[];
    lightCharacterOptions: CharacterOption[];
  } = useMemo(() => {
    const lightCharacterOptions = createDeviceOption(
      Object.values(DokiThemeDefinitions).filter((def) => !def.information.dark)
    );
    const darkCharacterOptions = createDeviceOption(
      Object.values(DokiThemeDefinitions).filter((def) => def.information.dark)
    );
    return {
      lightCharacterOptions,
      darkCharacterOptions,
    };
  }, []);

  const initialValues: FormValues = {
    dark: {
      character: darkCharacterOptions[0]!!.value,
      contentType: ContentType.PRIMARY,
      selectedTheme: darkCharacterOptions[0]!!.value.themes[0],
    },
    light: {
      character: lightCharacterOptions[0]!!.value,
      contentType: ContentType.PRIMARY,
      selectedTheme: lightCharacterOptions[0]!!.value.themes[0],
    },
  };

  const dispatchDeviceMatchSettingsChanges = (formValues: FormValues) => {
    // const mixedModesSettingsChanged: PluginEvent<MixedModeSettingsChangedPayload> =
    //   {
    //     type: PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED,
    //     payload: {
    //       themePool: formValues.themePool,
    //     },
    //   };
    // browser.runtime.sendMessage(mixedModesSettingsChanged);
  };

  const [initialized, setInitialized] = useState(false);
  const [hasSettingsPermission, setHasSettingsPermissions] = useState(false);

  useEffect(() => {
    browser.permissions.contains(browserSettingsPermissions).then((granted) => {
      setHasSettingsPermissions(granted);
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return <></>;
  }

  const grantPermission = () => {
    browser.permissions
      .request(browserSettingsPermissions)
      .then((granted) => setHasSettingsPermissions(granted));
  };

  if (initialized && !hasSettingsPermission) {
    return (
      <div>
        <p>
          The Doki Theme needs your permission to <br />
          modify your browser settings to <br />
          match the "System" setting, for this feature to work.
        </p>
        <button onClick={grantPermission}>Allow Access</button>
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          dispatchDeviceMatchSettingsChanges(values);

          formikHelpers.resetForm({
            values: values,
          });
        }}
      >
        {({ values, handleSubmit, isSubmitting, dirty, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <>
              <div>Light Theme</div>
              <DokiThemeComponent
                values={values}
                options={lightCharacterOptions}
                prefix={"light"}
                setFieldValue={setFieldValue}
              />

              <div>Dark Theme</div>
              <DokiThemeComponent
                values={values}
                options={darkCharacterOptions}
                prefix={"dark"}
                setFieldValue={setFieldValue}
              />


              <button type="submit" disabled={isSubmitting || !dirty}>
                Apply
              </button>
            </>
          </form>
        )}
      </Formik>
    </>
  );
};

export default DeviceMatchSettings;
