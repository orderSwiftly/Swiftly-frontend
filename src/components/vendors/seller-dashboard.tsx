'use client';
import React from 'react';
import {
    Search,
    Utensils,
    Shirt,
    Sparkles,
    Smartphone,
    Cpu,
    PenTool,
    HeartPulse,
    LayoutGrid,
} from 'lucide-react';

import ExplorePage from '@/app/(buyer)/explore/exploreComp';

export default function DashboardPage() {
    const Categories = [
        { name: 'Food', icon: Utensils, bg: 'bg-orange-100', color: 'text-orange-600' },
        { name: 'Fashion', icon: Shirt, bg: 'bg-pink-100', color: 'text-pink-600' },
        { name: 'Beauty', icon: Sparkles, bg: 'bg-purple-100', color: 'text-purple-600' },
        { name: 'Gadgets', icon: Smartphone, bg: 'bg-blue-100', color: 'text-blue-600' },
        { name: 'Electronics', icon: Cpu, bg: 'bg-indigo-100', color: 'text-indigo-600' },
        { name: 'Stationeries', icon: PenTool, bg: 'bg-yellow-100', color: 'text-yellow-600' },
        { name: 'Care', icon: HeartPulse, bg: 'bg-red-100', color: 'text-red-600' },
        { name: 'Others', icon: LayoutGrid, bg: 'bg-gray-200', color: 'text-gray-700' },
    ];

    return (
        <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start pb-10 pry-ff">

            {/* Search Section */}
            <div className="mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="relative max-w-6xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        placeholder="Search for items, shops or brands"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
            </div>

            {/* Categories Section */}
            <section className="mt-12 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pry-ff">
                        Categories
                    </h2>
                    <button className="text-sm md:text-base font-medium text-green-600 hover:text-green-700">
                        See all
                    </button>
                </div>

                {/* Grid layout on all screen sizes */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {Categories.map((cat) => (
                        <div
                            key={cat.name}
                            className="flex flex-col items-center gap-2"
                        >
                            <div
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${cat.bg}`}
                            >
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors text-center">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Referral Card */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <div className="bg-green-600 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between shadow-lg text-white">
                    <div className="text-center sm:text-left">
                        <p className="text-xl md:text-3xl font-bold">
                            Refer a friend and get <span className="underline decoration-yellow-400">50% OFF</span>
                        </p>
                        <p className="text-green-100 mt-2 text-sm md:text-lg">
                            Share your code and save on your next 5 orders.
                        </p>
                    </div>
                    <button className="mt-6 sm:mt-0 px-8 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                        Refer Now
                    </button>
                </div>
            </section>

            {/* Explore Section */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <ExplorePage />
            </section>

        </main>
    );
}