import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setError } from "../../utils/error";
import publicAxios from "../../utils/public-axios";
import { Product } from "../../types/product";

export interface ProductSliceState {
  products: Product[];
  topSellingProducts: Product[];
  loading: boolean;
  error: null | object;
}

const products: Product[] | [] = [];

const initialState: ProductSliceState = {
  products: products,
  topSellingProducts: [],
  loading: false,
  error: null,
};

export const getProducts = createAsyncThunk("products/list", async () => {
  try {
    const { data } = await publicAxios.get("/products");
    return data;
  } catch (error: any) {
    const message = setError(error);
    toast.error(message);
  }
});

export const getTopSellingProducts = createAsyncThunk(
  "products/topSelling",
  async () => {
    try {
      const { data } = await publicAxios.get("/products/top-selling");
      return data;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
    }
  }
);

export const productListSlice = createSlice({
  name: "products-list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getTopSellingProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTopSellingProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.topSellingProducts = action.payload;
    });
    builder.addCase(getTopSellingProducts.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default productListSlice;
