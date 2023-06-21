import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Input,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const CustomFormControl = ({ label, id, name, value, onChange }) => (
  <FormControl>
    <FormLabel htmlFor={id}>{label}:</FormLabel>
    <Input
      type="number"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      sx={{ textAlign: "center" }} // Center the input's content
    />
  </FormControl>
);

export const Settings = () => {
  const [defaultSettings, setDefaultSettings] = useState({
    minTime: 5,
    mediumTime: 15,
    longTime: 60,
    totalPracticeTime: 120,
  });

  const update = (name, val) => {
    setDefaultSettings((prevSettings) => ({
      ...prevSettings,
      [name]: val,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(defaultSettings); // Example: Log the defaultSettings on form submit
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography>Default Settings</Typography>
      <form id="defaultSettingsForm" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            width: "100%",
          }}
        >
          <CustomFormControl
            label="Short"
            id="minTime"
            name="minTime"
            value={defaultSettings.minTime}
            onChange={(e) => update(e.target.name, e.target.value)}
          />

          <CustomFormControl
            label="Medium"
            id="mediumTime"
            name="mediumTime"
            value={defaultSettings.mediumTime}
            onChange={(e) => update(e.target.name, e.target.value)}
          />

          <CustomFormControl
            label="Long"
            id="longTime"
            name="longTime"
            value={defaultSettings.longTime}
            onChange={(e) => update(e.target.name, e.target.value)}
          />
          <CustomFormControl
            label="Total Practice Time"
            id="totalPracticeTime"
            name="totalPracticeTime"
            value={defaultSettings.totalPracticeTime}
            onChange={(e) => update(e.target.name, e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "1rem 0",
          }}
        >
          <Button
            sx={{
              backgroundColor: "blue",
              color: "white",
              "&:hover": {
                backgroundColor: "purple",
                cursor: "pointer",
              },
            }}
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};
