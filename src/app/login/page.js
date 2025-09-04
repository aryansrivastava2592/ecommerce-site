"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid email or password");
        return;
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-amber-400">
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="primary-button">Login</button>
          {error && (
            <div className="bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          {/* Corrected Link Here */}
          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Do not have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
