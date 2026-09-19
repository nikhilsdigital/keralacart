"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    category: "electronics",
    image: "",
    stock: 10,
    featured: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp) || undefined,
        stock: Number(form.stock),
      }),
    });
    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-700">Add Product</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-4 py-3" required />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-4 py-3" rows={4} required />

        <div className="flex gap-4">
          <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange}
            className="w-full rounded-lg border border-ink/15 px-4 py-3" required />
          <input name="mrp" type="number" placeholder="MRP (optional)" value={form.mrp} onChange={handleChange}
            className="w-full rounded-lg border border-ink/15 px-4 py-3" />
        </div>

        <select name="category" value={form.category} onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-4 py-3">
          {["electronics", "fashion", "home", "grocery", "beauty"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-4 py-3" required />

        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-4 py-3" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Show on homepage (featured)
        </label>

        <button disabled={loading} className="w-full rounded-full bg-forest py-3 font-semibold text-white disabled:opacity-50">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
