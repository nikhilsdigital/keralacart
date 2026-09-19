

# KeralaCart — Full Stack E-commerce (Next.js + MongoDB + Razorpay)

ഈ README ആണ് നിങ്ങളുടെ YouTube വീഡിയോയുടെ **സ്റ്റെപ്പ്-ബൈ-സ്റ്റെപ്പ് സ്ക്രിപ്റ്റ്**. ഓരോ സ്റ്റെപ്പിലും എന്ത് ചെയ്യണം, ഏത് ഫയൽ ആണ് പ്രധാനം, എന്തിനാണ് ആ കോഡ് എന്ന് വിശദീകരിച്ചിട്ടുണ്ട്.

---

## 🧩 Tech Stack

- **Frontend + Backend**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas + Mongoose (എളുപ്പം, migrations വേണ്ട, JSON പോലെ data സൂക്ഷിക്കാം, Next.js API routes-നൊപ്പം വളരെ വേഗതയേറിയത്)
- **Auth**: NextAuth.js (Credentials — email/password)
- **Payments**: Razorpay (ഇന്ത്യൻ users)
- **Styling**: Tailwind CSS (responsive, mobile-first)
- **State**: React Context (Cart) + localStorage persistence

---

## STEP 1 — Project Setup

```bash
npx create-next-app@14 keralacart --js --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd keralacart
```

എന്നിട്ട് `package.json`-ൽ ഉള്ള dependencies ഇൻസ്റ്റാൾ ചെയ്യുക:

```bash
npm install mongoose next-auth bcryptjs razorpay zustand
```

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "npx create-next-app ഉപയോഗിച്ച് നമ്മൾ ഒരു പുതിയ Next.js project ഉണ്ടാക്കുന്നു. App Router ആണ് ഉപയോഗിക്കുന്നത് — അതായത് `app/` ഫോൾഡറിൽ ആണ് നമ്മുടെ pages."

ഈ zip ഫയലിൽ `package.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js` എല്ലാം റെഡിയായി ഉണ്ട് — അതേപടി copy ചെയ്‌താൽ മതി.

---

## STEP 2 — MongoDB Atlas സെറ്റപ്പ് ചെയ്യുക

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) ൽ ഫ്രീ അക്കൗണ്ട് ഉണ്ടാക്കുക
2. ഒരു Free (M0) Cluster ക്രിയേറ്റ് ചെയ്യുക
3. Database Access → പുതിയ user (username + password) ഉണ്ടാക്കുക
4. Network Access → "Allow access from anywhere" (0.0.0.0/0) ചേർക്കുക
5. "Connect" → "Connect your application" → connection string copy ചെയ്യുക

`.env.local` ഫയൽ പ്രോജക്റ്റ് റൂട്ടിൽ ഉണ്ടാക്കി (`.env.example` നോക്കുക):

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/keralacart
NEXTAUTH_SECRET=ഏതെങ്കിലും-റാൻഡം-സ്ട്രിംഗ്
NEXTAUTH_URL=http://localhost:3000
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

**പ്രധാന ഫയൽ**: `lib/db.js` — mongoose connection കാഷ് ചെയ്ത് hot-reload-ൽ multiple connections ഉണ്ടാകാതെ നോക്കുന്നു.

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "NEXTAUTH_SECRET ജനറേറ്റ് ചെയ്യാൻ ടെർമിനലിൽ `openssl rand -base64 32` എന്ന് ടൈപ്പ് ചെയ്യാം."

---

## STEP 3 — Database Models

`models/` ഫോൾഡറിൽ 3 Mongoose schemas:

- **`User.js`** — name, email, hashed password, role (customer/admin)
- **`Product.js`** — name, slug, price, mrp, category, image, stock, featured
- **`Order.js`** — items array, shippingAddress, paymentStatus, razorpay IDs, orderStatus

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "ഓരോ Model-ഉം ഒരു MongoDB collection represent ചെയ്യുന്നു. Schema വച്ചാണ് ഓരോ ഫീൽഡിന്റെയും type നമ്മൾ define ചെയ്യുന്നത്."

---

