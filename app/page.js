import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({ featured: true }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-forest-light">
        <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="font-display text-4xl font-800 leading-tight text-forest-dark md:text-5xl">
              Kerala-inspired essentials, delivered to your door.
            </h1>
            <p className="mt-4 max-w-md text-ink/70">
              Handpicked products, fast checkout with Razorpay, and honest pricing.
              Built as a learning project with Next.js and MongoDB.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-forest px-7 py-3 font-semibold text-white transition hover:bg-forest-dark"
            >
              Shop the collection
            </Link>
          </div>
          <div className="hidden justify-self-end md:block">
            <div className="h-64 w-64 rounded-full bg-mustard/30" />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-content px-5 py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-700">Featured products</h2>
          <Link href="/shop" className="text-sm font-medium text-forest-dark">View all →</Link>
        </div>

        {products.length === 0 ? (
          <p className="text-ink/60">
            ഇവിടെ products ഒന്നും ഇല്ല. Admin panel വഴി products ചേർക്കുക, അല്ലെങ്കിൽ <code>npm run seed</code> റൺ ചെയ്യുക.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
