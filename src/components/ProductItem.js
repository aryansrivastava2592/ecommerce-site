'use client'

import Link from 'next/link'
import React, { useContext } from 'react'
import { Store } from '@/context/Store'
import toast from 'react-hot-toast'

export default function ProductItem({ product, onAddToCart }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock')
      return
    }
    // This dispatch updates the state. The smart StoreProvider will see this
    // change and automatically save it to the database if the user is logged in.
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    toast.success('Product added to the cart')

    // This is the special function for the "Move from Wishlist" feature
    if (onAddToCart) {
      onAddToCart()
    }
  }

  return (
    <div className="card flex flex-col items-center justify-between p-4">
      <Link href={`/product/${product.slug}`}>
        <div className="flex items-center justify-center h-48 w-full mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Link>
      <div className="flex flex-col items-center justify-center p-2 text-center flex-grow">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg font-semibold line-clamp-2 min-h-[3rem]">
            {product.name}
          </h2>
        </Link>
        <p className="mb-2">₹{product.price}</p>
      </div>
      <button
        className="primary-button w-full"
        type="button"
        onClick={addToCartHandler}
      >
        Add to cart
      </button>
    </div>
  )
}