## STEP 4 — Authentication (NextAuth + Register API)

- **`lib/auth.js`** — NextAuth config, CredentialsProvider ഉപയോഗിച്ച് email/password login. bcrypt വച്ച് password compare ചെയ്യുന്നു. JWT session-ൽ `role` കൂടി വയ്ക്കുന്നു (admin check ചെയ്യാൻ).
- **`app/api/auth/[...nextauth]/route.js`** — NextAuth handler mount ചെയ്യുന്നു
- **`app/api/auth/register/route.js`** — പുതിയ user register ചെയ്യുമ്പോൾ password bcrypt-ൽ hash ചെയ്ത് DB-യിൽ സേവ് ചെയ്യുന്നു
- **`app/login/page.js`**, **`app/register/page.js`** — UI forms

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Password ഒരിക്കലും plain text ആയി DB-യിൽ സേവ് ചെയ്യരുത് — bcrypt.hash() ഉപയോഗിച്ച് hash ചെയ്യണം. Login ചെയ്യുമ്പോൾ bcrypt.compare() വച്ച് ആണ് verify ചെയ്യുന്നത്."

**Admin user ഉണ്ടാക്കാൻ**: ആദ്യം `/register` വഴി സാധാരണ account ഉണ്ടാക്കുക, എന്നിട്ട്:

```bash
node scripts/makeAdmin.js youremail@example.com
```

---

## STEP 5 — Product Listing (Home + Shop + Product Detail)

- **`app/page.js`** — Homepage, featured products server-side fetch ചെയ്യുന്നു (React Server Component)
- **`app/shop/page.js`** — search + category filter ഉള്ള full listing
- **`app/product/[id]/page.js`** — dynamic route, single product detail
- **`components/ProductCard.js`** — reusable card, responsive grid-ൽ ഉപയോഗിക്കുന്നു

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Next.js App Router-ൽ `async function` component നേരിട്ട് database-ൽ നിന്ന് ഡാറ്റ fetch ചെയ്യാം — separate API call വേണ്ട. ഇതിനെ Server Component എന്ന് പറയും."

