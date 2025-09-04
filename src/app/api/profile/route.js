import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to update your profile." },
      { status: 401 }
    );
  }

  try {
    const { name, email, password } = await request.json();
    const user = await User.findById(session.user._id);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    // Only update and hash the password if a new one is provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    // Important: We need to return a user object that matches what NextAuth expects
    // This will be used to update the session on the client side
    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      // Do NOT return the password hash
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while updating the profile." },
      { status: 500 }
    );
  }
}
