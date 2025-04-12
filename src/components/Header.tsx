import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">ImageType Gallery</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
