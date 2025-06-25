'use client';

import { useState } from 'react';
import AddProducts from './add-products';
import ProductList from './product-list';
import { Plus } from 'lucide-react';

export default function ProductCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="h-full w-full bg-[var(--light-bg)] p-6">
      {/* Header with Button */}
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--txt-clr)] pry-ff">Product List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-4 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition flex items-center justify-start gap-x-2 pry-ff cursor-pointer"
        >
          <Plus size={16} /> <span>Add Product</span>
        </button>
      </div>


      {/* Modal */}
      {isModalOpen && <AddProducts closeModal={() => setIsModalOpen(false)} />}

      {/* Product List */}
      <ProductList />
    </main>
  );
}