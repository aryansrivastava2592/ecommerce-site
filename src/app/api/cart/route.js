import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await User.findById(session.user._id)
    // --- THIS IS THE FIX ---
    // Return the user's cart, OR an empty array if the cart doesn't exist
    return NextResponse.json(user.cart || [])
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching cart' }, { status: 500 })
  }
}

export async function POST(request) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { cartItems } = await request.json()
    await User.updateOne({ _id: session.user._id }, { $set: { cart: cartItems } })
    return NextResponse.json(
      { message: 'Cart updated successfully' },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'Error updating cart' },
      { status: 500 }
    )
  }
}