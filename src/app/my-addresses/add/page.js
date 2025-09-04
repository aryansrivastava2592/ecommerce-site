"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddAddressPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const addressData = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      if (!res.ok) {
        throw new Error("Failed to add address");
      }
      toast.success("Address added successfully!");
      router.push("/my-addresses");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold my-4">Add New Address</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            className="w-full"
            required
          />
        </div>
        <button type="submit" className="primary-button">
          Save Address
        </button>
      </form>
    </div>
  );
}
