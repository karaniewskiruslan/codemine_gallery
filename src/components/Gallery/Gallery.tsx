import { Button, TextField } from "@mui/material";
import { ImageType } from "codemine_task/types/Image";
import React, { RefObject } from "react";
import GalleryPhoto from "./GalleryPhoto";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  filtered: ImageType[];
  onClickUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSelect: (img: ImageType | null) => void;
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loader: RefObject<HTMLDivElement | null>;
};

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0 },
  show: { opacity: 1 },
};

const Gallery = ({ filtered, onClickUpload, onClickSelect, onChangeSearch, loader }: Props) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-2 items-center justify-between">
        <Button variant="contained" component="label">
          Upload image
          <input hidden multiple type="file" accept="image/png, image/jpeg, image/webp" onChange={onClickUpload} />
        </Button>
        <TextField
          label="Search image"
          variant="outlined"
          size="small"
          sx={{ width: "min(500px,30dvw)" }}
          onChange={onChangeSearch}
        />
      </div>

      <AnimatePresence>
        <motion.ul
          variants={containerVariants}
          animate="show"
          initial="initial"
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 "
        >
          {filtered.map((img) => (
            <motion.li
              key={img.name}
              variants={cardVariants}
              className="hover:scale-105 transition-transform duration-300"
            >
              <GalleryPhoto image={img} onClickSelect={onClickSelect} />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      {/* <div ref={loader} className="h-10" /> */}
    </section>
  );
};

export default Gallery;
