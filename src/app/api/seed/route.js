import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request) {
  await dbConnect();

  try {
    // We will ONLY clear products now
    await Product.deleteMany({});
    // NOTE: User accounts are NOT deleted

    const res = await fetch("https://dummyjson.com/products?limit=100");
    if (!res.ok) throw new Error("Failed to fetch products from DummyJSON API");
    const data = await res.json();
    const productsFromApi = data.products;

    const exchangeRate = 83;

    const transformedProducts = productsFromApi.map((product) => {
      const safeTitle = typeof product.title === "string" ? product.title : "";
      const baseSlug = safeTitle
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const slug = `${baseSlug}-${product.id}`;

      return {
        name: product.title,
        slug: slug,
        description: product.description,
        price: Math.round(product.price * exchangeRate),
        image: product.thumbnail,
        category: product.category,
        brand: product.brand || "Unbranded",
        countInStock: product.stock,
        rating: product.rating,
        numReviews: Math.floor(Math.random() * 100) + 1,
      };
    });

    await Product.insertMany(transformedProducts);

    return NextResponse.json({
      message:
        "Database seeded successfully with 100 products. Users were NOT deleted.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to seed database.", error: error.message },
      { status: 500 }
    );
  }
}
