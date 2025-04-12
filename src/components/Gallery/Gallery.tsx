import { Button, TextField } from "@mui/material";
import { ImageType } from "codemine_task/types/Image";
import React, { RefObject } from "react";
import GalleryPhoto from "./GalleryPhoto";
import { AnimatePresence, motion } from "framer-motion";
import GalleryHeader from "./GalleryHeader";

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
    <section className="flex flex-col lg:gap-4 gap-2">
      <GalleryHeader onChangeSearch={onChangeSearch} onClickUpload={onClickUpload} />

      <AnimatePresence>
        <motion.ul
          variants={containerVariants}
          animate="show"
          initial="initial"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 "
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
    </section>
  );
};

export default Gallery;
