import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [
      { id: 1, name: "Wireless Headphones", price: 79.99, description: "Premium sound quality" },
      { id: 2, name: "Smart Watch", price: 199.99, description: "Track your fitness" },
      { id: 3, name: "USB-C Cable", price: 12.99, description: "Fast charging" },
      { id: 4, name: "Portable Charger", price: 34.99, description: "20000mAh capacity" },
      { id: 5, name: "Phone Stand", price: 15.99, description: "Adjustable design" },
      { id: 6, name: "Screen Protector", price: 9.99, description: "Case friendly" },
      { id: 7, name: "Bluetooth Speaker", price: 49.99, description: "360° sound" },
      { id: 8, name: "Phone Case", price: 19.99, description: "Shockproof" },
    ],
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;