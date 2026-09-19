"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl font-700">Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-ink/60">
        Account ഇല്ലേ? <Link href="/register" className="text-forest-dark font-600">Register here</Link>
      </p>
    </div>
  );
}
