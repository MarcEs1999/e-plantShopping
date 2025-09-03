import { createSlice } from '@reduxjs/toolkit';

const normalizePrice = (cost) =>
  typeof cost === "string" ? Number(cost.replace(/[^0-9.]/g, "")) : Number(cost || 0);

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const p = action.payload;
      const existing = state.items.find((i) => i.name === p.name);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          name: p.name,
          image: p.image,
          description: p.description,
          cost: p.cost,
          quantity: 1,
        });
      }
    },

    removeItem: (state, action) => {
      // accept either a plain string or { name: '...' }
      const name =
        typeof action.payload === 'string'
          ? action.payload
          : action.payload?.name;

      if (!name) return;
      state.items = state.items.filter((i) => i.name !== name);
    },

    updateQuantity: (state, action) => {
      const { name, amount } = action.payload;
      const item = state.items.find((i) => i.name === name);
      if (!item) return;

      const next = Math.max(0, Number(amount));
      if (next === 0) {
        state.items = state.items.filter((i) => i.name !== name);
      } else {
        item.quantity = next;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;
export default CartSlice.reducer;

export const selectCartItems  = (state) => state.cart.items;
export const selectCartCount  = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal  = (state) =>
  state.cart.items.reduce((s, i) => s + (i.quantity * normalizePrice(i.cost)), 0);