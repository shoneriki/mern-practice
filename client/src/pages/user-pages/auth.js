import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import {Box, Button} from "@mui/material"

import { AuthForm } from "../../components/AuthForm";
import { useControlledValueWithTimezone } from "@mui/x-date-pickers/internals";

export const Auth = () => {
  const [loggedIn,setLoggedIn] = useState(false)
  const [logIn, setLogIn] = useState(true)
  return (
    <Box>
      {logIn ? (
        <Login logIn={logIn} setLogIn={setLogIn} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      ) : (
        <Register logIn={logIn} setLogIn={setLogIn} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
    </Box>
  );
};

const Register = ({setLogIn, logIn, loggedIn, setLoggedIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username,
          password,
        }
      );
      if (result.data.status === 'error') {
        alert(result.data.message);
      } else {
        alert("Registration Completed!");
        setCookies("access_token", result.data.token);
        setCookies("username", username)
        window.localStorage.setItem("userID", result.data.userID);
        setLoggedIn(true)
        navigate("/");
      }
    } catch (error) {
      alert("error: ", error)
      console.error(error);
    }
  };

  return (
    <Box>
      <AuthForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        label="Register"
      />
      <Button variant="contained" color="success" onClick={() => setLogIn(true)}>
        Already have an account? Log in
      </Button>
    </Box>
  );
};

const Login = ({ setLogIn, logIn, loggedIn, setLoggedIn }) => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      if (result.data.message) {
        alert(result.data.message);
      } else {
        setCookies("access_token", result.data.token);
        setCookies("username", username);
        window.localStorage.setItem("userID", result.data.userID);
        setLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <AuthForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        label="Login"
        setLoggedIn={setLoggedIn}
        setLogIn={setLogIn}
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => setLogIn(false)}
      >
        Don't have an account? Register
      </Button>
    </Box>
  );
};
