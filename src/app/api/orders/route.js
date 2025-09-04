import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to place an order." },
      { status: 401 }
    );
  }

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = await request.json();

    const newOrder = new Order({
      user: session.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await newOrder.save();

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating the order." },
      { status: 500 }
    );
  }
}
