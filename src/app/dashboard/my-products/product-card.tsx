'use client';

import { useState } from 'react';
import AddProducts from './add-products';
import ProductList from './product-list'

export default function ProductCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] p-6">
      {/* Header with Button */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[var(--bg-clr)] pry-ff">My Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <AddProducts closeModal={() => setIsModalOpen(false)} />}

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Placeholder for now */}
        <div className="bg-transparent p-4 min-h-[180px] flex items-center justify-center">
          <ProductList />
        </div>
      </section>
    </main>
  );
}