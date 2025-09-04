import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to view your orders." },
      { status: 401 }
    );
  }

  try {
    const orders = await Order.find({ user: session.user._id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching orders." },
      { status: 500 }
    );
  }
}
