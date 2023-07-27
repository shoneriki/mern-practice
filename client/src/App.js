import React, {useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useCookies } from "react-cookie";
import "./App.css";
import {ProtectedWrapper} from "./components/ProtectedWrapper"
import { Navbar } from "./components/Navbar";
import { Spacer } from "./components/Spacer";
import { Auth } from "./pages/user-pages/auth";
import { Home } from "./pages/home";

import AddPieceForm from "./pages/piece-pages/create-edit-piece"
import {PieceList} from "./components/piece-components/PieceList"

import { PracticeSessionCreateEdit } from "./pages/practiceSession-pages/practiceSession-create-edit";
import {PracticeSessions} from "./pages/practiceSession-pages/practiceSessions"

import { ProgramCreateEdit } from "./pages/program-pages/program-create-edit";
import { Programs } from "./pages/program-pages/programs";

import { Workspace } from "./pages/workspace";
import { Settings } from "./pages/settings";
import { NAVBAR_HEIGHT } from "./components/constants";
import { GlobalStyles } from "@mui/system";

import { ProgramList } from "./components/program-components/ProgramList";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { ProgramsProvider } from "./contexts/ProgramsContext";
import { PiecesProvider } from "./contexts/PiecesContext";
import { faLinesLeaning } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [cookies, setCookies] = useCookies(["access_token", "username"]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.access_token);

  useEffect(() => {
    const userID = window.localStorage.getItem("userID");
    cookies.access_Token && userID ?  setIsLoggedIn(true) : setIsLoggedIn(false)
  }, [cookies])

  return (
    <section className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Spacer />
        <ProgramsProvider>
          <PiecesProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedWrapper>
                    <Home />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/pieces"
                element={
                  <ProtectedWrapper>
                    <PieceList />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/piece/create"
                element={
                  <ProtectedWrapper>
                    <AddPieceForm />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/piece/edit/:id"
                element={
                  <ProtectedWrapper>
                    <AddPieceForm />
                  </ProtectedWrapper>
                }
              />

              <Route
                path="/practiceSessions"
                element={
                  <ProtectedWrapper>
                    <PracticeSessions />
                  </ProtectedWrapper>
                }
              />

              <Route
                path="/practiceSession/create"
                element={
                  <ProtectedWrapper>
                    <PracticeSessionCreateEdit />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/practiceSession/edit/:id"
                element={
                  <ProtectedWrapper>
                    <PracticeSessionCreateEdit />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/practiceSessions/practiceSession/edit/:id"
                element={
                  <ProtectedWrapper>
                    <PracticeSessionCreateEdit />
                  </ProtectedWrapper>
                }
              />

              <Route
                path="/programs"
                element={
                  <ProtectedWrapper>
                    <Programs />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/program/create"
                element={
                  <ProtectedWrapper>
                    <ProgramCreateEdit />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/program/edit/:id"
                element={
                  <ProtectedWrapper>
                    <ProgramCreateEdit />
                  </ProtectedWrapper>
                }
              />

              <Route
                path="/workspace"
                element={
                  <ProtectedWrapper>
                    <Workspace />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/workspace/:id"
                element={
                  <ProtectedWrapper>
                    <Workspace />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedWrapper>
                    <Settings />
                  </ProtectedWrapper>
                }
              />
            </Routes>
          </PiecesProvider>
        </ProgramsProvider>
      </Router>
    </section>
  );
}

export default App;
