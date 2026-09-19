import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import DeleteProductButton from "@/components/DeleteProductButton";

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  const data = JSON.parse(JSON.stringify(products));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-700">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white">
          + Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-light">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p._id} className="border-t border-ink/10">
                <td className="p-3 font-600">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <DeleteProductButton id={p._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
