import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import api from "../../utils/auth-axios";
interface UserDetailState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserDetailState = {
  user: null,
  loading: false,
  error: null,
};

export const getUserById = createAsyncThunk<
  User,
  string | undefined,
  { rejectValue: string }
>("userDetail/getById", async (id, thunkAPI) => {
  if (!id) {
    return thunkAPI.rejectWithValue("No user ID provided");
  }
  try {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to fetch user";
    return thunkAPI.rejectWithValue(message);
  }
});

const userDetailsSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Could not load user";
      });
  },
});

export default userDetailsSlice;
