import React from "react";
import { Card, CardContent, Box } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import LazyImage from "../UI/LazyImage";

interface ProductImagesProps {
  images: string[];
  selectedImage: string;
  onSelectImage: (img: string) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  selectedImage,
  onSelectImage,
}) => {
  return (
    <>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              height: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #ddd",
            }}
          >
            <Zoom>
              <LazyImage
                imageUrl={selectedImage}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Zoom>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              border: selectedImage === img ? "2px solid #1976d2" : "",
              cursor: "pointer",
              mx: 1,
            }}
            onClick={() => onSelectImage(img)}
          >
            <LazyImage
              imageUrl={img}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default ProductImages;
