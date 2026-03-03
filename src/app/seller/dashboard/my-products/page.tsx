// app/dashboard/my-products/page.tsx
import ProductCard from './product-card';

export default function MyProducts() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[30px] flex justify-between px-2">
      <section className="w-full mx-auto">
        <ProductCard />
      </section>
    </main>
  );
}