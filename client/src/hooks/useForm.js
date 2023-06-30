import { useState } from "react";

export const useForm = ({ initialValues, onValueChange }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    if(onValueChange) {
      onValueChange({ [name]: value})
      console.log("[name]: value", name, value)
    }
  };

  const handleChangeNested = (event, fieldName, index) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: prevValues[fieldName].map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleChangeDeeplyNested = (
    event,
    fieldName,
    index,
    innerFieldName,
    innerIndex
  ) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: prevValues[fieldName].map((item, i) =>
        i === index
          ? {
              ...item,
              [innerFieldName]: item[innerFieldName].map((innerItem, j) =>
                j === innerIndex ? { ...innerItem, [name]: value } : innerItem
              ),
            }
          : item
      ),
    }));
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

  return {
    values,
    handleChange,
    resetForm,
    handleSubmit,
    handleValueChange,
    handleChangeNested,
    handleChangeDeeplyNested,
  };
};
