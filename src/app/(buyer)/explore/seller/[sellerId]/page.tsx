'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, PackageX, ChevronLeft } from 'lucide-react';
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

    // ── Unique categories derived from products
    const categories: Category[] = [];
    const seenCatIds = new Set<string>();
    for (const p of products) {
        if (p.category?._id && !seenCatIds.has(p.category._id)) {
            seenCatIds.add(p.category._id);
            categories.push({ _id: p.category._id, name: p.category.name });
        }
    }

    // ── Group by category._id, carry name for display
    const groupedProducts: GroupedProducts = products
        .filter(p => activeCategory === null || p.category?._id === activeCategory)
        .reduce<GroupedProducts>((acc, product) => {
            const id = product.category?._id ?? 'uncategorized';
            const name = product.category?.name ?? 'All';
            if (!acc[id]) acc[id] = { name, items: [] };
            acc[id].items.push(product);
            return acc;
        }, {});

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

            {categories.length > 0 && (
                <div className="sticky top-0 z-10 bg-[var(--txt-clr)]/90 backdrop-blur-md border-b border-[var(--sec-clr)]/30">
                    <div className="px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">

                        {/* All pill */}
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${activeCategory === null
                                    ? 'bg-[var(--bg-clr)] text-[var(--txt-clr)] border-[var(--bg-clr)]'
                                    : 'bg-[var(--txt-clr)] text-[var(--pry-clr)] border-[var(--sec-clr)]'
                                }`}
                        >
                            All
                        </button>

                        {/* Per-category pill — renders cat.name */}
                        {categories.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() =>
                                    setActiveCategory(activeCategory === cat._id ? null : cat._id)
                                }
                                className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${activeCategory === cat._id
                                        ? 'bg-[var(--bg-clr)] text-[var(--txt-clr)] border-[var(--bg-clr)]'
                                        : 'bg-[var(--txt-clr)] text-[var(--pry-clr)] border-[var(--sec-clr)]'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-4 pt-5 space-y-8">
                {Object.keys(groupedProducts).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <PackageX className="w-10 h-10 text-[var(--sec-clr)]" />
                        <p className="text-sm font-medium text-[var(--sec-clr)]">
                            No products found
                        </p>
                    </div>
                )}

                {Object.entries(groupedProducts).map(([id, { name, items }]) => (
                    <section key={id}>

                        {/* Section heading — category.name */}
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-[var(--pry-clr)]">
                                {name}
                            </h2>
                            <div className="flex-1 h-px bg-[var(--sec-clr)]/30" />
                            <span className="text-[10px] font-semibold text-[var(--sec-clr)]">
                                {items.length} item{items.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* 3-col grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {items.map(product => (
                                <Link
                                    key={product._id}
                                    href={`/explore/product/${product._id}`}
                                    className="group block rounded-2xl overflow-hidden border border-[var(--sec-clr)]/40 bg-[var(--txt-clr)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--bg-clr)]/60"
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-square overflow-hidden">
                                        {product.productImg?.[0] ? (
                                            <Image
                                                src={product.productImg[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--sec-clr)]/20 flex items-center justify-center">
                                                <PackageX className="w-6 h-6 text-[var(--sec-clr)]" />
                                            </div>
                                        )}

                                        {/* Rating badge */}
                                        {product.rating !== undefined && (
                                            <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-[var(--pry-clr)]/65 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                <Star className="w-2.5 h-2.5 fill-[var(--acc-clr)] stroke-[var(--acc-clr)]" />
                                                <span className="text-[10px] font-bold text-[var(--txt-clr)]">
                                                    {product.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Out of stock overlay */}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-[var(--pry-clr)]/65 flex flex-col items-center justify-center gap-1.5">
                                                <PackageX className="w-5 h-5 text-[var(--txt-clr)]" />
                                                <span className="text-[9px] font-black text-[var(--txt-clr)] uppercase tracking-widest">
                                                    Sold out
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="p-2.5 space-y-1">
                                        <p className="text-[11px] font-semibold truncate leading-tight text-[var(--pry-clr)]">
                                            {product.title}
                                        </p>

                                        <p className="text-xs font-black text-[var(--bg-clr)]">
                                            ₦{product.price.toLocaleString()}
                                        </p>

                                        {product.prepTime && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5 flex-shrink-0 text-[var(--sec-clr)]" />
                                                <span className="text-[10px] text-[var(--sec-clr)]">
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