import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast from "react-hot-toast";

interface QuantityFieldProps {
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
}

const QuantityField: React.FC<QuantityFieldProps> = ({
  value,
  min,
  max,
  onChange,
}) => {
  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    } else {
      toast.error(`Cannot increase quantity beyond ${max}.`);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const newValue = Number(numericValue);
    if (!isNaN(newValue)) {
      if (newValue < min) {
        onChange(min);
      } else if (newValue > max) {
        toast.error(`Quantity must be between ${min} and ${max}.`);
        onChange(max);
      } else {
        onChange(newValue);
      }
    }
  };

  return (
    <TextField
      type="text"
      value={value}
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 0.5, pr: 0.5 }}>
            <IconButton
              onClick={handleDecrease}
              edge="start"
              disabled={value === min}
              sx={{ p: 0 }}
            >
              <RemoveIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end" sx={{ pl: 0.5, pr: 0.5 }}>
            <IconButton onClick={handleIncrease} edge="end" sx={{ p: 0 }}>
              <AddIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      slotProps={{
        htmlInput: { min, max, style: { textAlign: "center" } } as any,
      }}
      fullWidth
      sx={{
        width: { xs: "100%", md: "150px" },
        "& .MuiInputBase-input": {
          fontSize: { xs: "1rem", md: "1rem" },
          padding: { xs: "4px 6px", md: "6px 8px" },
        },
      }}
    />
  );
};

export default QuantityField;
