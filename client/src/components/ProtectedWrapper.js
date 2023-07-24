import React from 'react';
import { Route, redirect, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";


export const ProtectedWrapper = ({ children }) => {
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate()
  function isAuthenticated() {
    // Check if the access_token cookie is present
    return !!cookies.access_token;
  }

  if(!isAuthenticated()) {
    navigate(`/auth/register`)
    return null;
  }

  return children;
};
