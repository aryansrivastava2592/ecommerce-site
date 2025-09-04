import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { stockValue } = await request.json();
    if (stockValue === null || stockValue === undefined || isNaN(stockValue)) {
      return NextResponse.json(
        { message: "Valid stock value is required." },
        { status: 400 }
      );
    }

    const result = await Product.updateMany(
      {}, // An empty filter matches all documents
      { $set: { countInStock: Number(stockValue) } }
    );

    return NextResponse.json({
      message: `${result.modifiedCount} products updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during bulk update." },
      { status: 500 }
    );
  }
}
