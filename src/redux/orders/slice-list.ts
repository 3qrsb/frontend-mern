import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import { Ordertypes } from "../../types/order";

export interface OrderSliceState {
  orders: Ordertypes[];
  loading: boolean;
  error: string | undefined;
  totalPrice: number;
}

const initialState: OrderSliceState = {
  orders: [],
  loading: false,
  error: undefined,
  totalPrice: 0,
};

export const getOrdersList = createAsyncThunk("orders/list", async () => {
  try {
    const { data: orders } = await authAxios.get("/orders");
    const userPromises = orders.map(async (order: any) => {
      try {
        const userResponse = await authAxios.get(`/users/${order.user}`);
        return userResponse.data;
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error(`User not found: ${order.user}`);
        } else {
          console.error(`Failed to fetch user ${order.user}:`, error.message);
        }
        return null;
      }
    });

    const users = await Promise.all(userPromises);
    const ordersWithUserDetails = orders.map((order: any, index: any) => ({
      ...order,
      user: users[index],
    }));

    return ordersWithUserDetails.filter((order: any) => order.user !== null);
  } catch (error: any) {
    const message = setError(error);
    toast.error(message);
    throw error;
  }
});

export const orderListSlice = createSlice({
  name: "orders-list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrdersList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrdersList.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(getOrdersList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      console.error("Error fetching orders:", action.error.message);
    });
  },
});

export default orderListSlice;
