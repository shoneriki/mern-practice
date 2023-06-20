import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

const useStyles = styled(() => ({
  icon: {
    color: "white",
  },
}));

const MyListItem = styled("article")({
  border: "none",
  backgroundColor: "transparent",
});
const MyLink = styled(Link)({
  textDecoration: "none",
  color: "blue",
  fontSize: "20px",
  width: "100%",
});
const LogoutBtn = styled("btn")({
  color: "white",
  backgroundColor: "orange",
  border: "none",
  borderRadius: ".25rem",
  padding: ".35rem .5rem",
  width: "60%",
  margin: "0 auto",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "red",
    cursor: "pointer",
  },
});

function DrawerComponent({ open, onClose, logout, cookies }) {
  const classes = useStyles();
  return (
    <Drawer open={open} onClose={onClose}>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/">
            Home
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/program/create">
            Create Program
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/practice-plan/create">
            Create Practice Plan
          </MyLink>
        </ListItemText>
      </MyListItem>
      {!cookies.access_token ? (
        <>
          <MyListItem className={classes.listItem} onClick={onClose}>
            <ListItemText>
              <MyLink className={classes.link} to="/auth/login">
                Login
              </MyLink>
            </ListItemText>
          </MyListItem>
          <MyListItem className={classes.listItem}>
            <ListItemText>
              <MyLink className={classes.link} to="/auth/register">
                Register
              </MyLink>
            </ListItemText>
          </MyListItem>
        </>
      ) : (
        <LogoutBtn id="logout-btn" onClick={logout} variant="contained">
          Logout
        </LogoutBtn>
      )}
    </Drawer>
  );
}
export default DrawerComponent;
