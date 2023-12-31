import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { NAVBAR_HEIGHT } from "./constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";



import {
  AppBar,
  Box,
  Menu,
  MenuItem,
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
  alignItems: "center",
}));

const chevronDown = (
  <FontAwesomeIcon icon={faChevronDown} sx={{ color: "white" }} />
);

export const DropdownMenu = ({ title, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        color: "white",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="text"
        color="success"
        onClick={handleClick}
        sx={{ color: "white", margin: "auto" }}
      >
        {title}
        {chevronDown}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {items.map((item, itemIndex) => (
          <MenuItem
            onClick={handleClose}
            key={itemIndex}
            sx={{
              color: "black",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                color: "yellow",
                borderBottom: "1px solid white",
              },
            }}
          >
            <Link
              to={item.path}
              style={{
                color: "black",
                fontSize: "1em",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  color: "yellow",
                  borderBottom: "1px solid white",
                },
              }}
            >
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export const Navbar = ({isLoggedIn, setIsLoggedIn, showLogIn, setShowLogIn}) => {
  const [cookies, setCookies] = useCookies(["access_token", "username"]);
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLoginClick = () => {
    setShowLogIn(true);
  };

  const handleRegisterClick = () => {
    setShowLogIn(false);
  };

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
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const iconDisplay = useMediaQuery("(max-width:1000px)");

  return (
    <AppBar
      position="fixed"
      sx={{
        display: "flex",
        alignItems: "center",
        top: isMobile ? "auto" : 0,
        bottom: isMobile ? 0 : "auto",
      }}
    >
      <Toolbar
        name="toolbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: isLoggedIn ? "blue" : "gray",
        }}
      >
        <Typography variant="h4" sx={{ cursor: "pointer" }}>
          Planner
        </Typography>
        {iconDisplay ? (
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
              setIsLoggedIn={setIsLoggedIn}
              showLogIn={showLogIn}
              setShowLogIn={setShowLogIn}
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
            {isLoggedIn && (
              <>
                <LinkStyled to="/">Home</LinkStyled>
                <DropdownMenu
                  title="Programs"
                  items={[
                    { label: "All Programs", path: "/programs" },
                    { label: "Add Program", path: "/program/create" },
                  ]}
                />
                <DropdownMenu
                  title="Practice Sessions"
                  items={[
                    {
                      label: "All Practice Sessions",
                      path: "/practiceSessions",
                    },
                    {
                      label: "Add Practice Session",
                      path: "/practiceSession/create",
                    },
                  ]}
                />
                <DropdownMenu
                  title="Pieces"
                  items={[
                    { label: "All Pieces", path: "/pieces" },
                    {
                      label: "Add A Piece",
                      path: "/piece/create",
                    },
                  ]}
                />
                <LinkStyled to="/workspace">Workspace</LinkStyled>
                <LinkStyled to="/settings">Settings</LinkStyled>
              </>
            )}
            {!isLoggedIn ? (
              <>
                <LinkStyled onClick={handleLoginClick}>
                  <Link to="/auth">Login</Link>
                </LinkStyled>
                <LinkStyled onClick={handleRegisterClick}>
                  <Link to="/auth">Register</Link>
                </LinkStyled>
              </>
            ) : (
              <LinkStyled id="logout-btn" onClick={logout} href="/auth">
                Logout
              </LinkStyled>
            )}
          </CssContainer>
        )}
      </Toolbar>
    </AppBar>
  );
};
