"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (session) {
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      // --- THIS IS THE FIX ---
      // This simpler call tells NextAuth to refetch the session from the server,
      // which will contain the new name.
      await update();
      // --- END OF FIX ---

      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto card p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-2 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block">
            New Password (leave blank to keep current)
          </label>
          <input
            id="password"
            type="password"
            className="w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-2 block">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link href="/profile" className="text-sm hover:underline">
            Cancel
          </Link>
          <button type="submit" className="primary-button">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
