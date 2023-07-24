import React from "react";
import {
  Drawer,
  ListItemText,
  Typography,
} from "@mui/material";
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

function DrawerComponent({ open, onClose, logout, cookies, isLoggedIn  }) {
  const classes = useStyles();
  return (
    <Drawer open={open} onClose={onClose}>
      {cookies.username && (
        <Typography variant="h6">Welcome, {cookies.username}</Typography>
      )}
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/">
            Home
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/programs">
            Programs
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
          <MyLink className={classes.link} to="/pieces">
            Pieces
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/piece/create">
            Add/Edit Piece
          </MyLink>
        </ListItemText>
      </MyListItem>

      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/practiceSession/create">
            Create Practice Session
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/practiceSessions">
            Practice Sessions
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/workspace">
            Workspace
          </MyLink>
        </ListItemText>
      </MyListItem>
      <MyListItem className={classes.listItem} onClick={onClose}>
        <ListItemText>
          <MyLink className={classes.link} to="/settings">
            Settings
          </MyLink>
        </ListItemText>
      </MyListItem>
      {!isLoggedIn ? (
        <>
          <MyListItem className={classes.listItem} onClick={onClose}>
            <ListItemText>
              <MyLink className={classes.link} to="/auth">
                Login
              </MyLink>
            </ListItemText>
          </MyListItem>
          <MyListItem className={classes.listItem}>
            <ListItemText>
              <MyLink className={classes.link} to="/auth">
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
