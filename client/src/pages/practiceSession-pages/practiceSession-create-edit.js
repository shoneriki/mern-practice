import React, { useState, useEffect, useMemo } from "react";
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
  addPieceToSession,
  removePieceFromSession,
  setTempSession,
  addPieceToTempSession,
  removePieceFromTempSession,
} from "../../redux/practiceSessionSlice";


export const PracticeSessionCreateEdit = (props) => {

    const userID = useGetUserID();
    const [cookies, _] = useCookies(["access_token"]);

    const [isLoading, setIsLoading] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);


  console.log("PracticeSessionCreateEdit is rendering");

  const dispatch = useDispatch();

  const { id } = useParams();

  const initialValues = {
    dateOfExecution: new Date().toISOString(),
    name: "",
    totalSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    pieces: [],
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

const currentSession = useSelector((state) => {
  if (id) {
    return state.practiceSession.sessions[id];
  } else {
    return state.practiceSession.tempSession;
  }
});

  console.log("currentSession", currentSession)

  const defaultValues = useMemo(() => currentSession, [currentSession])

  console.log("defaultValues?!", defaultValues)
  const {
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const values = watch();


  // const formValues = reset(); // Get the current form values

useEffect(() => {
  if (!id) {
    dispatch(setTempSession({ data: initialValues }));
  }
}, [dispatch]);


useEffect(() => {
  if (currentSession) {
    console.log("currentSession inside the useEffect",currentSession)
    reset(currentSession);
  }
}, [currentSession, reset]);

  const navigate = useNavigate();


  // const selectedPieces = useSelector((state) => {
  //   const sessionId = state.practiceSession.practiceSessionId;
  //   return sessionId
  //     ? state.practiceSession.sessions[sessionId].pieces
  //     : state.practiceSession.tempSession.pieces;
  // });

  // const selectedPieces = useSelector((state) => {
  //   const sessionId = state.practiceSession.practiceSessionId;
  //   const session = state.practiceSession.sessions[sessionId];
  //   const tempSession = state.practiceSession.tempSession;
  //   return sessionId && session
  //     ? session.pieces
  //     : tempSession
  //     ? tempSession.pieces
  //     : [];
  // });

  const selectedPieces = currentSession ? currentSession.pieces : [];


  console.log("selectedPieces currently:", selectedPieces)
  // console.log("selectedPiecesFromPiecesList", selectedPiecesFromPiecesList)

useEffect(() => {
  setIsLoading(true);
    const fetchEditData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`
        );
        const practiceSessionData = JSON.parse(JSON.stringify(response.data));

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
          pieces: [...piecesData],
          dateOfExecution: new Date(practiceSessionData.dateOfExecution),
        });
      } catch (error) {
        console.error("Error fetching the practice session: ", error);
      }
    };


   const fetchSelectedPieces = async () => {
     try {
       const piecesData = await Promise.all(
         selectedPieces.map((pieceId) =>
           axios.get(
             `${process.env.REACT_APP_API_URL}/pieces/piece/${pieceId}`,
             {
               headers: { authorization: cookies.access_token },
             }
           )
         )
       ).then((responses) => responses.map((response) => response.data));

       console.log("piecesData", piecesData)

       if(!id) {
        const updatedTempSession = {
          ...currentSession,
          pieces: piecesData,
        };
        dispatch(setTempSession({data: updatedTempSession}))
       } else {
         dispatch(
           setSession({
             sessionId: id,
             data: { ...currentSession, pieces: piecesData },
           })
         );
       }
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

   if (selectedPieces.length) {
     fetchSelectedPieces();
   }

}, [
  id,
  // selectedPiecesFromPiecesList
]
);

  const onSubmit = async (values) => {
    try {
      const practiceSessionData = {
        ...values,
        dateOfExecution: new Date(values.dateOfExecution),
        pieces: selectedPieces
          .filter((piece) => piece !== null)
          .map((piece) => piece._id),
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
        cookies={cookies}
        currentSession={currentSession}
        defaultValues={defaultValues}
        id={id}
        initialValues={initialValues}
        onSubmit={onSubmit}
        selectedPieces={selectedPieces}
        // selectedPiecesFromPiecesList={selectedPiecesFromPiecesList}
        useLocation={useLocation}
        validationSchema={validationSchema}
        values={values}
      />
    </Box>
  );
};
