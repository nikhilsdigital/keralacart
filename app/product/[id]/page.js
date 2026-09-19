import Image from "next/image";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import AddToCartBox from "@/components/AddToCartBox";

async function getProduct(id) {
  await connectDB();
  const product = await Product.findById(id).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="mx-auto max-w-content px-5 py-16">Product not found.</div>;
  }

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-forest-light">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-700">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-800 text-forest-dark">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-lg text-ink/40 line-through">₹{product.mrp}</span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink/70">{product.description}</p>

          <p className="mt-3 text-sm text-ink/50">
            {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>

          <AddToCartBox product={product} />
        </div>
      </div>
    </div>
  );
}
