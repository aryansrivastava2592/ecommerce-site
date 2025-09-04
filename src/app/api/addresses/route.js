import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(session.user._id);
    return NextResponse.json(user.savedAddresses);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newAddress = await request.json();
    const user = await User.findById(session.user._id);

    user.savedAddresses.push(newAddress);
    await user.save();

    return NextResponse.json(
      { message: "Address added successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error adding address" },
      { status: 500 }
    );
  }
}
