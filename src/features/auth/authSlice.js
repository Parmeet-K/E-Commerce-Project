import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";

const storedAuth = JSON.parse(localStorage.getItem("auth") || "null");

function persistAuth(payload) {
  localStorage.setItem("auth", JSON.stringify(payload));
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { name, email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Unable to sign in");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Unable to create account");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth?.user || null,
    token: storedAuth?.token || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistAuth(action.payload);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistAuth(action.payload);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
