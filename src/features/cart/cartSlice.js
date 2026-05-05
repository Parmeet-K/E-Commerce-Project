import { createSlice } from "@reduxjs/toolkit";

function getProductId(item) {
  return item._id || item.id;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const productId = getProductId(action.payload);
      const item = state.cartItems.find((cartItem) => getProductId(cartItem) === productId);
      if (item) {
        item.qty += 1;
      } else {
        state.cartItems.push({ ...action.payload, id: productId, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => getProductId(item) !== action.payload);
    },
    updateQty: (state, action) => {
      const item = state.cartItems.find((cartItem) => getProductId(cartItem) === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
