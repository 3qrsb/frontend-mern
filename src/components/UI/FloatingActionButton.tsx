import React from "react";
import { Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
}) => {
  return (
    <Box
      component="div"
      sx={{
        position: "fixed",
        bottom: { xs: "5vh", md: "4vh" },
        right: { xs: "4vw", md: "2vw" },
        zIndex: 1301,
      }}
    >
      <Fab
        color="primary"
        aria-label="add"
        onClick={onClick}
        sx={{
          width: { xs: 56, sm: 60 },
          height: { xs: 56, sm: 60 },
          boxShadow: 4,
        }}
      >
        <AddIcon sx={{ fontSize: { xs: "1.75rem", sm: "2rem" } }} />
      </Fab>
    </Box>
  );
};

export default FloatingActionButton;
