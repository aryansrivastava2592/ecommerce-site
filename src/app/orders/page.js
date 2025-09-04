'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OrdersPage() {
  const { data: session } = useSession()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/my-orders')
        if (!res.ok) {
          throw new Error('Failed to fetch orders.')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (session) {
      fetchOrders()
    }
  }, [session])

  if (!session) {
    return (
      <div className="text-center py-10">
        <p>You must be logged in to view your orders.</p>
        <Link href="/login" className="primary-button mt-4">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ITEMS</th>
                <th className="px-5 text-left">DATE</th>
                <th className="px-5 text-left">TOTAL</th>
                <th className="px-5 text-left">PAID</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5">
                    {order.orderItems.length > 0 ? (
                      <>
                        {order.orderItems[0].name}
                        {order.orderItems.length > 1 && (
                          <span className="text-xs text-gray-500 ml-2">
                            + {order.orderItems.length - 1} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No Items</span>
                    )}
                  </td>
                  <td className="p-5">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-5">₹{order.totalPrice}</td>
                  <td className="p-5">
                    {order.isPaid ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
