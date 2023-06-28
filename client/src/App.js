import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import {Spacer} from "./components/Spacer"
import { Auth } from "./pages/auth";
import {Login} from "./pages/login"
import {Register} from "./pages/register"
import { CreateRecipe } from "./pages/create-recipe";
import { Home } from "./pages/home";
import { SavedRecipes } from "./pages/saved-recipes";
import {CreatePracticePlan} from "./pages/create-practice-plan"
import {CreateProgram} from "./pages/create-program"
import { Programs } from "./pages/programs";
import {Workspace} from "./pages/workspace"
import {Settings} from "./pages/settings"
import {NAVBAR_HEIGHT} from "./components/constants"
import { GlobalStyles } from "@mui/system";

import { ThemeProvider, createTheme} from "@mui/material/styles";
import { Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Spacer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="/practice-plan/create"
            element={<CreatePracticePlan />}
          />
          <Route path="/programs" element={<Programs />} />
          <Route path="/program/create" element={<CreateProgram />} />
          <Route path="/program/edit/:id" element={<CreateProgram  />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
