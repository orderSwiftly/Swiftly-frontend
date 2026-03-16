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
    const [searchInput, setSearchInput] = React.useState('');
    const [activeSearch, setActiveSearch] = React.useState('');
    const [activeCategory, setActiveCategory] = React.useState('');

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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            setActiveCategory('');
            setActiveSearch(searchInput.trim());
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        setActiveSearch('');
        setSearchInput('');
        setActiveCategory(prev => prev === categoryName ? '' : categoryName);
    };

    return (
        <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start pb-10 pry-ff">

            {/* Search Section */}
            <div className="mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="relative max-w-6xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        placeholder="Search for items, shops or brands"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearch}
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
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {Categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${cat.bg} ${activeCategory === cat.name ? 'ring-2 ring-green-500' : ''}`}
                            >
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className={`text-xs md:text-sm font-medium transition-colors text-center ${activeCategory === cat.name ? 'text-green-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Explore Section */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <ExplorePage searchTerm={activeSearch} categoryName={activeCategory} />
            </section>

        </main>
    );
}