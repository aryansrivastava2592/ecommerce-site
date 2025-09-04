import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to view your wishlist." },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(session.user._id).populate("wishlist");
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user.wishlist);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching the wishlist." },
      { status: 500 }
    );
  }
}
