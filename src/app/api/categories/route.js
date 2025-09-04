import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  const categories = await Product.find().distinct("category");
  return NextResponse.json(categories);
}
