'use client';

import { useState, useEffect } from 'react';
import AddProducts from './add-products';
import ProductList from './product-list';
import { Plus, Package, AlertTriangle, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <main className="min-h-screen w-full bg-[var(--txt-clr)] sec-ff mb-20">

      {/* ── Top banner ─────────────────────────────── */}
      <div className="bg-[#006B4F] px-5 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5">
              <Package size={22} className="text-[#9BDD37]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Product List</h1>
              <p className="text-white/55 text-sm mt-0.5">Manage and track all your listings</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#9BDD37] text-[#0A0F1A] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#89cc28] transition-colors self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5">

        {/* ── No-subaccount warning banner ───────────── */}
        {showBanner && (
          <div className="flex items-start sm:items-center justify-between gap-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3.5 mb-6">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Bank account not set up</p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  You need to link a bank account before you can receive payments.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/seller/dashboard/profile/account"
                className="flex items-center gap-1 text-xs font-semibold text-yellow-800 hover:text-yellow-900 transition-colors whitespace-nowrap"
              >
                Set up now
                <ArrowRight size={12} />
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors p-0.5"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Product list ────────────────────────────── */}
        <ProductList />
      </div>

      {/* ── Add product modal ───────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#0A0F1A]/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000] px-0 sm:px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh]">

            {/* Sticky modal header */}
            <div className="bg-[#006B4F] px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Plus size={18} className="text-[#9BDD37]" />
                <h2 className="text-white font-semibold">Add New Product</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-6">
              <AddProducts closeModal={() => setIsModalOpen(false)} />
            </div>

          </div>
        </div>
      )}
    </main>
  );
}