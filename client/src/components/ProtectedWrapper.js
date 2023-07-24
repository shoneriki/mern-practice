import React, {useEffect} from 'react';
import { Route, redirect, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";


export const ProtectedWrapper = ({ children }) => {
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate()


  function isAuthenticated() {
    return !!cookies.access_token;
  }

  useEffect(() => {
    if(!isAuthenticated()) {
      navigate(`/auth`)
    }
  },[cookies, navigate])

  if(!isAuthenticated()) {
    return null;
  }

  return children;
};
