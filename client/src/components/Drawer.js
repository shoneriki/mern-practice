import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@material-ui/icons/Menu";
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
const MyLink = styled("a")({
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
  textAlign: "center",
  "&:hover": {
    backgroundColor: "red",
    cursor: "pointer",
  },
});


function DrawerComponent({logout, cookies}) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <MyListItem
          className={classes.listItem}
          onClick={() => setOpenDrawer(false)}
        >
          <ListItemText>
            <MyLink className={classes.link} to="/">
              Home
            </MyLink>
          </ListItemText>
        </MyListItem>
        <MyListItem
          className={classes.listItem}
          onClick={() => setOpenDrawer(false)}
        >
          <ListItemText>
            <MyLink className={classes.link} to="/create-program">
              Create Program
            </MyLink>
          </ListItemText>
        </MyListItem>
        <MyListItem
          className={classes.listItem}
          onClick={() => setOpenDrawer(false)}
        >
          <ListItemText>
            <MyLink className={classes.link} to="/create-practice-plan">
              Create Practice Plan
            </MyLink>
          </ListItemText>
        </MyListItem>
        {!cookies.access_token ? (
          <>
            <MyListItem
              className={classes.listItem}
              onClick={() => setOpenDrawer(false)}
            >
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
      <IconButton
        sx={{ color: "white" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
