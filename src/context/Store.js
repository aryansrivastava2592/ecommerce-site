"use client";

import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : // Add shippingAddress to the initial state
      { cartItems: [], shippingAddress: {} },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      // <-- ADD THIS NEW CASE
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      // <-- ADD THIS NEW CASE
      const newCart = { ...state.cart, shippingAddress: action.payload };
      Cookies.set("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "SAVE_PAYMENT_METHOD": {
      // <-- ADD THIS NEW CASE
      const newCart = { ...state.cart, paymentMethod: action.payload };
      Cookies.set("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "CART_CLEAR_ITEMS": {
      // <-- ADD THIS NEW CASE
      const newCart = { ...state.cart, cartItems: [] };
      Cookies.set("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
