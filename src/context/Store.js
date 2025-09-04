'use client'

import { createContext, useEffect, useReducer, useCallback } from 'react'
import Cookies from 'js-cookie'
import { useSession } from 'next-auth/react'

export const Store = createContext()

const initialState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: '' },
}

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      )
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      }
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      }
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      }
    case 'CART_CLEAR_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: [] } }
    case 'HYDRATE_CART':
      return { ...state, cart: { ...state.cart, cartItems: action.payload } }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: session, status } = useSession()

  useEffect(() => {
    // This effect syncs the cart when a user logs in. It remains the same.
    const syncCart = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/cart')
          const serverData = await res.json()
          const serverCartItems = Array.isArray(serverData) ? serverData : []
          const localCart = Cookies.get('cart')
            ? JSON.parse(Cookies.get('cart'))
            : { cartItems: [] }
          const mergedCartItems = [...serverCartItems]
          if (localCart.cartItems.length > 0) {
            localCart.cartItems.forEach((localItem) => {
              const existItem = mergedCartItems.find(
                (item) => item.slug === localItem.slug
              )
              if (existItem) {
                existItem.quantity = Math.max(
                  existItem.quantity,
                  localItem.quantity
                )
              } else {
                mergedCartItems.push(localItem)
              }
            })
          }
          dispatch({
            type: 'HYDRATE_CART',
            payload: mergedCartItems,
          })
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: mergedCartItems }),
          })
          Cookies.remove('cart')
        } catch (error) {
          console.error('Failed to sync cart:', error)
        }
      }
    }
    syncCart()
  }, [status])

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  )
}
