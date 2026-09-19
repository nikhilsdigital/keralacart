// Run with: node scripts/makeAdmin.js youremail@example.com
// Turns an already-registered user into an admin (so they can access /admin).
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/makeAdmin.js youremail@example.com");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await User.updateOne({ email }, { $set: { role: "admin" } });
  if (res.matchedCount === 0) {
    console.log("❌ No user found with that email. Register first from /register.");
  } else {
    console.log(`✅ ${email} is now an admin.`);
  }
  process.exit(0);
}

run();
