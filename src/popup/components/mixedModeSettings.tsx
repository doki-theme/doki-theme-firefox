import { Field, Formik } from "formik";
import React from "react";
import {
  MixedModeSettingsChangedPayload,
  PluginEvent,
  PluginEventTypes,
  ThemePools,
} from "../../Events";

interface FormValues {
  themePool: ThemePools;
}

const MixedModeSettings = () => {
  const initialValues: FormValues = {
    themePool: ThemePools.DEFAULT,
  };

  const dispatchMixedModeSettingsChanges = (formValues: FormValues) => {
    const mixedModesSettingsChanged: PluginEvent<MixedModeSettingsChangedPayload> =
      {
        type: PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED,
        payload: {
          themePool: formValues.themePool,
        },
      };
    browser.runtime.sendMessage(mixedModesSettingsChanged);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          dispatchMixedModeSettingsChanges(values);

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

export default MixedModeSettings;
