'use client'

import ProductItem from '@/components/ProductItem'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  // 1. Get the 'status' of the session, in addition to the session data
  const { data: session, update, status } = useSession()
  const [wishlistedItems, setWishlistedItems] = useState([])
  const [loading, setLoading] = useState(true) // This is for loading the wishlist data
  const [error, setError] = useState('')

  useEffect(() => {
    // We only try to fetch the wishlist if the session status is 'authenticated'
    if (status === 'authenticated') {
      const fetchWishlist = async () => {
        try {
          const res = await fetch('/api/wishlist/my-wishlist')
          if (!res.ok) {
            throw new Error('Failed to fetch wishlist.')
          }
          const data = await res.json()
          setWishlistedItems(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchWishlist()
    }
    // If the user is not logged in, we can also stop the loading state
    if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status]) // The effect now depends on the session status

  // 2. Add a primary loading state for the session itself
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <p>You must be logged in to view your wishlist.</p>
        <Link href="/login" className="primary-button mt-4">
          Login
        </Link>
      </div>
    )
  }

  const handleMoveToCart = async (product) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message)
      }
      setWishlistedItems((prevItems) =>
        prevItems.filter((item) => item._id !== product._id)
      )
      await update()
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold py-2">My Wishlist</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          {wishlistedItems.length === 0 ? (
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
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              <h2 className="text-3xl font-semibold mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 mb-6">
                Add items you love to your wishlist by clicking the heart icon.
              </p>
              <Link href="/" className="primary-button">
                Discover Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {wishlistedItems.map((product) => (
                <ProductItem
                  key={product.slug}
                  product={JSON.parse(JSON.stringify(product))}
                  onAddToCart={() => handleMoveToCart(product)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
