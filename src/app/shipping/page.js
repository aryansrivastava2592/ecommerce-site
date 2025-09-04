"use client";

import { useContext, useEffect, useState } from "react";
import { Store } from "@/context/Store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ShippingPage() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for a new address
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    // Fetch user's saved addresses
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/addresses");
        const data = await res.json();
        setSavedAddresses(data);
        // Set the default selected address if one exists
        if (data.length > 0) {
          setSelectedAddress(data[0]);
        } else {
          setShowNewAddressForm(true); // If no saved addresses, show the form
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalAddress;

    if (showNewAddressForm) {
      // Logic for submitting a new address
      finalAddress = { fullName, address, city, postalCode, country };
      // Optionally save this new address to the user's profile
      fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAddress),
      }).then((res) => {
        if (res.ok) toast.success("New address saved to your profile!");
      });
    } else {
      // Logic for using a selected saved address
      finalAddress = selectedAddress;
    }

    if (!finalAddress) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: finalAddress,
    });
    router.push("/payment");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold my-4">Shipping Address</h1>

      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {savedAddresses.map((addr, index) => (
              <label
                key={index}
                className="card p-4 flex items-center space-x-4 cursor-pointer"
              >
                <input
                  type="radio"
                  name="address"
                  className="radio radio-primary"
                  checked={
                    selectedAddress?._id === addr._id ||
                    selectedAddress?.address === addr.address
                  }
                  onChange={() => {
                    setSelectedAddress(addr);
                    setShowNewAddressForm(false);
                  }}
                />
                <div>
                  <p className="font-bold">{addr.fullName}</p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.postalCode}, {addr.country}
                  </p>
                </div>
              </label>
            ))}

            <label className="card p-4 flex items-center space-x-4 cursor-pointer">
              <input
                type="radio"
                name="address"
                className="radio radio-primary"
                checked={showNewAddressForm}
                onChange={() => {
                  setShowNewAddressForm(true);
                  setSelectedAddress(null);
                }}
              />
              <p className="font-bold">Add a New Address</p>
            </label>
          </div>

          {showNewAddressForm && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="divider">Enter New Address Details</div>
              <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  type="text"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  type="text"
                  className="w-full"
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <button type="submit" className="primary-button w-full">
              Continue to Payment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
