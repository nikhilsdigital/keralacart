"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl font-700">Create account</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-forest"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-forest"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-forest"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-full bg-forest py-3 font-semibold text-white hover:bg-forest-dark">
          Register
        </button>
      </form>

      <p className="mt-4 text-sm text-ink/60">
        Account ഉണ്ടോ? <Link href="/login" className="text-forest-dark font-600">Login here</Link>
      </p>
    </div>
  );
}
