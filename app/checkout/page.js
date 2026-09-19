"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);

    try {
      // 1. Create a Razorpay order on the server
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const razorpayOrder = await orderRes.json();

      // 2. Open the Razorpay checkout widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "KeralaCart",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. Verify signature on the server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.valid) {
            // 4. Save the order in MongoDB
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: items.map((i) => ({
                  product: i._id,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  image: i.image,
                })),
                totalAmount: totalPrice,
                shippingAddress: address,
                paymentStatus: "paid",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
              }),
            });
            clearCart();
            router.push("/checkout/success");
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: session.user.email,
        },
        theme: { color: "#1F6F50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="mx-auto max-w-content px-5 py-10">
        <h1 className="font-display text-3xl font-700">Checkout</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="font-display text-lg font-700">Shipping Address</h2>
            {["fullName", "phone", "addressLine", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={address[field]}
                onChange={handleChange}
                className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-forest"
              />
            ))}
          </div>

          <div className="h-fit rounded-xl border border-ink/10 p-6">
            <h2 className="font-display text-lg font-700">Order Summary</h2>
            <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-700">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-forest py-3 font-semibold text-white hover:bg-forest-dark disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
