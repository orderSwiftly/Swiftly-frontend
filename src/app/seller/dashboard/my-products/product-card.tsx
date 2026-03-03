'use client';

import { useState, useEffect } from 'react';
import AddProducts from './add-products';
import ProductList from './product-list';
import { Plus } from 'lucide-react';

export default function ProductCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkSubaccount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/subaccount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Assume your backend returns something like: { hasSubaccount: true/false }
        if (!data.hasSubaccount) {
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error checking subaccount status:', error);
      }
    };

    checkSubaccount();
  }, []);

  return (
    <main className="h-full w-full bg-[var(--light-bg)] p-4 sm:p-6 pb-20">

      {/* Header with Add Product button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--txt-clr)] pry-ff">
          Product List
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-4 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-x-2 pry-ff w-full sm:w-auto"
        >
          <Plus size={16} /> <span>Add Product</span>
        </button>

      </div>

      {isModalOpen && <AddProducts closeModal={() => setIsModalOpen(false)} />}
      <ProductList />
    </main>
  );
}