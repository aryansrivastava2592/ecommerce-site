"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function WishlistButton({ productId }) {
  const { data: session, update } = useSession();
  const [isWishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (session?.user?.wishlist) {
      setWishlisted(session.user.wishlist.includes(productId));
    }
  }, [session, productId]);

  const handleWishlistToggle = async () => {
    if (!session) {
      signIn(); // Redirect to login if not authenticated
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      // Optimistic UI update
      setWishlisted(!isWishlisted);
      toast.success(data.message);
      // Trigger a session refetch to ensure data consistency
      await update();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isWishlisted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 ${isWishlisted ? "text-red-500" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
