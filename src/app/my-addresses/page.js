'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MyAddressesPage() {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/addresses')
        const data = await res.json()
        setAddresses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (session) {
      fetchAddresses()
    }
  }, [session])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Addresses</h1>
      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p>You have no saved addresses.</p>
          ) : (
            addresses.map((addr, index) => (
              <div key={index} className="card p-4">
                <p className="font-bold">{addr.fullName}</p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.postalCode}
                </p>
                <p>{addr.country}</p>
              </div>
            ))
          )}
          <Link href="/my-addresses/add" className="primary-button mt-4">
            Add a New Address
          </Link>
        </div>
      )}
    </div>
  )
}