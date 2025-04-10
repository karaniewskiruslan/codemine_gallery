import { Button, Card, CardMedia, TextField } from "@mui/material";
import { Image } from "codemine_task/types/Image";
import React, { RefObject } from "react";

type Props = {
  filtered: Image[];
  onClickUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onClickSelect: (img: Image | null) => void;
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loader: RefObject<HTMLDivElement | null>;
};

const Gallery = ({ filtered, onClickUpload, onClickSelect, onChangeSearch, loader }: Props) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-2 items-center justify-between">
        <Button variant="contained" component="label">
          Upload image
          <input hidden multiple type="file" onChange={onClickUpload} />
        </Button>
        <TextField
          label="Search image"
          variant="outlined"
          size="small"
          sx={{ width: "min(500px,30dvw)" }}
          onChange={onChangeSearch}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {filtered.map((img) => (
          <Card key={img.name} onClick={() => onClickSelect(img)} sx={{ borderRadius: "1.25rem", aspectRatio: "1/1" }}>
            <CardMedia
              component="img"
              image={img.url}
              alt={img.name}
              sx={{
                height: "100% !important",
              }}
            />
          </Card>
        ))}
      </div>

      <div ref={loader} className="h-10" />
    </section>
  );
};

export default Gallery;
