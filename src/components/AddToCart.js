'use client'

import { Store } from '@/context/Store'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import QuantityInput from './QuantityInput' // 1. IMPORT

export default function AddToCart({ product }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [quantity, setQuantity] = useState(1)

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const newQuantity = existItem ? existItem.quantity + quantity : quantity

    if (product.countInStock < newQuantity) {
      toast.error('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: newQuantity },
    })
    toast.success('Product added to the cart')
  }

  return (
    <div className="card mt-5 p-5">
      <div className="mb-2 flex justify-between">
        <div>Price</div>
        <div>₹{product.price}</div>
      </div>
      <div className="mb-2 flex justify-between">
        <div>Status</div>
        <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
      </div>

      {product.countInStock > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <div>Qty</div>
          {/* 2. REPLACE THE <select> WITH OUR NEW COMPONENT */}
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            max={product.countInStock}
          />
        </div>
      )}

      <button onClick={addToCartHandler} className="primary-button w-full">
        Add to cart
      </button>
    </div>
  )
}