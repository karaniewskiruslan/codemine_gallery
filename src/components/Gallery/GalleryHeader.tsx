import { Button, TextField } from "@mui/material";
import React from "react";

type Props = {
  onClickUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const GalleryHeader = ({ onClickUpload, onChangeSearch }: Props) => {
  return (
    <div className="flex gap-2 items-center justify-between">
      <Button variant="contained" component="label">
        Upload image
        <input
          hidden
          multiple
          type="file"
          accept="image/png, image/jpeg, image/webp, image/heck"
          onChange={onClickUpload}
        />
      </Button>
      <TextField
        label="Search image"
        variant="filled"
        size="small"
        sx={{ width: "min(275px,50dvw)" }}
        onChange={onChangeSearch}
      />
    </div>
  );
};

export default GalleryHeader;
