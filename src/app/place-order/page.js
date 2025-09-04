'use client'

import { Store } from '@/context/Store'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PlaceOrderPage() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress, paymentMethod, cartItems } = cart

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false) // New state to control redirect

  useEffect(() => {
    // Only redirect if an order hasn't just been placed
    if (!orderPlaced && cartItems.length === 0) {
      router.push('/cart')
    }
    if (!paymentMethod) {
      router.push('/payment')
    }
  }, [paymentMethod, router, cartItems, orderPlaced])

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Could not place order')
      }

      setOrderPlaced(true) // Set flag to prevent redirect
      dispatch({ type: 'CART_CLEAR_ITEMS' })
      toast.success('Order placed successfully!')
      router.push('/order-success')
    } catch (err) {
      toast.error(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="text-2xl font-bold mb-4">Place Order</h1>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty. <Link href="/">Go shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card p-5">
              <h2 className="text-xl mb-2">Shipping Address</h2>
              <p>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
              <Link href="/shipping" className="text-blue-500">
                Edit
              </Link>
            </div>
            <div className="card p-5">
              <h2 className="text-xl mb-2">Payment Method</h2>
              <p>{paymentMethod}</p>
              <Link href="/payment" className="text-blue-500">
                Edit
              </Link>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="text-xl mb-2">Order Items</h2>
              <table className="min-w-full">
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.slug} className="border-b">
                      <td>
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
                          />
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/cart" className="text-blue-500">
                Edit
              </Link>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="card p-5">
          <h2 className="text-xl mb-2">Order Summary</h2>
          <ul>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Items</div>
                <div>₹{itemsPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Tax</div>
                <div>₹{taxPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Shipping</div>
                <div>₹{shippingPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between font-bold">
                <div>Total</div>
                <div>₹{totalPrice}</div>
              </div>
            </li>
            <li>
              <button
                onClick={placeOrderHandler}
                disabled={loading || cartItems.length === 0}
                className="primary-button w-full"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