**Responsive design**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` — mobile-ൽ 2 columns, tablet-ൽ 3, desktop-ൽ 4.

---

## STEP 6 — Cart (Context API + localStorage)

- **`context/CartContext.js`** — addToCart, removeFromCart, updateQuantity, totalPrice. Browser refresh ചെയ്താലും cart നഷ്ടപ്പെടാതിരിക്കാൻ localStorage-ൽ സേവ് ചെയ്യുന്നു.
- **`app/cart/page.js`** — cart items list, quantity update, order summary

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Context API ഉപയോഗിച്ച് നമ്മൾ cart state മുഴുവൻ appliൽ share ചെയ്യുന്നു — prop drilling വേണ്ട. useEffect വച്ചാണ് localStorage-ലേക്ക് save/load ചെയ്യുന്നത്."

---

## STEP 7 — Checkout + Razorpay Payment

ഫ്ലോ ഇങ്ങനെ ആണ്:

1. User "Pay" ക്ലിക്ക് ചെയ്യുന്നു → `/api/razorpay` (POST) → Razorpay order ഉണ്ടാക്കുന്നു
2. `window.Razorpay` widget open ആകുന്നു (checkout.js script)
3. Payment success ആയാൽ `handler` callback-ൽ response കിട്ടുന്നു
4. `/api/razorpay/verify` → signature verify ചെയ്യുന്നു (security-ക്ക് പ്രധാനം — ഇത് skip ചെയ്യരുത്)
5. Verify ശരിയാണെങ്കിൽ `/api/orders` (POST) → order MongoDB-യിൽ save ചെയ്യുന്നു → cart clear ചെയ്യുന്നു → success page

**പ്രധാന ഫയലുകൾ**: `app/checkout/page.js`, `app/api/razorpay/route.js`, `app/api/razorpay/verify/route.js`, `app/api/orders/route.js`

Razorpay test mode API keys ഇവിടെ നിന്ന് കിട്ടും: [dashboard.razorpay.com](https://dashboard.razorpay.com) → Settings → API Keys (Test Mode)

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Payment signature verify ചെയ്യാതെ ഒരിക്കലും order 'paid' എന്ന് മാർക്ക് ചെയ്യരുത് — ഇല്ലെങ്കിൽ ആർക്കും fake payment ഉണ്ടാക്കാം. `crypto.createHmac` വച്ചാണ് നമ്മൾ ഇത് ചെയ്യുന്നത്."

---

## STEP 8 — Admin Dashboard

- **`app/admin/layout.js`** — `getServerSession` വച്ച് role check ചെയ്യുന്നു; admin അല്ലെങ്കിൽ `/login`-ലേക്ക് redirect
- **`app/admin/page.js`** — stats overview (products, orders, users count)
- **`app/admin/products/page.js`** + **`new/page.js`** — product list + add form
- **`app/admin/orders/page.js`** — എല്ലാ orders-ഉം കാണാം

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Admin routes protect ചെയ്യാൻ layout.js-ൽ തന്നെ session check ചെയ്യുന്നു. API routes-ലും (`POST /api/products` etc.) ഇതേ check ഉണ്ട് — front-end മാത്രം hide ചെയ്താൽ പോരാ, backend-ലും secure ആക്കണം."

---

## STEP 9 — Sample Data ചേർക്കുക

```bash
npm run seed
```

ഇത് 4 sample products (`scripts/seed.js`) DB-യിലേക്ക് ഇടും — video demo-ക്ക് വേഗം ആയി ഉപയോഗിക്കാൻ.

---

## STEP 10 — Run Locally & Deploy

```bash
npm run dev
```

→ http://localhost:3000

**Deploy ചെയ്യാൻ (Vercel)**:

1. GitHub-ൽ push ചെയ്യുക
2. [vercel.com](https://vercel.com) → "New Project" → repo import ചെയ്യുക
3. Environment variables (`.env.local`-ൽ ഉള്ളവ എല്ലാം) Vercel dashboard-ൽ ചേർക്കുക
4. Deploy!

> 🎥 **വീഡിയോയിൽ പറയാൻ**: "Vercel ആണ് Next.js-ന്റെ creators ഉണ്ടാക്കിയ hosting platform, free tier-ൽ തന്നെ deploy ചെയ്യാം."

---

## 📁 Full File Structure

```
keralacart/
├── app/
│   ├── page.js                 → Homepage
│   ├── shop/page.js            → Product listing
│   ├── product/[id]/page.js    → Product detail
│   ├── cart/page.js            → Cart
│   ├── checkout/page.js        → Checkout + Razorpay
│   ├── checkout/success/page.js
│   ├── login/page.js
│   ├── register/page.js
│   ├── admin/                  → Admin dashboard
│   └── api/
│       ├── auth/[...nextauth]/route.js
│       ├── auth/register/route.js
│       ├── products/route.js
│       ├── products/[id]/route.js
│       ├── orders/route.js
│       └── razorpay/route.js, razorpay/verify/route.js
├── components/                 → Navbar, Footer, ProductCard, etc.
├── context/CartContext.js
├── lib/db.js, lib/auth.js
├── models/User.js, Product.js, Order.js
├── scripts/seed.js, makeAdmin.js
└── .env.example
```

---

## 🎬 YouTube Video Structure Suggestion

1. Intro — എന്താണ് build ചെയ്യുന്നത് (0:00)
2. Project setup + Tailwind (Step 1)
3. MongoDB Atlas connect (Step 2)
4. Models design ചെയ്യൽ (Step 3)
5. Auth system (Step 4)
6. UI — Home/Shop/Product pages (Step 5)
7. Cart functionality (Step 6)
8. Razorpay checkout (Step 7) — ഏറ്റവും കൂടുതൽ ശ്രദ്ധിക്കേണ്ട ഭാഗം
9. Admin dashboard (Step 8)
10. Deploy to Vercel (Step 10)
11. Outro + demo

ഇത് പ്രകാരം video segment ചെയ്‌താൽ editing-ഉം എളുപ്പം ആകും.
#   k e r a l a c a r t 
 
 
