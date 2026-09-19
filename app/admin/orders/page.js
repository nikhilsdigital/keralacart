import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).lean();
  const data = JSON.parse(JSON.stringify(orders));

  return (
    <div>
      <h1 className="font-display text-2xl font-700">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-light">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((o) => (
              <tr key={o._id} className="border-t border-ink/10">
                <td className="p-3">{o.user?.name || "N/A"}</td>
                <td className="p-3">{o.items.length} item(s)</td>
                <td className="p-3">₹{o.totalAmount}</td>
                <td className="p-3">
                  <span className={o.paymentStatus === "paid" ? "text-forest-dark" : "text-mustard-dark"}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-3">{o.orderStatus}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && <p className="mt-6 text-ink/60">ഇതുവരെ orders ഒന്നും ഇല്ല.</p>}
    </div>
  );
}
