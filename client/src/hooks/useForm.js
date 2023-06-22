import { useState } from "react";

export const useForm = ({ initialValues, onValueChange }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    if(onValueChange) {
      onValueChange({ [name]: value})
    }
  };

  const handleValueChange = (newValue) => {
    const transformedValues = onValueChange(newValue);
    setValues({ ...values, ...transformedValues });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    callback(values);
    resetForm();
  };

  return { values, handleChange, resetForm, handleSubmit, handleValueChange };
};
