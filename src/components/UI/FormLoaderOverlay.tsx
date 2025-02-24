import React from "react";
import { Box } from "@mui/material";
import Loader from "./loader";

const FormLoaderOverlay: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
      }}
    >
      <Loader />
    </Box>
  );
};

export default FormLoaderOverlay;
