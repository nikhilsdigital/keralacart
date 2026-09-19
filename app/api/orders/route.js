import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// GET: logged-in user's own orders, or ALL orders for admin (?all=true)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  if (all === "true" && session.user.role === "admin") {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    return NextResponse.json(orders);
  }

  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// POST: create a new order (called after Razorpay payment verified, or COD)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const order = await Order.create({
    ...body,
    user: session.user.id,
  });

  return NextResponse.json(order, { status: 201 });
}
