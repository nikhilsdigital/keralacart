import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET /api/products?category=xxx&search=xxx
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const query = {};
  if (category && category !== "all") query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// POST /api/products  (admin only)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();

  const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const product = await Product.create({ ...body, slug: `${slug}-${Date.now()}` });

  return NextResponse.json(product, { status: 201 });
}
