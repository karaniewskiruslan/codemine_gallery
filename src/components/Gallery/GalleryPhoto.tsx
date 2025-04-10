import { Card, CardMedia, duration } from "@mui/material";
import { Image } from "codemine_task/types/Image";
import React from "react";
import { motion } from "framer-motion";

type Props = { image: Image; onClickSelect: (image: Image | null) => void };

const cardVariants = {
  exit: {
    opacity: 0,
    y: 25,
  },
  hover: {
    scale: 1.05,
  },
  initial: {
    scale: 0,
    opacity: 0,
    y: -25,
  },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
  },
};

const GalleryPhoto = ({ image, onClickSelect }: Props) => {
  const CardMotionLink = motion(Card);

  return (
    <CardMotionLink
      key={image.name}
      onClick={() => onClickSelect(image)}
      variants={cardVariants}
      whileHover="hover"
      transition={{
        type: "spring",
        duration: 1,
      }}
      sx={{ borderRadius: "1.25rem", aspectRatio: "1/1", cursor: "zoom-in" }}
    >
      <CardMedia
        component="img"
        image={image.url}
        alt={image.name}
        sx={{
          height: "100% !important",
        }}
      />
    </CardMotionLink>
  );
};

export default GalleryPhoto;
