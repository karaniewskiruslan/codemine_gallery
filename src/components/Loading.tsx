import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <CircularProgress />
    </div>
  );
};

export default Loading;
