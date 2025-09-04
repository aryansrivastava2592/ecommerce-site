"use client";

import { useContext, useEffect, useState } from "react";
import { Store } from "@/context/Store";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  // 1. NEW, LOCALIZED PAYMENT METHODS
  const paymentMethods = ["Cash on Delivery (COD)", "UPI", "Credit/Debit Card"];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping");
    }
    // 2. Set the default payment method to the one in the cart or the first option
    setSelectedPaymentMethod(paymentMethod || paymentMethods[0]);
  }, [paymentMethod, router, shippingAddress?.address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return;
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    router.push("/place-order");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold my-4">Payment Method</h1>
      <form onSubmit={handleSubmit}>
        {/* 3. MAP OVER THE NEW PAYMENT METHODS */}
        {paymentMethods.map((payment) => (
          <div key={payment} className="mb-4">
            <input
              type="radio"
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              value={payment}
              checked={selectedPaymentMethod === payment}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            />
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className="my-4 flex justify-between">
          <button
            type="button"
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button type="submit" className="primary-button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
