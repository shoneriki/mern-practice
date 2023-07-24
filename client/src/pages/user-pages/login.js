import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { AuthForm } from "../../components/AuthForm";

export const Login = () => {
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
        window.localStorage.setItem("userID", result.data.userID);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      label="Login"
    />
  );
};
