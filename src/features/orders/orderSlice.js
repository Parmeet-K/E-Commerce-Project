import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
  },
  reducers: {
    placeOrder: (state, action) => {
      state.orders.push({
        id: action.payload.id,
        items: action.payload.items,
        address: action.payload.address,
        date: new Date().toISOString(),
        status: "confirmed",
      });
    },
    cancelOrder: (state, action) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        order.status = "cancelled";
      }
    },
  },
});

export const { placeOrder, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;