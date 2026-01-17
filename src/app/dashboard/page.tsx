'use client';

import Image from 'next/image';
import SidebarNav from '@/components/sidebar-nav';
import { Search, Bell } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">

      <SidebarNav />
      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Categories</h2>
          <button className="text-sm text-green-600">See all</button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {['Fruits', 'Drinks', 'Rice', 'Noodles'].map((item) => (
            <div
              key={item}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-md" />
              </div>
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Card */}
      <section className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-semibold text-gray-800">
              Refer a friend now<br />and get <span className="text-green-600">50%</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              off all your orders
            </p>
          </div>

          <div className="w-20 h-20 bg-green-100 rounded-xl" />
        </div>
      </section>

      {/* Explore */}
      <section className="px-4 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Explore</h2>

        <div className="grid grid-cols-5 gap-3">
          {['food', 'fashion', 'laundry', 'toiletry', 'care'].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-2 text-center shadow-sm"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-1" />
              <p className="text-[10px] capitalize text-gray-600">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Food */}
      <section className="px-4 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Featured Food</h2>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm"
            >
              <div className="w-full h-24 bg-gray-200 rounded-lg mb-2" />
              <p className="font-medium text-sm">Jollof</p>
              <p className="text-xs text-gray-500">₦7,000 • 300mins</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Shops */}
      <section className="px-4 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Featured Shops</h2>

        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm"
            >
              <div className="w-full h-12 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <div className="w-6 h-6 bg-green-600 rounded-md" />
        <div className="w-6 h-6 bg-gray-300 rounded-md" />
        <div className="w-6 h-6 bg-gray-300 rounded-md" />
        <div className="w-6 h-6 bg-gray-300 rounded-md" />
        <div className="w-6 h-6 bg-gray-300 rounded-md" />
      </nav>

    </main>
  );
}
