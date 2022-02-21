import React, { useEffect, useState } from "react";
import {
  MixedModeSettingsChangedPayload,
  PluginEvent,
  PluginEventTypes,
  ThemePools,
} from "../../Events";
import { Field, Formik } from "formik";
import OptionalPermission = browser._manifest.OptionalPermission;

interface FormValues {
  themePool: ThemePools;
}

const permissions: OptionalPermission[] = ["browserSettings"];
const browserSettingsPermissions = {
  permissions,
};

const DeviceMatchSettings = () => {
  const initialValues: FormValues = {
    themePool: ThemePools.DEFAULT,
  };

  const dispatchDeviceMatchSettingsChanges = (formValues: FormValues) => {
    const mixedModesSettingsChanged: PluginEvent<MixedModeSettingsChangedPayload> =
      {
        type: PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED,
        payload: {
          themePool: formValues.themePool,
        },
      };
    browser.runtime.sendMessage(mixedModesSettingsChanged);
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
        {({ handleSubmit, isSubmitting, dirty, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <>
              <div id="themePoolGroup">Theme Pool</div>
              <div
                role="group"
                aria-labelledby="themePoolGroup"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>
                  <Field
                    type="radio"
                    name="themePool"
                    value={ThemePools.DEFAULT}
                    onChange={() => {
                      setFieldValue("themePool", ThemePools.DEFAULT);
                    }}
                  />
                  All Themes
                </label>
                <label>
                  <Field
                    type="radio"
                    name="themePool"
                    value={ThemePools.DARK}
                    onChange={() => {
                      setFieldValue("themePool", ThemePools.DARK);
                    }}
                  />
                  Dark Only
                </label>
                <label>
                  <Field
                    type="radio"
                    name="themePool"
                    value={ThemePools.LIGHT}
                    onChange={() => {
                      setFieldValue("themePool", ThemePools.LIGHT);
                    }}
                  />
                  Light Only
                </label>
                <label>
                  <Field
                    type="radio"
                    name="themePool"
                    value={ThemePools.MATCH_DEVICE}
                    onChange={() => {
                      setFieldValue("themePool", ThemePools.MATCH_DEVICE);
                    }}
                  />
                  Match Device
                </label>
              </div>
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
