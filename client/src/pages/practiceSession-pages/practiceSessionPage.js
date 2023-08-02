import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useForm,
  useFieldArray,
  Controller,
  useController,
} from "react-hook-form";
import { useGetUserID } from "../../hooks/useGetUserID";
// import { useForm } from "../../hooks/useForm";

import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import {
  Box,
  Grid,
  Typography,
  InputLabel,
  TextField,
  Autocomplete,
  avatarGroupClasses,
} from "@mui/material";

import { PracticeSessionForm } from "../../components/practiceSession-components/PracticeSessionForm";

export const PracticeSessionCreateEdit = (props) => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    dateOfExecution: new Date(),
    name: "",
    totalSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    pieces: [
      {
        name: "",
        composer: "",
        excerpts: [
          {
            location: "",
            notes: "",
            repetitions: 0,
            timeToSpend: { hours: 0, minutes: 0, seconds: 0 },
            tempi: [
              {
                notes: "",
                bpm: 60,
              },
            ],
          },
        ],
      },
    ],
    runThrough: false,
    pieceLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    userOwner: userID,
  };

  const validationSchema = Yup.object({
    dateOfExecution: Yup.date(),
    name: Yup.string(),
    totalSessionLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    pieces: Yup.array().of(Yup.object().nullable()),
    runThrough: Yup.boolean(),
    runThroughLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    userOwner: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const {
    fields: pieceFields,
    append: appendPiece,
    remove: removePiece,
  } = useFieldArray({
    control,
    name: "pieces",
  });

  const [practiceSession, setPracticeSession] = useState({});
  const [selectedPiece, setSelectedPiece] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("selectedPiece updated", selectedPiece);
  }, [selectedPiece]);

  const [formValues, setFormValues] = useState(initialValues);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [openNewPieceDialog, setOpenNewPieceDialog] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchEditData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`
          );
          const practiceSessionData = response.data;

          // Fetch the piece data
          const pieceResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/pieces/piece/${practiceSessionData.piece._id}`,
            {
              headers: { authorization: cookies.access_token },
            }
          );
          const pieceData = pieceResponse.data;

          setPracticeSession(practiceSessionData);
          setSelectedPiece(pieceData); // Set the selected piece to the fetched piece data

          reset({
            ...practiceSessionData,
            piece: pieceData,
            composer: pieceData.composer,
            excerpts: pieceData.excerpts,
            dateOfExecution: new Date(practiceSessionData.dateOfExecution),
          });

          setIsLoading(false);
          setDataLoaded(true);
        } catch (error) {
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
        }
      } else {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };
    fetchEditData();
  }, [id]);

  const handlePieceSearch = async (searchValue) => {
    if (searchValue) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/pieces/suggestions?search=${searchValue}`
        );
        const pieceSuggestions = response.data;
        setSuggestions(pieceSuggestions);
      } catch (error) {
        console.error("Error while fetching piece suggestions:", error);
      }
    }
  };

  const handlePieceSelection = (event, value) => {
    if (value.isNewPiece) {
      setOpenNewPieceDialog(true);
    }
    reset((prevValues) => ({
      ...prevValues,
      pieces: [...prevValues.pieces, value],
    }));
  };

  const handleAddPiece = () => {
    appendPiece({ ...selectedPiece, excerpts: selectedPiece.excerpts || [] });
    setSelectedPiece({});
  };

  const handleAutocompleteChange = async (event, newValue, pieceIndex) => {
    if (newValue) {
      const pieceData = await axios
        .get(`${process.env.REACT_APP_API_URL}/pieces/piece/${newValue._id}`, {
          headers: { authorization: cookies.access_token },
        })
        .then((response) => response.data);

      console.log("piece data", pieceData);
      setSelectedPiece(pieceData);
      return pieceData;
    } else {
      setValue("totalSessionLength", { hours: 0, minutes: 0, seconds: 0 });
      setValue("composer", "");
      setValue("pieces", []);
      return null;
    }
  };

  const resetSelectedPiece = () => {
    setSelectedPiece({});
  };

  // submitting the practiceSession form; new or edited
  const onSubmit = async (values) => {
    console.log("entering the submit?");
    try {
      const practiceSessionData = {
        ...values,
        pieces: values.pieces.map((piece) => ({
          _id: piece._id,
          excerpts: piece.excerpts.map((excerpt, excerptIndex) => ({
            location: excerpt.location,
            notes: excerpt.notes,
            repetitions: excerpt.repetitions,
            timeToSpend: excerpt.timeToSpend,
            tempi: excerpt.tempi,
            mastered: excerpt.mastered,
          })),
        })),
        dateOfExecution: new Date(values.dateOfExecution),
      };

      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`,
          practiceSessionData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        for (const piece of values.pieces) {
          if (piece._id) {
            await axios.put(
              `${process.env.REACT_APP_API_URL}/pieces/piece/${piece._id}`,
              { ...piece },
              {
                headers: { authorization: cookies.access_token },
              }
            );
          } else {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/pieces`,
              { ...piece },
              { headers: { authorization: cookies.access_token } }
            );
          }
        }
        console.log("Form values on submit: ", values);
        alert("practiceSession updated");
        navigate("/practiceSessions");
      } else {
        console.log("inside the else... for submitting");
        await axios.post(
          `${process.env.REACT_APP_API_URL}/practiceSessions`,
          practiceSessionData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        // Update the piece information whether it's a new practice session or an update
        for (const piece of values.pieces) {
          if (piece._id) {
            await axios.put(
              `${process.env.REACT_APP_API_URL}/pieces/piece/${piece._id}`,
              { ...piece },
              {
                headers: { authorization: cookies.access_token },
              }
            );
          } else {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/pieces`,
              { ...piece },
              { headers: { authorization: cookies.access_token } }
            );
          }
        }
        alert("practiceSession created");
        navigate("/practiceSessions");
      }
    } catch (error) {
      alert("I'm sorry, there's an error in submitting this form");
      console.log("error", error);
    }
  };

  // const errors = {};
  try {
    validationSchema.validateSync(initialValues, { abortEarly: false });
  } catch (validationErrors) {
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
  }

  if (Object.keys(errors).length === 0) {
    console.log("No validation errors.");
  } else {
    console.log("Validation errors:");
    console.log(errors);
  }

  if (isLoading || !dataLoaded) {
    return <section>Loading...</section>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
      }}
    >
      <PracticeSessionForm
        reset={reset}
        initialValues={formValues}
        validationSchema={validationSchema}
        id={id}
        practiceSession={practiceSession}
        cookies={cookies}
        navigate={navigate}
        selectedPiece={selectedPiece}
        suggestions={suggestions}
        handlePieceSearch={handlePieceSearch}
        handlePieceSelection={handlePieceSelection}
        onSubmit={onSubmit}
        handleAutocompleteChange={handleAutocompleteChange}
        formValues={formValues}
        appendPiece={appendPiece}
        resetSelectedPiece={resetSelectedPiece}
      />
    </Box>
  );
};
