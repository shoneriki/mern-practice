import React, { useState } from "react";
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
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth/login");
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
            />
          </>
        ) : (
          <CssContainer>
            <LinkStyled to="/">Home</LinkStyled>
            <LinkStyled to="/programs">Programs</LinkStyled>
            <LinkStyled to="/program/create">Create Program</LinkStyled>
            <LinkStyled to="/pieces">Pieces</LinkStyled>
            <LinkStyled to="/piece/create">Add/Edit Piece</LinkStyled>
            <LinkStyled to="/practice-plans">Practice Plans</LinkStyled>
            <LinkStyled to="/practice-plan/create">
              Create Practice Plan
            </LinkStyled>
            <LinkStyled to="/workspace">Workspace</LinkStyled>
            <LinkStyled to="/settings">Settings</LinkStyled>
            {!cookies.access_token ? (
              <>
                <Link to="/auth/login">Login</Link>
                <Link to="/auth/register">Register</Link>
              </>
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
