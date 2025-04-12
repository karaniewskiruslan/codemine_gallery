import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Close from "@mui/icons-material/Close";
import { ImageType } from "codemine_task/types/Image";
import Image from "next/image";

type Props = {
  selected: ImageType | null;
  onClickUnselect: (img: ImageType | null) => void;
  onClickDelete: (img: string) => void;
};

const ImageZoomed = ({ selected, onClickUnselect, onClickDelete }: Props) => {
  const [isDeleteClicked, setDeleteClicked] = useState(false);

  const exitModal = () => {
    onClickUnselect(null);
    setDeleteClicked(false);
  };

  const handleClickDeleteImage = (img: string) => {
    onClickUnselect(null);
    setDeleteClicked(false);
    onClickDelete(img);
  };

  return (
    <Dialog open={!!selected} onClose={exitModal} maxWidth="md">
      {selected && (
        <div className="p-4 rounded-4xl relative flex flex-col lg:gap-4 gap-2">
          <p className="text-center">{selected.name}</p>
          <div className="relative">
            <img src={selected.url} alt={selected.name} className="max-w-full max-h-[75dvh] rounded-2xl" />
          </div>
          <div className="flex justify-end">
            {!isDeleteClicked && (
              <IconButton color="error" onClick={() => setDeleteClicked(true)}>
                <DeleteIcon />
              </IconButton>
            )}
            {isDeleteClicked && (
              <section className="flex items-center gap-2">
                <p>Are you sure?</p>
                <IconButton color="error" onClick={() => handleClickDeleteImage(selected.name)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton color="default" onClick={() => setDeleteClicked(false)}>
                  <HighlightOff />
                </IconButton>
              </section>
            )}
          </div>
          <IconButton color="error" onClick={exitModal} sx={{ position: "absolute", top: 0, right: 8 }}>
            <Close />
          </IconButton>
        </div>
      )}
    </Dialog>
  );
};

export default ImageZoomed;
