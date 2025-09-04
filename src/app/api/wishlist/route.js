import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to modify your wishlist." },
      { status: 401 }
    );
  }

  try {
    const { productId } = await request.json();
    const user = await User.findById(session.user._id);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isWishlisted = user.wishlist.includes(productId);
    let message;

    if (isWishlisted) {
      // Remove from wishlist
      await User.updateOne(
        { _id: user._id },
        { $pull: { wishlist: productId } }
      );
      message = "Product removed from wishlist.";
    } else {
      // Add to wishlist
      await User.updateOne(
        { _id: user._id },
        { $addToSet: { wishlist: productId } } // $addToSet prevents duplicates
      );
      message = "Product added to wishlist.";
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
