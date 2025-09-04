"use client";

import ProductItem from "@/components/ProductItem";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist/my-wishlist");
        if (!res.ok) {
          throw new Error("Failed to fetch wishlist.");
        }
        const data = await res.json();
        setWishlistedItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchWishlist();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="text-center py-10">
        <p>You must be logged in to view your wishlist.</p>
        <Link href="/login" className="primary-button mt-4">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold py-2">My Wishlist</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          {wishlistedItems.length === 0 ? (
            <div>
              Your wishlist is empty. <Link href="/">Go shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {wishlistedItems.map((product) => (
                <ProductItem
                  key={product.slug}
                  product={JSON.parse(JSON.stringify(product))}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
