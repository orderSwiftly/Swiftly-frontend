// app/dashboard/my-products/page.tsx
import ProductCard from './product-card';

export default function MyProducts() {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center bg-[var(--light-bg)] p-4">
        <h1 className="text-2xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">My Products</h1>
        <p className="text-[var(--txt-clr)]/70 sec-ff">Manage your listed items here.</p>

        <article className='flex items-center w-full max-w-3xl'>
          <ProductCard />
        </article>
      </main>
    );
}