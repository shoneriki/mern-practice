import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "axios";

/*
    const validationSchema = Yup.object({
    piece: Yup.string(),
    excerpts: Yup.array(
      Yup.object({
        excerpt: Yup.string(),
        repetitions: Yup.number().min(1).max(100),
        targetTempo: Yup.number().min(10).max(300),
        practiceLength: Yup.object({
          hours: Yup.number().min(0).max(10),
          minutes: Yup.number().min(0).max(59),
          seconds: Yup.number().min(0).max(59),
        }),
        practiceStartDate: Yup.date(),
        daily: Yup.boolean(),
        timesPerWeek: Yup.number().min(1).max(7),
        untilDate: Yup.date(),
        notes: Yup.string(),
      })
    ),
    runThrough: Yup.boolean(),
    runThroughLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    userOwner: Yup.string(),
  });
*/

export const PracticePlanForm = ({
  initialValues,
  validationSchema,
  id,
  practicePlan,
  cookies,
  navigate,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (id) {
            await axios.put(
              `http://localhost:3001/practicePlans/practicePlan/${id}`,
              { ...values },
              {
                headers: { authorization: cookies.access_token },
              }
            );
            alert("practicePlan updated");
            navigate("/practicePlans");
          } else {
            await axios.post(
              `http://localhost:3001/practicePlans`,
              { ...values },
              {
                headers: { authorization: cookies.access_token },
              }
            );
            alert("practicePlan created");
            navigate("/practicePlan");
          }
        } catch (error) {
          alert("I'm sorry, there's an error in submitting this form");
          console.log("error", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, errors }) => (
        <Form name="practicePlan-form">
          <Field name="piece" as={TextField} label="Piece" />

          <FieldArray name="excerpts">
            {({ push, remove }) => (
              <div>
                {values.excerpts.map((excerpt, index) => (
                  <section key={index}>
                    <Field
                      name={`excerpts.${index}.excerpt`}
                      as={TextField}
                      label="Excerpt"
                    />
                    <Field
                      name={`excerpts.${index}.repetitions`}
                      type="number"
                      as={TextField}
                      label="Repetitions"
                    />

                    <Button onClick={() => remove(index)}>
                      Remove excerpt
                    </Button>
                  </section>
                ))}
                <Button onClick={() => push({ excerpt: "", repetitions: 0 })}>
                  Add excerpt
                </Button>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};
