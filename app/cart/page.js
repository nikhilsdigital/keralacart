"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-content px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-700">Your cart is empty</h1>
        <Link href="/shop" className="mt-4 inline-block rounded-full bg-forest px-6 py-3 font-semibold text-white">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <h1 className="font-display text-3xl font-700">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 rounded-xl border border-ink/10 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-forest-light">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-600">{item.name}</p>
                <p className="text-sm text-ink/50">₹{item.price} each</p>
              </div>
              <div className="flex items-center rounded-full border border-ink/15">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1">-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1">+</button>
              </div>
              <p className="w-20 text-right font-700">₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)} className="text-sm text-red-500">Remove</button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-ink/10 p-6">
          <h2 className="font-display text-lg font-700">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink/50">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-700">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-forest py-3 text-center font-semibold text-white hover:bg-forest-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
