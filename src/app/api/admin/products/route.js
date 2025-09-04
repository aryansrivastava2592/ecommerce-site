import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  await dbConnect()
  const products = await Product.find({})
  return NextResponse.json(products)
}