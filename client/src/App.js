import React, { } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import {ProtectedWrapper} from "./components/ProtectedWrapper"
import { Navbar } from "./components/Navbar";
import { Spacer } from "./components/Spacer";
import { Auth } from "./pages/user-pages/auth";
import { Login } from "./pages/user-pages/login";
import { Register } from "./pages/user-pages/register";
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

function App() {
  return (
    <section className="App">
      <Router>
        <Navbar />
        <Spacer />
        <ProgramsProvider>
          <PiecesProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />

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
              <Route path="/piece/create" element={<ProtectedWrapper>
                <AddPieceForm/>
              </ProtectedWrapper>}

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
