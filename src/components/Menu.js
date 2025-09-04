'use client'

import { Store } from '@/context/Store'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Menu() {
  const { data: session } = useSession()
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  const dropdownLinks = [
    { href: '/profile', label: 'My Profile', icon: <UserIcon /> },
    { href: '/orders', label: 'Orders', icon: <BoxIcon /> },
    { href: '/wishlist', label: 'Wishlist', icon: <HeartIcon /> },
  ]

  // --- THIS IS THE DEFINITIVE FIX FOR THE LOGOUT BUG ---
  const logoutClickHandler = async () => {
    setDropdownOpen(false)
    // 1. Save the final cart state to the database
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart.cartItems }),
      })
    } catch (err) {
      console.error('Failed to save cart on logout', err)
    }

    // 2. Clear the local state
    dispatch({ type: 'CART_RESET' })

    // 3. Sign out the user
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="flex items-center space-x-4">
      <div
        className="relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button className="flex items-center space-x-2 p-2 rounded-md bg-amber-400 text-black font-semibold hover:bg-amber-500">
          <UserIcon />
          <span>{session ? session.user.name.split(' ')[0] : 'Login'}</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 top-full pt-2 w-56">
            <div className="rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {!session && (
                  <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm">New customer?</span>
                    <Link
                      href="/register"
                      className="font-semibold text-amber-500 hover:text-amber-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                {session?.user?.isAdmin && (
                  <Link
                    href="/admin/products"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <AdminIcon />
                    <span>Admin</span>
                  </Link>
                )}
                {session && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <button
                      onClick={logoutClickHandler}
                      className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <LogoutIcon />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Link href="/cart" className="p-2 flex items-center space-x-1">
        <CartIcon />
        <span>Cart</span>
        {cartItemsCount > 0 && (
          <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            {cartItemsCount}
          </span>
        )}
      </Link>
    </div>
  )
}

// Helper icons...
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
)
const BoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4m0-14l8-4-8 4"
    />
  </svg>
)
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
)
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)
const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)
