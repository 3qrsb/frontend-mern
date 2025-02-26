import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { setCurrency } from "../../redux/settings/currencySlice";
import { useAppDispatch, useAppSelector } from "../../redux";

const CurrencySelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.currency.currency);

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    dispatch(setCurrency(event.target.value));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 100 }}>
      <InputLabel id="currency-selector-label">Currency</InputLabel>
      <Select
        labelId="currency-selector-label"
        id="currency-selector"
        value={currency}
        onChange={handleCurrencyChange}
        label="Currency"
      >
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="EUR">EUR</MenuItem>
        <MenuItem value="KZT">KZT</MenuItem>
        <MenuItem value="RUB">RUB</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CurrencySelector;
