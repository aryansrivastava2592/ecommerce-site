import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="mb-6">Your order has been placed successfully.</p>
      <Link href="/" className="primary-button">
        Continue Shopping
      </Link>
    </div>
  );
}