import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/");
  };
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      {/* <Link to="/create-recipe">Create Recipe</Link>
      <Link to="/saved-recipes">Saved Recipes</Link> */}
      <Link to="/create-practice-plan">Create Practice Plan</Link>
      <Link to="/create-program">Create Program</Link>
      {!cookies.access_token ? (
        <>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </>
      ) : (
        <button onClick={logout}> Logout </button>
      )}
    </div>
  );
};
