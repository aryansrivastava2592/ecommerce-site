"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  // 1. Get the 'status' of the session
  const { data: session, status } = useSession();

  // 2. Show a loading message while the session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // 3. Show a login prompt if the user is not authenticated
  if (!session) {
    return (
      <div className="text-center py-10">
        <p>You must be logged in to view this page.</p>
        <Link href="/login" className="primary-button mt-4">
          Login
        </Link>
      </div>
    );
  }

  const profileLinks = [
    { href: "/orders", label: "My Orders" },
    { href: "/wishlist", label: "My Wishlist" },
    { href: "/my-addresses", label: "My Addresses" }, // <-- UPDATE THIS LINK
  ];

  return (
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="md:col-span-1">
        <div className="card p-5">
          <h2 className="text-xl font-bold mb-2">{session.user.name}</h2>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>
      </div>
      <div className="md:col-span-3">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
          <div className="space-y-6">
            <div className="flex flex-col gap-2 items-start">
              <h3 className="font-semibold">Personal Information</h3>
              <p className="text-gray-600">
                View and edit your personal details.
              </p>
              <Link
                href="/profile/edit"
                className="default-button mt-1 text-sm"
              >
                Edit
              </Link>
            </div>
            <div className="divider"></div>
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <div className="flex flex-col space-y-2 mt-2">
                {profileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-amber-500 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
