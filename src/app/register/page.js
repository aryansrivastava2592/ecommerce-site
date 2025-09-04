'use client'

import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('All fields are necessary.')
      toast.error('All fields are necessary.')
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        const form = e.target
        form.reset()
        toast.success('Registration successful! You can now log in.')
      } else {
        const data = await res.json()
        setError(data.message || 'User registration failed.')
        toast.error(data.message || 'User registration failed.')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md card p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center">Register an Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full rounded border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button className="primary-button">Register</button>

          <Link className="text-sm mt-3 text-center" href={'/login'}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  )
}
