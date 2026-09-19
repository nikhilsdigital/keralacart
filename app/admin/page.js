import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export default async function AdminDashboard() {
  await connectDB();
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const revenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.totalAmount : 0), 0);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Orders", value: orderCount },
    { label: "Users", value: userCount },
    { label: "Recent Revenue", value: `₹${revenue}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-700">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-ink/10 p-5">
            <p className="text-sm text-ink/50">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-700 text-forest-dark">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
