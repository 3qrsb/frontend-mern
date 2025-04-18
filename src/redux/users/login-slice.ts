import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import publicAxios from "../../utils/public-axios";

interface User {
  email: string;
  password: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface UserSliceState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const userLogin = createAsyncThunk<
  UserInfo,
  User,
  { rejectValue: string }
>("users/login", async (credentials, thunkAPI) => {
  try {
    const res = await publicAxios.post("/auth/login", credentials);
    toast.success(`Welcome 👏 ${res.data.name}`);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    return res.data as UserInfo;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      "An error occurred. Please try again later.";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const loginSlice = createSlice({
  name: "auth-login",
  initialState,
  reducers: {
    userLogout(state) {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setCredentials(state, action: { payload: UserInfo }) {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Login failed";
      });
  },
});

export const { userLogout, setCredentials } = loginSlice.actions;
export default loginSlice;
