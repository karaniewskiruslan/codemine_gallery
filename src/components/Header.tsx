import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Gallery by{" "}
          <a href="https://github.com/karaniewskiruslan" target="_blank" style={{ color: "inherit", textDecoration: "none" }}>
            Rusłan Karaniewski
          </a>{" "}
          for Codemine
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
