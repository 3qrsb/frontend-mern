import React from "react";
import { Box } from "@mui/material";
import "ldrs/metronome"; // Import the metronome loader

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <l-metronome size="35" speed="1.6" color="blue"></l-metronome>
    </Box>
  );
};

export default Loader;
