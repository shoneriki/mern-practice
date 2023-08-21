import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import {Box, Button} from "@mui/material"

import { AuthForm } from "../../components/AuthForm";
import { useControlledValueWithTimezone } from "@mui/x-date-pickers/internals";

export const Auth = ({setIsLoggedIn, showLogIn, setShowLogIn}) => {
  return (
    <Box>
      {showLogIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} setShowLogIn={setShowLogIn} />
      ) : (
        <Register setIsLoggedIn={setIsLoggedIn} setShowLogIn={setShowLogIn} />
      )}
    </Box>
  );
};

export const Register = ({setIsLoggedIn, setShowLogIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("entering handleSubmit of register")
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username,
          password,
        }
      );
      console.log("inside the try")
      if (result.data.status === 'error') {
        alert(result.data.message);
      } else {
        alert("Registration Completed!");
        setCookies("access_token", result.data.token);
        setCookies("username", username)
        window.localStorage.setItem("userID", result.data.userID);
        console.log("inside handlesubmit?")
        setIsLoggedIn(true)
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
        setIsLoggedIn={setIsLoggedIn}
      />
      <Button variant="contained" color="success" onClick={() => setShowLogIn(true)}>
        Already have an account? Log in
      </Button>
    </Box>
  );
};

export const Login = ({ setIsLoggedIn, setShowLogIn }) => {
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
        setIsLoggedIn(true);
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
        setIsLoggedIn={setIsLoggedIn}
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => setShowLogIn(false)}
      >
        Don't have an account? Register
      </Button>
    </Box>
  );
};
