"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartBox({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="flex items-center rounded-full border border-ink/15">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2">-</button>
        <span className="w-8 text-center">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2">+</button>
      </div>

      <button
        onClick={() => addToCart(product, qty)}
        className="rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-forest-dark"
      >
        Add to Cart
      </button>

      <button
        onClick={() => {
          addToCart(product, qty);
          router.push("/cart");
        }}
        className="rounded-full border border-forest px-6 py-3 font-semibold text-forest-dark hover:bg-forest-light"
      >
        Buy Now
      </button>
    </div>
  );
}
