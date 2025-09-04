import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  // Get the search query from the URL, e.g., /api/products/search?q=phone
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { message: "Search query is required." },
      { status: 400 }
    );
  }

  // Use a regular expression to perform a case-insensitive search
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).lean();

  return NextResponse.json(products);
}
