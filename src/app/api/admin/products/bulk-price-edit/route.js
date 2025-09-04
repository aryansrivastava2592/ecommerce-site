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
    const { filterType, filterValue, updateType, value } = await request.json();

    if (!updateType || value === undefined || isNaN(value)) {
      return NextResponse.json(
        { message: "Update type and a valid value are required." },
        { status: 400 }
      );
    }

    // --- THIS IS THE NEW LOGIC TO CREATE A DYNAMIC FILTER ---
    let filter = {};
    if (filterType === "category" && filterValue) {
      filter = { category: filterValue };
    } else if (filterType === "brand" && filterValue) {
      // We can easily add more filters like this in the future
      filter = { brand: filterValue };
    }
    // If filterType is 'all', the filter remains empty {} to match all products

    let updateOperation;
    const numValue = Number(value);

    if (updateType === "percentage-increase") {
      updateOperation = [
        {
          $set: {
            price: { $round: [{ $multiply: ["$price", 1 + numValue / 100] }] },
          },
        },
      ];
    } else if (updateType === "percentage-decrease") {
      updateOperation = [
        {
          $set: {
            price: { $round: [{ $multiply: ["$price", 1 - numValue / 100] }] },
          },
        },
      ];
    } else if (updateType === "fixed-increase") {
      updateOperation = { $inc: { price: numValue } };
    } else if (updateType === "fixed-decrease") {
      updateOperation = { $inc: { price: -numValue } };
    } else {
      return NextResponse.json(
        { message: "Invalid update type." },
        { status: 400 }
      );
    }

    // The filter is now used here
    const result = await Product.updateMany(filter, updateOperation);

    return NextResponse.json({
      message: `${result.modifiedCount} product prices updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during bulk price update." },
      { status: 500 }
    );
  }
}
