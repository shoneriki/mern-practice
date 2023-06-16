import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

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
  });

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
    <div>
      <h1>Impending Programs</h1>
      <ul>
        {programs.map((program) => {
          return (
            <li key={program._id}>
              <section>
                <h2>{program.name}</h2>
                <div>
                  {program.pieces.map((piece, index) => {
                    return (
                      <div key={piece._id}>
                        <p>Piece {index + 1}: {piece.name}</p>
                        <p>Composer: {piece.composer}</p>
                        <p>
                          {(() => {
                            const hours = Math.floor(
                              piece.lengthInSeconds / 3600
                            );
                            const minutes = Math.floor(
                              (piece.lengthInSeconds % 3600) / 60
                            );
                            const seconds = piece.lengthInSeconds % 60;

                            return `Length: ${hours}hr: ${minutes}min: ${seconds}sec`;
                          })()}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p>Intermission: {program.intermission} minutes</p>
                <p>Length: {program.length}</p>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
