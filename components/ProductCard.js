"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:shadow-lg">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-56 w-full overflow-hidden bg-forest-light">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        <Link href={`/product/${product._id}`}>
          <h3 className="mt-1 font-display text-lg font-600 hover:text-forest">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-700 text-forest-dark">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-sm text-ink/40 line-through">₹{product.mrp}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="mt-3 w-full rounded-full bg-forest py-2 text-sm font-semibold text-white transition hover:bg-forest-dark"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
