import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ExchangeRatesState {
  rates: { [key: string]: number };
  base: string;
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeRatesState = {
  rates: {},
  base: "USD",
  loading: false,
  error: null,
};

export const fetchExchangeRates = createAsyncThunk(
  "exchangeRates/fetchRates",
  async (_, { rejectWithValue }) => {
    try {
      const VITE_EXCHANGE_RATES_API_KEY = import.meta.env
        .VITE_EXCHANGE_RATES_API_KEY;
      const response = await axios.get(
        `https://api.exchangeratesapi.io/v1/latest?access_key=${VITE_EXCHANGE_RATES_API_KEY}&symbols=USD,KZT,RUB`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.rates;
        state.base = action.payload.base;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exchangeRatesSlice;
