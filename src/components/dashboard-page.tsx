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
    Clock,
    Package,
    Truck,
    Calendar,
    AlertCircle,
} from 'lucide-react';

import ExplorePage from '@/app/(buyer)/explore/exploreComp';

// Delivery window data
const deliveryWindows = [
    { orderWindow: "7:00 - 9:00 AM", deliveryWindow: "10:00 - 11:30 AM" },
    { orderWindow: "9:00 - 11:00 AM", deliveryWindow: "12:00 - 1:30 PM" },
    { orderWindow: "11:00 - 1:00 PM", deliveryWindow: "2:00 - 3:30 PM" },
    { orderWindow: "1:00 - 3:00 PM", deliveryWindow: "4:00 - 5:30 PM" },
    { orderWindow: "3:00 - 5:00 PM", deliveryWindow: "6:00 - 7:30 PM" },
    { orderWindow: "5:00 - 7:00 PM", deliveryWindow: "7:30 - 8:00 PM" },
];

export default function DashboardPage() {
    const [searchInput, setSearchInput] = React.useState('');
    const [activeSearch, setActiveSearch] = React.useState('');
    const [activeCategory, setActiveCategory] = React.useState('');

    const Categories = [
        { name: 'All', icon: LayoutGrid, bg: 'bg-gray-100', color: 'text-gray-700' },
        { name: 'Food', icon: Utensils, bg: 'bg-orange-100', color: 'text-orange-600' },
        { name: 'Fashion', icon: Shirt, bg: 'bg-pink-100', color: 'text-pink-600' },
        { name: 'Beauty', icon: Sparkles, bg: 'bg-purple-100', color: 'text-purple-600' },
        { name: 'Gadgets', icon: Smartphone, bg: 'bg-blue-100', color: 'text-blue-600' },
        { name: 'Electronics', icon: Cpu, bg: 'bg-indigo-100', color: 'text-indigo-600' },
        { name: 'Stationeries', icon: PenTool, bg: 'bg-yellow-100', color: 'text-yellow-600' },
        { name: 'Care', icon: HeartPulse, bg: 'bg-red-100', color: 'text-red-600' },
    ];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            setActiveCategory('');
            setActiveSearch(searchInput.trim());
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        if (categoryName === 'All') {
            setActiveCategory('');
            setActiveSearch('');
            setSearchInput('');
        } else {
            setActiveSearch('');
            setSearchInput('');
            setActiveCategory(prev => prev === categoryName ? '' : categoryName);
        }
    };

    return (
        <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start pb-10 pry-ff">

            {/* Search Section */}
            <div className="mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="relative max-w-6xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        placeholder="Search for products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
            </div>

            {/* Responsive Grid Delivery Window */}
            <section className="mt-6 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Delivery Schedule</h3>
                            <p className="text-xs text-gray-500">Order windows & delivery times</p>
                        </div>
                    </div>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {deliveryWindows.map((slot, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                {/* Order Window */}
                                <div className="mb-2 pb-1.5 border-b border-gray-50">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Calendar className="w-3 h-3 text-blue-400" />
                                        <span className="text-[10px] font-medium text-gray-500">Order</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs font-semibold text-gray-800">
                                            {slot.orderWindow}
                                        </span>
                                    </div>
                                </div>

                                {/* Delivery Window */}
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Truck className="w-3 h-3 text-green-400" />
                                        <span className="text-[10px] font-medium text-gray-500">Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-3 h-3 text-green-500" />
                                        <span className="text-xs font-semibold text-gray-700">
                                            {slot.deliveryWindow}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Note */}
                    <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-500 bg-white/50 rounded-lg p-2">
                        <AlertCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <p className="text-[11px]">Order before 7PM for same-day delivery</p>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pry-ff">
                        Categories
                    </h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                    {Categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${cat.bg} ${
                                    (cat.name === 'All' && !activeCategory) || activeCategory === cat.name 
                                        ? 'ring-2 ring-green-500' 
                                        : ''
                                }`}
                            >
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className={`text-xs md:text-sm font-medium transition-colors text-center ${
                                (cat.name === 'All' && !activeCategory) || activeCategory === cat.name 
                                    ? 'text-green-600 font-semibold' 
                                    : 'text-gray-600 group-hover:text-gray-900'
                            }`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Explore Section */}
            <section className="mt-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mb-5">
                <ExplorePage searchTerm={activeSearch} categoryName={activeCategory} />
            </section>

        </main>
    );
}