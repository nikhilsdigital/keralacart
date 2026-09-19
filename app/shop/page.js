import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

async function getProducts(searchParams) {
  await connectDB();
  const query = {};
  if (searchParams.category && searchParams.category !== "all") query.category = searchParams.category;
  if (searchParams.search) query.name = { $regex: searchParams.search, $options: "i" };

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function ShopPage({ searchParams }) {
  const products = await getProducts(searchParams || {});
  const categories = ["all", "electronics", "fashion", "home", "grocery", "beauty"];

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <h1 className="font-display text-3xl font-700">Shop</h1>

      {/* filters */}
      <form className="mt-6 flex flex-wrap items-center gap-3" method="get">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={searchParams?.search || ""}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm outline-none focus:border-forest"
        />
        <select
          name="category"
          defaultValue={searchParams?.category || "all"}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm outline-none focus:border-forest"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white">
          Filter
        </button>
      </form>

      {/* grid */}
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-ink/60">ഒരു ഉൽപ്പന്നവും കിട്ടിയില്ല.</p>
      )}
    </div>
  );
}
