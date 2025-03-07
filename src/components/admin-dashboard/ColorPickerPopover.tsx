import React, { useState, useCallback } from "react";
import { Button, Popover, Box, TextField, InputAdornment } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value.replace(/^#/, "").slice(0, 6);
      onChange("#" + input);
    },
    [onChange]
  );

  const open = Boolean(anchorEl);
  const displayValue = color.startsWith("#") ? color.slice(1) : color;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Button
        onClick={handleClick}
        sx={{
          width: 44,
          height: 15,
          minWidth: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          border: "3.4px solid #ccc",
          borderColor: color,
          borderRadius: 0,
          p: 0,
        }}
      />
      <TextField
        value={displayValue}
        onChange={handleInputChange}
        variant="outlined"
        size="small"
        inputProps={{ maxLength: 6 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">#</InputAdornment>,
        }}
        sx={{ width: 110 }}
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
