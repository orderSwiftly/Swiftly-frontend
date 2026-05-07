'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, PackageX, ChevronLeft, Utensils, Shirt, Smartphone, Cpu, Sparkles, HeartPulse, Package, Grid3x3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PulseLoader from '@/components/pulse-loader';

type Category = {
    _id: string;
    name: string;
};

type Product = {
    _id: string;
    title: string;
    price: number;
    productImg: string[];
    stock: number;
    rating?: number;
    prepTime?: string;
    category?: Category;
};

type Seller = {
    _id: string;
    businessName: string;
    logo?: string;
    openTime?: string;
    closeTime?: string;
};

type GroupedProducts = Record<string, { name: string; items: Product[] }>;

export default function SellerDetailPage() {
    const { sellerId } = useParams<{ sellerId: string }>();
    const router = useRouter();

    const [seller, setSeller] = useState<Seller | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchSellerProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const res = await fetch(`${apiUrl}/api/v1/user/profile/${sellerId}`);
                const data = await res.json();

                if (!res.ok || data.status !== 'success') {
                    setError(data.message || 'Failed to load seller');
                    return;
                }

                setSeller(data.data.seller);
                setProducts(data.data.products ?? []);
            } catch {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProducts();
    }, [sellerId]);

    // Group products by category name (not just ID) to ensure proper grouping
    const categoriesMap = new Map<string, Category>();
    const productsWithCategories = products.filter(p => p.category && p.category.name);
    
    // Track unique categories by name
    productsWithCategories.forEach(product => {
        if (product.category && product.category.name) {
            const categoryKey = product.category.name.toLowerCase();
            if (!categoriesMap.has(categoryKey)) {
                categoriesMap.set(categoryKey, {
                    _id: product.category._id,
                    name: product.category.name
                });
            }
        }
    });

    // Add "Other" category for products without a category
    const hasUncategorized = products.some(p => !p.category || !p.category.name);
    const categories = Array.from(categoriesMap.values());
    
    // Sort categories alphabetically
    categories.sort((a, b) => a.name.localeCompare(b.name));

    // Function to get icon based on category name
    const getCategoryIcon = (categoryName: string) => {
        const nameLower = categoryName.toLowerCase();
        if (nameLower.includes('food') || nameLower.includes('restaurant')) {
            return <Utensils size={16} />;
        }
        if (nameLower.includes('fashion') || nameLower.includes('clothing')) {
            return <Shirt size={16} />;
        }
        if (nameLower.includes('gadget') || nameLower.includes('phone')) {
            return <Smartphone size={16} />;
        }
        if (nameLower.includes('electronic')) {
            return <Cpu size={16} />;
        }
        if (nameLower.includes('beauty')) {
            return <Sparkles size={16} />;
        }
        if (nameLower.includes('care') || nameLower.includes('health')) {
            return <HeartPulse size={16} />;
        }
        if (nameLower === 'other') {
            return <Package size={16} />;
        }
        return <Grid3x3 size={16} />;
    };

    // Group products by category name
    const groupedProducts: GroupedProducts = products
        .filter(p => activeCategory === null || (p.category?.name && p.category.name === activeCategory))
        .reduce<GroupedProducts>((acc, product) => {
            // Use category name as the grouping key, fallback to "Other"
            const categoryName = product.category?.name || 'Other';
            const displayName = product.category?.name || 'Other Items';
            
            // Use category name as key for consistent grouping
            const key = categoryName;
            
            if (!acc[key]) {
                acc[key] = { name: displayName, items: [] };
            }
            acc[key].items.push(product);
            return acc;
        }, {});

    // Sort groups by category name
    const sortedGroupEntries = Object.entries(groupedProducts).sort((a, b) => 
        a[0].localeCompare(b[0])
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--txt-clr)]">
                <PulseLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--txt-clr)] pry-ff">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--txt-clr)] pb-28 pry-ff">

            <div className="relative w-full h-52 overflow-hidden">
                {seller?.logo ? (
                    <Image
                        src={seller.logo}
                        alt={seller.businessName ?? 'Seller'}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-[var(--bg-clr)]" />
                )}

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pry-clr)]/85 via-[var(--pry-clr)]/40 to-[var(--bg-clr)]/20" />

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm border border-[var(--txt-clr)]/20 bg-[var(--bg-clr)]/50"
                >
                    <ChevronLeft className="w-5 h-5 text-[var(--txt-clr)]" />
                </button>

                {/* Seller name + hours */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <h1 className="text-2xl font-black tracking-tight text-[var(--txt-clr)] leading-none sec-ff">
                        {seller?.businessName}
                    </h1>
                    {(seller?.openTime || seller?.closeTime) && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--acc-clr)]" />
                            <Clock className="w-3 h-3 text-[var(--acc-clr)]" />
                            <p className="text-xs font-semibold text-[var(--acc-clr)]">
                                {seller.openTime} – {seller.closeTime}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter Pills */}
            {(categories.length > 0 || hasUncategorized) && (
                <div className="sticky top-0 z-10 bg-[var(--txt-clr)]/90 backdrop-blur-md border-b border-[var(--sec-clr)]/30">
                    <div className="px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
                        {/* All pill */}
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                                activeCategory === null
                                    ? 'bg-[var(--bg-clr)] text-[var(--txt-clr)] border-[var(--bg-clr)]'
                                    : 'bg-[var(--txt-clr)] text-[var(--pry-clr)] border-[var(--sec-clr)]'
                            }`}
                        >
                            All ({products.length})
                        </button>

                        {/* Per-category pill */}
                        {categories.map(cat => {
                            const categoryItemCount = products.filter(p => p.category?.name === cat.name).length;
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                                        activeCategory === cat.name
                                            ? 'bg-[var(--bg-clr)] text-[var(--txt-clr)] border-[var(--bg-clr)]'
                                            : 'bg-[var(--txt-clr)] text-[var(--pry-clr)] border-[var(--sec-clr)]'
                                    }`}
                                >
                                    {getCategoryIcon(cat.name)}
                                    {cat.name} ({categoryItemCount})
                                </button>
                            );
                        })}

                        {/* Other category for uncategorized products */}
                        {hasUncategorized && (
                            <button
                                onClick={() => setActiveCategory(activeCategory === 'Other' ? null : 'Other')}
                                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                                    activeCategory === 'Other'
                                        ? 'bg-[var(--bg-clr)] text-[var(--txt-clr)] border-[var(--bg-clr)]'
                                        : 'bg-[var(--txt-clr)] text-[var(--pry-clr)] border-[var(--sec-clr)]'
                                }`}
                            >
                                <Package size={14} />
                                Other ({products.filter(p => !p.category || !p.category.name).length})
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="px-4 pt-5 space-y-8">
                {sortedGroupEntries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <PackageX className="w-10 h-10 text-[var(--sec-clr)]" />
                        <p className="text-sm font-medium text-[var(--sec-clr)]">
                            No products found
                        </p>
                    </div>
                )}

                {sortedGroupEntries.map(([categoryName, { name, items }]) => (
                    <section key={categoryName}>
                        {/* Section heading with icon */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bg-clr)]/10 to-[var(--bg-clr)]/5 flex items-center justify-center text-[var(--bg-clr)]">
                                {getCategoryIcon(categoryName)}
                            </div>
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--pry-clr)]">
                                    {name}
                                </h2>
                                <p className="text-[10px] text-[var(--sec-clr)] font-medium">
                                    {items.length} {items.length === 1 ? 'item' : 'items'} available
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-[var(--sec-clr)]/30 to-transparent" />
                        </div>

                        {/* Responsive grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {items.map(product => (
                                <Link
                                    key={product._id}
                                    href={`/explore/product/${product._id}`}
                                    className="group block rounded-xl overflow-hidden border border-[var(--sec-clr)]/20 bg-[var(--txt-clr)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--bg-clr)]/40"
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-square overflow-hidden">
                                        {product.productImg?.[0] ? (
                                            <Image
                                                src={product.productImg[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <PackageX className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}

                                        {/* Rating badge */}
                                        {product.rating !== undefined && product.rating > 0 && (
                                            <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                                                <span className="text-[10px] font-bold text-white">
                                                    {product.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Out of stock overlay */}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1">
                                                <PackageX className="w-6 h-6 text-white" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                    Sold out
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="p-3 space-y-1.5">
                                        <p className="text-xs font-semibold truncate leading-tight text-[var(--pry-clr)]">
                                            {product.title}
                                        </p>

                                        <p className="text-sm font-black text-[var(--bg-clr)]">
                                            ₦{product.price.toLocaleString()}
                                        </p>

                                        {product.prepTime && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5 flex-shrink-0 text-[var(--sec-clr)]" />
                                                <span className="text-[9px] font-medium text-[var(--sec-clr)]">
                                                    {product.prepTime}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}