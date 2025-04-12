import { BottomNavigation, Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2 !important",
        padding: "10px !important",
        color: "white",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <a
        href="https://github.com/karaniewskiruslan"
        target="_blank"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        This is a recruitment task for Codemine, made by Rusłan Karaniewski
      </a>
    </Box>
  );
};

export default Footer;
