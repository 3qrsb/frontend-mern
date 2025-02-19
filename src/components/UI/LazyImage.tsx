import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { SxProps } from "@mui/material";

interface Props {
  className?: string;
  imageUrl?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
}

const LazyImage: React.FC<Props> = ({ className, imageUrl, style, sx }) => {
  const combinedStyle = { ...style, ...(sx as object) };
  return (
    <LazyLoadImage
      style={combinedStyle}
      src={imageUrl}
      loading="lazy"
      className={className}
      alt="Image Alt"
      effect="blur"
    />
  );
};

export default LazyImage;
