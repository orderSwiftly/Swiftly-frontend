// app/dashboard/my-products/page.tsx
import ProductCard from './product-card';

export default function MyProducts() {
  return (
    <main className="min-h-screen bg-[var(--light-bg)] p-6">
      <section className="max-w-7xl mx-auto">
        <ProductCard />
      </section>
    </main>
  );
}