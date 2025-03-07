import React, { useState, useCallback } from "react";
import { Button, Popover, Typography, Box } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface ColorPickerPopoverProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  label,
  color,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Typography variant="subtitle1">{label}:</Typography>
      <Button
        onClick={handleClick}
        sx={{
          minWidth: "36px",
          minHeight: "36px",
          borderRadius: "50%",
          backgroundColor: color,
          border: "1px solid #ccc",
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <HexColorPicker color={color} onChange={onChange} />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPickerPopover;
