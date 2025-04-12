import { Card, CardMedia, duration } from "@mui/material";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageType } from "codemine_task/types/Image";
import Image from "next/image";

type Props = { image: ImageType; onClickSelect: (image: ImageType | null) => void };

const CardMotionLink = motion(Card);

const GalleryPhoto = React.memo(({ image, onClickSelect }: Props) => {
  const [imgError, setImgError] = useState(false);

  // Log the image URL for debugging
  console.log("Rendering image:", image.name, "URL:", image.url);

  const handleImageError = () => {
    console.error("Failed to load image:", image.url);
    setImgError(true);
  };

  return (
    <CardMotionLink
      key={image.name}
      onClick={() => onClickSelect(image)}
      sx={{ borderRadius: "1.25rem", aspectRatio: "1/1", cursor: "zoom-in", overflow: "hidden" }}
    >
      {imgError ? (
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">Image not available</div>
      ) : (
        <Image
          src={image.url}
          alt={image.name}
          width={250}
          height={250}
          onError={handleImageError}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      )}
    </CardMotionLink>
  );
});

export default GalleryPhoto;
