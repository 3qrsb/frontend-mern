import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import { User } from "../../types/user";

interface UserListState {
  users: User[];
  loading: boolean;
  error: null | object;
  pages: number;
  page: number;
  newCustomers: number;
}

const initialState: UserListState = {
  users: [],
  pages: 1,
  page: 1,
  loading: false,
  error: null,
  newCustomers: 0,
};

export const getUsersList = createAsyncThunk(
  "users/list",
  async (filter: any, thunkAPI) => {
    try {
      const res = await authAxios.get(
        `/users?query=${filter.query}&page=${filter.page}`
      );
      return res.data;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNewCustomersThisMonth = createAsyncThunk(
  "users/getNewCustomersThisMonth",
  async (_, thunkAPI) => {
    try {
      const { data } = await authAxios.get("/users/new-customers");
      return data.count;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, thunkAPI) => {
    try {
      await authAxios.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const promoteAdmin = createAsyncThunk(
  "users/promoteAdmin",
  async (id: string, thunkAPI) => {
    try {
      await authAxios.post(`/users/promote/admin/${id}`);
      return id;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const promoteSeller = createAsyncThunk(
  "users/promoteSeller",
  async (id: string, thunkAPI) => {
    try {
      await authAxios.post(`/users/promote/seller/${id}`);
      return id;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const demoteSeller = createAsyncThunk(
  "users/demoteSeller",
  async (id: string, thunkAPI) => {
    try {
      await authAxios.post(`/users/demote/seller/${id}`);
      return id;
    } catch (error: any) {
      const message = setError(error);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userListSlice = createSlice({
  name: "user-list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersList.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getUsersList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getNewCustomersThisMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getNewCustomersThisMonth.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.newCustomers = action.payload;
        }
      )
      .addCase(getNewCustomersThisMonth.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(
        promoteAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.users = state.users.map((user) =>
            user._id === action.payload ? { ...user, isAdmin: true } : user
          );
        }
      )
      .addCase(
        promoteSeller.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.users = state.users.map((user) =>
            user._id === action.payload ? { ...user, isSeller: true } : user
          );
        }
      )
      .addCase(
        demoteSeller.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.users = state.users.map((user) =>
            user._id === action.payload ? { ...user, isSeller: false } : user
          );
        }
      );
  },
});

export default userListSlice;
