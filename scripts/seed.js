// Run with: npm run seed
// Adds a few sample products so your homepage/shop isn't empty.
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    mrp: Number,
    category: String,
    image: String,
    stock: Number,
    featured: Boolean,
  },
  { timestamps: true }
);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const sampleProducts = [
  {
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    description: "Compact wireless earbuds with 24-hour battery life.",
    price: 1499,
    mrp: 2499,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
    stock: 25,
    featured: true,
  },
  {
    name: "Cotton Kurta",
    slug: "cotton-kurta",
    description: "Breathable handwoven cotton kurta, perfect for daily wear.",
    price: 899,
    mrp: 1299,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600",
    stock: 40,
    featured: true,
  },
  {
    name: "Ceramic Coffee Mug Set",
    slug: "ceramic-mug-set",
    description: "Set of 2 handcrafted ceramic mugs.",
    price: 599,
    mrp: 799,
    category: "home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
    stock: 30,
    featured: true,
  },
  {
    name: "Coconut Oil (500ml)",
    slug: "coconut-oil-500ml",
    description: "Cold-pressed virgin coconut oil from Kerala.",
    price: 249,
    category: "grocery",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    stock: 60,
    featured: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("✅ Sample products added!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
