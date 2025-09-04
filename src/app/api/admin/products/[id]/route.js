import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const product = await Product.findById(params.id);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const product = await Product.findById(params.id);
  if (product) {
    const data = await request.json();
    product.name = data.name;
    product.slug = data.slug;
    product.price = data.price;
    product.category = data.category;
    product.image = data.image;
    product.brand = data.brand;
    product.countInStock = data.countInStock;
    product.description = data.description;
    const updatedProduct = await product.save();
    return NextResponse.json(updatedProduct);
  } else {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
