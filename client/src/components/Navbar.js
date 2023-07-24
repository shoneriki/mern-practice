import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { NAVBAR_HEIGHT } from "./constants";

import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

import DrawerComponent from "./Drawer";

const LinkStyled = styled(Link)({
  textDecoration: "none",
  color: "white",
  fontSize: "20px",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: "yellow",
    borderBottom: "1px solid white",
  },
});

const CssContainer = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(10),
  display: "flex",
}));

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token", "username"]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.access_token)

  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const userID = window.localStorage.getItem("userID");
    if (cookies.access_token && userID) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies]);

const logout = () => {
  setCookies("access_token", "", { expires: new Date(0) });
  setCookies("username", "", { expires: new Date(0) });
  window.localStorage.clear();
  navigate("/auth");
};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="fixed" sx={{ marginBottom: NAVBAR_HEIGHT }}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: "1", cursor: "pointer" }}>
          Planner
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              sx={{ color: "white" }}
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              <MenuIcon />
            </IconButton>
            <DrawerComponent
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              logout={logout}
              cookies={cookies}
              isLoggedIn={isLoggedIn}
            />
          </>
        ) : (
          <CssContainer>
            {isLoggedIn && cookies.username && (
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "yellow",
                    borderBottom: "1px solid white",
                  },
                }}
              >
                Welcome, {cookies.username}
              </Typography>
            )}
            <LinkStyled to="/">Home</LinkStyled>
            <LinkStyled to="/programs">Programs</LinkStyled>
            <LinkStyled to="/program/create">Create Program</LinkStyled>
            <LinkStyled to="/pieces">Pieces</LinkStyled>
            <LinkStyled to="/piece/create">Add/Edit Piece</LinkStyled>
            <LinkStyled to="/practiceSessions">Practice Sessions</LinkStyled>
            <LinkStyled to="/practiceSession/create">
              Create Practice Session
            </LinkStyled>
            <LinkStyled to="/workspace">Workspace</LinkStyled>
            <LinkStyled to="/settings">Settings</LinkStyled>
            {!isLoggedIn ? (
              <LinkStyled>
                <Link to="/auth">Login</Link>
                <Link to="/auth">Register</Link>
              </LinkStyled>
            ) : (
              <Button
                id="logout-btn"
                onClick={logout}
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "orange",
                  margin: "auto 0",
                  height: "50%",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </CssContainer>
        )}
      </Toolbar>
    </AppBar>
  );
};
