'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res.error) {
        setError('Invalid email or password')
        toast.error('Invalid email or password')
        return
      }

      router.replace('/')
    } catch (error) {
      console.log(error)
      setError('An error occurred during login.')
      toast.error('An error occurred during login.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md card p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button className="primary-button">Login</button>

          <Link className="text-sm mt-3 text-center" href={'/register'}>
            Do not have an account?{' '}
            <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  )
}
