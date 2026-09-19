export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-forest-dark py-10 text-forest-light">
      <div className="mx-auto max-w-content px-5">
        <p className="font-display text-lg font-700">KeralaCart</p>
        <p className="mt-2 max-w-md text-sm opacity-80">
          Next.js, MongoDB &amp; Razorpay ഉപയോഗിച്ച് ഉണ്ടാക്കിയ ഒരു full-stack e-commerce ട്യൂട്ടോറിയൽ പ്രോജക്റ്റ്.
        </p>
        <p className="mt-6 text-xs opacity-60">© {new Date().getFullYear()} KeralaCart. Built for learning purposes.</p>
      </div>
    </footer>
  );
}
