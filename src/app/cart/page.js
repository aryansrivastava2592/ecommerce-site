'use client'

import { Store } from '@/context/Store'
import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import QuantityInput from '@/components/QuantityInput'

export default function CartPage() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty)
    if (item.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-3xl font-semibold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/" className="primary-button">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          {/* 1. FIXED TYPO HERE: 'md-col-span-3' is now 'md:col-span-3' */}
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b align-middle">
                    <td className="p-5">
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="p-1"
                        ></img>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(newQty) => updateCartHandler(item, newQty)}
                        max={item.countInStock}
                      />
                    </td>
                    <td className="p-5 text-right">₹{item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        {/* 2. FIXED SVG CODE HERE */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.749.684H5.858a.75.75 0 0 1-.749-.684L4.104 6.633l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.347-9Zm5.239 0a.75.75 0 0 1 .058 1.5l-.347 9a.75.75 0 0 1-1.5-.058l.347-9a.75.75 0 0 1 1.442-.058Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                  ₹{cartItems.reduce(
                    (a, c) => a + c.quantity * c.price,
                    0
                  )}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('/shipping')}
                  className="primary-button w-full"
                >
                  Proceed to Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
