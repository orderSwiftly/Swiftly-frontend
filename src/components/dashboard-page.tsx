'use client';
import { Search } from 'lucide-react';

export default function DashboardPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col items-center justify-start pb-10">

            {/* Search */}
            <div className="mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <input
                        placeholder="Search"
                        className="w-full pl-12 pr-4 py-3.5 sm:py-3 md:py-3.5 rounded-xl bg-white border border-gray-200 text-base sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Categories */}
            <section className="mt-12 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-800">Categories</h2>
                    <button className="text-base sm:text-base md:text-lg text-green-600">See all</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5 md:gap-6">
                    {['Fruits', 'Drinks', 'Rice', 'Noodles'].map((item) => (
                        <div key={item} className="flex flex-col items-center gap-2 sm:gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-600 rounded-md" />
                            </div>
                            <span className="text-sm sm:text-sm md:text-base text-gray-600">{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Referral Card */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4 sm:gap-0">
                    <div>
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                            Refer a friend and get <span className="text-green-600">50%</span>
                        </p>
                        <p className="text-base sm:text-base md:text-lg text-gray-500 mt-1 sm:mt-2">
                            off all your orders
                        </p>
                    </div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-green-100 rounded-xl" />
                </div>
            </section>

            {/* Explore */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6">Explore</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    {['food', 'fashion', 'laundry', 'toiletry', 'care'].map((item) => (
                        <div key={item} className="bg-white rounded-xl p-3 sm:p-4 md:p-5 text-center shadow-sm">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-lg mx-auto mb-2 sm:mb-3" />
                            <p className="text-sm sm:text-sm md:text-base capitalize text-gray-600">{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Food */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6">Featured Food</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm">
                            <div className="w-full h-28 sm:h-32 md:h-36 bg-gray-200 rounded-lg mb-3 sm:mb-4 md:mb-4" />
                            <p className="font-medium text-base md:text-lg">Jollof</p>
                            <p className="text-sm md:text-base text-gray-500">₦7,000 • 30 mins</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Shops */}
            <section className="mt-14 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6">Featured Shops</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm">
                            <div className="w-full h-16 sm:h-20 md:h-24 bg-gray-200 rounded-md" />
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}