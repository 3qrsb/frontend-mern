import React from "react";
import { Box, Typography } from "@mui/material";
import ColorPickerPopover from "./ColorPickerPopover";

interface LegendItem {
  label: string;
  color: string;
}

interface CustomLegendProps {
  datasets: LegendItem[];
  visibility: boolean[];
  onToggleVisibility: (datasetIndex: number) => void;
  onChangeColor: (datasetIndex: number, color: string) => void;
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  datasets,
  visibility,
  onToggleVisibility,
  onChangeColor,
}) => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="center"
      alignItems="center"
      gap={{ xs: 2, md: 4 }}
      sx={{ mb: 2 }}
    >
      {datasets.map((item, index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => onToggleVisibility(index)}
        >
          <ColorPickerPopover
            color={item.color}
            onChange={(color) => onChangeColor(index, color)}
          />
          <Typography
            variant="body2"
            sx={{
              textDecoration: visibility[index] ? "none" : "line-through",
              userSelect: "none",
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CustomLegend;
