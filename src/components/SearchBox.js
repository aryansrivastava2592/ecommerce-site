"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="mx-auto w-full max-w-xl relative hidden md:block"
    >
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          className="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-amber-400 focus:ring-0 rounded-md py-2 pl-12 pr-4 text-sm transition-colors duration-200 ease-in-out"
          placeholder="Search for Products, Brands and More..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
