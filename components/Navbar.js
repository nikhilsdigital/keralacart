"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-2xl font-800 tracking-tight text-forest-dark">
          KeralaCart
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-forest">Home</Link>
          <Link href="/shop" className="text-sm font-medium hover:text-forest">Shop</Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="text-sm font-medium hover:text-forest">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-sm font-medium">
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 grid h-5 w-5 place-items-center rounded-full bg-mustard text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <button onClick={() => signOut()} className="text-sm font-medium text-forest-dark">
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-dark">
              Login
            </Link>
          )}

          <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-ink/10 px-5 py-4 md:hidden">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
          {session?.user?.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
        </div>
      )}
    </header>
  );
}
