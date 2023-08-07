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
import { PracticeSessionForm } from "../../components/practiceSession-components/PracticeSessionForm";


import {useDispatch, useSelector} from "react-redux";
import {
  setSelectedPieces, addSelectedPiece, removeSelectedPiece
} from '../../redux/piecesSlice';
import {
  setSession,
  addPieceToSession, removePieceFromSession
} from '../../redux/practiceSessionSlice'


export const PracticeSessionCreateEdit = (props) => {

  console.log("PracticeSessionCreateEdit is rendering");

  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.practiceSession.sessions);

  const { id } = useParams();
  const pieces = useSelector((state) => {
    const session = state.practiceSession.sessions[id];
    return session ? session.pieces : [];
  });
  const currentSession = sessions ? sessions[id] : undefined;
  console.log("currentSession", currentSession)

  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

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
    const selectedPiecesFromPiecesList = location.state?.selectedPieces || [];


    const navigate = useNavigate();

    const selectedPieces = useSelector((state) => {
      const session = state.practiceSession.sessions[id];
      return session ? session.pieces : [];
    });

    console.log("selectedPieces currently:", selectedPieces)

useEffect(() => {
  setIsLoading(true);
    const fetchEditData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`
        );
        const practiceSessionData = response.data;
        console.log("practiceSessionData: ", response.data)

        // Fetch pieces for each piece in the practice session;
         const piecesData = await Promise.all(
           practiceSessionData.pieces.map((piece) =>
             axios.get(
               `${process.env.REACT_APP_API_URL}/pieces/piece/${
                 typeof piece === "string" ? piece : piece._id
               }`,
               {
                 headers: { authorization: cookies.access_token },
               }
             )
           )
         ).then((responses) => responses.map((response) => response.data));

        console.log("piecesData", piecesData)
        dispatch(setSession({ sessionId: id, data: practiceSessionData }));
        console.log("practiceSessionData: ", practiceSessionData)

        reset({
          ...practiceSessionData,
          pieces: piecesData,
          dateOfExecution: new Date(practiceSessionData.dateOfExecution),
        });
      } catch (error) {
        console.error("Error fetching the practice session: ", error);
      }
    };


   const fetchSelectedPieces = async () => {
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

       dispatch(
         setSession({
           sessionId: id,
           data: { ...currentSession, pieces: piecesData },
         })
       );


     } catch (error) {
       console.error("Error fetching the selected pieces: ", error);
     }
   };

   if (id && !currentSession) {
     fetchEditData().then(() => {
       setIsLoading(false);
       setDataLoaded(true);
     });
   } else {
     setIsLoading(false);
     setDataLoaded(true);
   }

   if (selectedPiecesFromPiecesList.length) {
     fetchSelectedPieces();
   }

}, [id,selectedPiecesFromPiecesList]);


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
        dispatch(setSession({sessionId: id, data: practiceSessionData}))
        alert("practice session updated");
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
      <PracticeSessionForm
        initialValues={initialValues}
        formValues={currentSession}
        validationSchema={validationSchema}
        id={id}
        cookies={cookies}
        selectedPieces={selectedPieces}
        selectedPiecesFromPiecesList={selectedPiecesFromPiecesList}
        onSubmit={onSubmit}
        useLocation={useLocation}
      />
    </Box>
  );
};
