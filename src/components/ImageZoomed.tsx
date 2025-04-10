import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOff from "@mui/icons-material/HighlightOff";
import { Image } from "codemine_task/types/Image";

type Props = {
  selected: Image | null;
  onClickUnselect: (img: Image | null) => void;
  onClickDelete: (img: string) => void;
};

const ImageZoomed = ({ selected, onClickUnselect, onClickDelete }: Props) => {
  const [isDeleteClicked, setDeleteClicked] = useState(false);

  return (
    <Dialog open={!!selected} onClose={() => onClickUnselect(null)} maxWidth="md">
      {selected && (
        <div className="p-4 rounded-4xl">
          <p className="text-center">{selected.name}</p>
          <img src={selected.url} alt={selected.name} className="max-w-full max-h-[80vh] rounded-2xl" />
          <div className="flex justify-end mt-2">
            {!isDeleteClicked && (
              <IconButton color="error" onClick={() => setDeleteClicked(true)}>
                <DeleteIcon />
              </IconButton>
            )}
            {isDeleteClicked && (
              <section className="flex items-center gap-2">
                <p>Are you sure?</p>
                <IconButton color="error" onClick={() => onClickDelete(selected.name)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton color="default" onClick={() => setDeleteClicked(false)}>
                  <HighlightOff />
                </IconButton>
              </section>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ImageZoomed;
