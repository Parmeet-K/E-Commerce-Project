import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Unable to load orders");
    }
  }
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async ({ items, address }, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders", { items, address });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Unable to place order");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Unable to cancel order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.map((order) => ({
          id: order.orderId,
          items: order.items,
          address: order.address,
          date: order.createdAt,
          status: order.status,
          totalAmount: order.totalAmount,
        }));
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.unshift({
          id: action.payload.orderId,
          items: action.payload.items,
          address: action.payload.address,
          date: action.payload.createdAt,
          status: action.payload.status,
          totalAmount: action.payload.totalAmount,
        });
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find((entry) => entry.id === action.payload.orderId);
        if (order) {
          order.status = action.payload.status;
        }
      });
  },
});

export default orderSlice.reducer;
