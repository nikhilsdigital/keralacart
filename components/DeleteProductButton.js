"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("ഈ product ഡിലീറ്റ് ചെയ്യണോ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:underline">
      Delete
    </button>
  );
}
