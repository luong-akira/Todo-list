import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/user.interface";
import axios from "axios";
import { stat } from "fs";

export interface AuthState {
  user: User | null;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  isSuccess: false,
  isLoading: false,
  isError: false,
};

export interface LogginUser {
  username: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  username: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async (user: LogginUser) => {
    console.log(user);
    const response = await axios.post("/api/users/login", user);

    if (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (user: RegisterUser) => {
    console.log(user);
    const response = await axios.post("/api/users", user);

    if (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.user = null;
        state.isError = true;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.user = null;
        state.isError = true;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
