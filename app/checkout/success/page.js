import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-700 text-forest-dark">🎉 Order placed successfully!</h1>
      <p className="mt-3 text-ink/60">Your order has been confirmed and is being processed.</p>
      <Link href="/shop" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 font-semibold text-white">
        Continue Shopping
      </Link>
    </div>
  );
}
