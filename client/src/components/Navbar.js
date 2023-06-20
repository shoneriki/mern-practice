import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
    navigate("/");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="fixed" sx={{marginBottom: "5rem"}}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: "1", cursor: "pointer" }}>
          Practice Plan
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
            <LinkStyled to="/practice-plan/create">
              Create Practice Plan
            </LinkStyled>
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
