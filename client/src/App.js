import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
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

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Spacer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />

          <Route path="/pieces" element={<PieceList />} />
          <Route path="/piece/create" element={<AddPieceForm />}/>
          <Route path="/piece/edit/:id" element={<AddPieceForm/>}/>

          <Route path="/practiceSessions" element={<PracticeSessions />}/>
          <Route
            path="/practiceSession/create"
            element={<PracticeSessionCreateEdit />}
          />
          <Route
            path="/practiceSessions/practiceSession/create"
            element={<PracticeSessionCreateEdit />}
          />
          <Route path="/practiceSession/edit/:id" element={<PracticeSessionCreateEdit/>}/>
          <Route path="/practiceSessions/practiceSession/edit/:id" element={<PracticeSessionCreateEdit/>}/>

          <Route path="/programs" element={<ProgramList />} />
          <Route path="/program/create" element={<ProgramCreateEdit />} />
          <Route path="/program/edit/:id" element={<ProgramCreateEdit />} />

          <Route path="/workspace" element={<Workspace />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
