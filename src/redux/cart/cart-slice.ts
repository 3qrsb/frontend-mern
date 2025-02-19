import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddressTypes } from "../../types/user";
import { Product } from "../../types/product";

export interface CartSliceState {
  cartItems: Product[];
  shippingAddress: AddressTypes | null;
}

const initialState: CartSliceState = {
  cartItems: [],
  shippingAddress: null,
};

export const cartSlice = createSlice({
  name: "cart-items",
  initialState,
  reducers: {
    addToCart: (state: CartSliceState, action: PayloadAction<Product>) => {
      const product = action.payload;
      const exist = state.cartItems.find((item) => item._id === product._id);
      if (exist) {
        if (exist.qty < exist.availableQty) {
          state.cartItems = state.cartItems.map((item) =>
            item._id === product._id ? { ...item, qty: item.qty + 1 } : item
          );
        }
      } else {
        if (product.availableQty > 0) {
          state.cartItems.push({ ...product, qty: 1 });
        }
      }
    },
    removeFromCart: (
      state: CartSliceState,
      action: PayloadAction<{ product: Product; deleteAll?: boolean }>
    ) => {
      const { product, deleteAll } = action.payload;
      if (deleteAll) {
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== product._id
        );
      } else {
        const exist = state.cartItems.find((item) => item._id === product._id);
        if (exist && exist.qty === 1) {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== product._id
          );
        } else {
          state.cartItems = state.cartItems.map((item) =>
            item._id === product._id ? { ...product, qty: item.qty - 1 } : item
          );
        }
      }
    },
    updateCart: (
      state: CartSliceState,
      action: PayloadAction<{ product: Product; qty: number }>
    ) => {
      state.cartItems = state.cartItems.map((item) =>
        item._id === action.payload.product._id
          ? { ...item, qty: action.payload.qty }
          : item
      );
    },
    saveAddress: (
      state: CartSliceState,
      action: PayloadAction<AddressTypes>
    ) => {
      state.shippingAddress = action.payload;
    },
    reset: (state: CartSliceState) => {
      state.cartItems = [];
      state.shippingAddress = null;
    },
  },
});

export const { addToCart, removeFromCart, updateCart, saveAddress, reset } =
  cartSlice.actions;

export default cartSlice;
