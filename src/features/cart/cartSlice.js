import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.cartItems.find(i => i.id === action.payload.id);
      if (item) {
        item.qty += 1;
      } else {
        state.cartItems.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
    },
    updateQty: (state, action) => {
      const item = state.cartItems.find(i => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;