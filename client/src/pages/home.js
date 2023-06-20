import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";
import { ScheduledCalendar } from "../components/Calendar";

export const Home = () => {
  // const [recipes, setRecipes] = useState([]);
  // const [savedRecipes, setSavedRecipes] = useState([]);

  const userID = useGetUserID();

  const [programs, setPrograms] = useState([]);


  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3001/recipes");
  //       setRecipes(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // })

    useEffect(() => {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get("http://localhost:3001/programs");
          setPrograms(response.data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchPrograms()
  }, []);

  //   const fetchSavedRecipes = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
  //       );
  //       setSavedRecipes(response.data.savedRecipes);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchRecipes();
  //   fetchSavedRecipes();
  // }, []);

  // const saveRecipe = async (recipeID) => {
  //   try {
  //     const response = await axios.put("http://localhost:3001/recipes", {
  //       recipeID,
  //       userID,
  //     });
  //     setSavedRecipes(response.data.savedRecipes);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const isRecipeSaved = (id) => savedRecipes.includes(id);



  return (
    <section className="container">
      <section id="calendar">
        <ScheduledCalendar/>
      </section>
      <h1>Impending Programs</h1>
      <ul>
        {programs.map((program) => {
          return (
            <li key={program._id}>
              <section>
                <h2>{program.name}</h2>
                <h2>
                  Date: {format(new Date(program.date), "MMMM do, yyyy 'at' H:mm")}
                </h2>
                <div>
                  {program.pieces.map((piece, index) => {
                    const {
                      hours: pieceHours,
                      minutes: pieceMinutes,
                      seconds: pieceSeconds,
                    } = piece.length;
                    return (
                      <div className="piece-display" key={piece._id}>
                        <p>
                          Piece {index + 1}: {piece.name}
                        </p>
                        <p>
                          Piece {index + 1} Composer: {piece.composer}
                        </p>
                        <p>
                          Piece {index + 1} Length: {pieceHours}hr:{" "}
                          {pieceMinutes}min: {pieceSeconds}sec
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p>Intermission: {program.intermission} minutes</p>
                <p>
                  Length: {program.length.hours}hr: {program.length.minutes}min:{" "}
                  {program.length.seconds}sec
                </p>
              </section>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
