import React, { useMemo } from "react";
import { Formik } from "formik";
import ThemedSelect from "./ThemedSelect";
import { characterThemes } from "./Characters";

const SingleModeSettings = () => {

  const options = useMemo(() => {
    const characterOptions = characterThemes.map(characterTheme => ({
      value: characterTheme, label: characterTheme.name
    }));
    characterOptions.sort((a, b) => a.label.localeCompare(b.label));
    return characterOptions;
  }, []);

  return (
    <div>
      <h1>Anywhere in your app!</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: any = {};

          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));

            setSubmitting(false);
          }, 400);
        }}
      >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            dirty

            /* and other goodies */
          }) => (
          <form onSubmit={handleSubmit}>

            <ThemedSelect options={options} />

            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />

            {errors.email && touched.email && errors.email}

            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />

            {errors.password && touched.password && errors.password}

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
