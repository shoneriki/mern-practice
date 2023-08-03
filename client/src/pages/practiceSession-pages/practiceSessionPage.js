import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useForm,
} from "react-hook-form";
import { useGetUserID } from "../../hooks/useGetUserID";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
} from "@mui/material";
import { NewPracticeSession } from "../../components/practiceSession-components/NewPracticeSession";

export const PracticeSession = (props) => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const { id } = useParams();

    const [practiceSession, setPracticeSession] = useState({});
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);


  const initialValues = {
    dateOfExecution: new Date(),
    name: "",
    totalSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    pieces: [{}],
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
    userOwner: Yup.string(),
  });

  const {
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

    const location = useLocation();
    const selectedPiecesFromPiecesList = location.state?.selectedPieces;

    const navigate = useNavigate();

     useEffect(() => {
       setIsLoading(true);
       const fetchEditData = async () => {
         if (id) {
           try {
             const response = await axios.get(
               `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`
             );
             const practiceSessionData = response.data;

             console.log("response.data from useEffect for fetchEditData: ", response.data)

             // Fetch pieces for each piece in the practice session
             const piecesData = await Promise.all(
               practiceSessionData.pieces.map((piece) =>
                 axios.get(
                   `${process.env.REACT_APP_API_URL}/pieces/piece/${piece._id}`,
                   {
                     headers: { authorization: cookies.access_token },
                   }
                 )
               )
             ).then((responses) => responses.map((response) => response.data));

             setPracticeSession(practiceSessionData);
             setSelectedPieces(piecesData); // Set the selected pieces

             reset({
               ...practiceSessionData,
               pieces: piecesData,
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

    useEffect(() => {
      const fetchSelectedPieces = async () => {
        if (selectedPiecesFromPiecesList) {
          console.log(
            "selectedPieces carried over from pieces list",
            selectedPiecesFromPiecesList
          );

          try {
            const piecesData = await Promise.all(
              selectedPiecesFromPiecesList.map((pieceId) =>
                axios.get(
                  `${process.env.REACT_APP_API_URL}/pieces/piece/${pieceId}`,
                  {
                    headers: { authorization: cookies.access_token },
                  }
                )
              )
            ).then((responses) => responses.map((response) => response.data));

            setSelectedPieces(piecesData);

            // localStorage.setItem('selectedPieces', JSON.stringify(piecesData))
          } catch (error) {
            console.error(
              "I'm sorry there was a problem fetching the pieces from the pieces list: ",
              error
            );
          }
        }
      };

      fetchSelectedPieces();
    }, [selectedPiecesFromPiecesList]);

    // useEffect(() => {
    //   // const savedPieces = localStorage.getItem("selectedPieces");

    //   // if (savedPieces) {
    //   //   setSelectedPieces(JSON.parse(savedPieces));
    //   // }
    // }, []);

  const onSubmit = async (values) => {
    try {
      const practiceSessionData = {
        ...values,
        pieces: selectedPieces
          .filter((piece) => piece !== null)
          .map((piece) => piece._id),
        dateOfExecution: new Date(values.dateOfExecution),
        userOwner: userID,
      };

      console.log("userID from submit", userID);

      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`,
          practiceSessionData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        console.log("Form values on submit: ", values);
        alert("practiceSession updated");
      } else {
        console.log("inside the else... for submitting");
        await axios.post(
          `${process.env.REACT_APP_API_URL}/practiceSessions`,
          practiceSessionData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("practiceSession created");
      }
      navigate("/practiceSessions");
    } catch (error) {
      alert("I'm sorry, there's an error in submitting this form");
      console.log("error", error);
    }
  };



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
      <NewPracticeSession
        initialValues={initialValues}
        formValues={practiceSession}
        validationSchema={validationSchema}
        id={id}
        practiceSession={practiceSession}
        cookies={cookies}
        selectedPieces={selectedPieces}
        setSelectedPieces={setSelectedPieces}
        onSubmit={onSubmit}
        useNavigate={useNavigate}
        useLocation={useLocation}
      />
    </Box>
  );
};
