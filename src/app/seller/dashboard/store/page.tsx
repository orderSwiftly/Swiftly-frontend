// src/app/seller/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchSellerProfile, SellerProfile } from "@/lib/seller";
import {
    MapPin,
    Package,
    Layers,
    TrendingUp,
    CalendarDays,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
} from "lucide-react";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function ProductCard({ product }: { product: SellerProfile["products"][0] }) {
    const [imgIndex, setImgIndex] = useState(0);
    const outOfStock = product.stock === 0;
    const hasMultiple = product.productImg.length > 1;

    const prev = () =>
        setImgIndex((i) => (i - 1 + product.productImg.length) % product.productImg.length);
    const next = () =>
        setImgIndex((i) => (i + 1) % product.productImg.length);

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-[#006B4F]/10 hover:border-[#9BDD37] sec-ff">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-[#f5f5f5] overflow-hidden group">
                <img
                    src={product.productImg[imgIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Carousel controls */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#0A0F1A]/60 hover:bg-[#0A0F1A]/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0A0F1A]/60 hover:bg-[#0A0F1A]/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {product.productImg.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImgIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-[#9BDD37] scale-125" : "bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Category badge */}
                <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-[#0A0F1A]/70 backdrop-blur-sm text-white border border-white/10">
                    {product.category.name}
                </span>

                {/* Stock badge */}
                <span
                    className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${outOfStock
                            ? "bg-red-50 text-red-500 border border-red-200"
                            : "bg-[#9BDD37]/15 text-[#669917] border border-[#9BDD37]/40"
                        }`}
                >
                    {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                </span>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                    <h3 className="font-semibold text-[#0A0F1A] text-base leading-snug mb-1">
                        {product.title}
                    </h3>
                    <p className="text-[#c0c0c0] text-sm leading-relaxed line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0f0f0]">
                    <span className="text-[#006B4F] font-bold text-lg">
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-[#c0c0c0] text-xs">{formatDate(product.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#c0c0c0] text-xs">
                    <MapPin size={12} className="shrink-0 text-[#669917]" />
                    <span className="truncate">{product.location}</span>
                </div>
            </div>
        </div>
    );
}

export default function Store() {
    const [data, setData] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSellerProfile()
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[#c0c0c0] sec-ff">
                <Loader2 size={36} className="animate-spin text-[#006B4F]" />
                <p className="text-sm">Loading store…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-red-500 sec-ff">
                <AlertCircle size={40} strokeWidth={1.5} />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    const { seller, products } = data;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    const stats = [
        { label: "Total Products", value: products.length, icon: Layers },
        { label: "Units in Stock", value: totalStock, icon: Package },
        { label: "Inventory Value", value: formatPrice(totalValue), icon: TrendingUp },
        { label: "Member Since", value: formatDate(seller.createdAt), icon: CalendarDays },
    ];

    return (
        <div className="min-h-screen bg-white text-[#0A0F1A] mb-10 mt-8 sec-ff">
            <div className="max-w-5xl mx-auto px-5 pb-20">

                {/* ── Header ─────────────────────────────────── */}
                <header className="bg-[#006B4F] -mx-5 px-5 py-10 mb-8">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                                <img
                                    src={seller.logo}
                                    alt={seller.businessName}
                                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#9BDD37]"
                                />
                                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#9BDD37] rounded-full border-2 border-[#006B4F]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    {seller.businessName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-white/60 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <img
                                            src={seller.institution.logo}
                                            alt={seller.institution.name}
                                            className="w-4 h-4 rounded-full object-cover"
                                        />
                                        {seller.institution.name}
                                    </span>
                                    <span className="text-white/30">·</span>
                                    <span>{seller.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Verified badge */}
                        <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#9BDD37] text-xs font-medium">
                            <ShieldCheck size={14} />
                            Verified Store
                        </div>
                    </div>
                </header>

                {/* ── Stats ──────────────────────────────────── */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="bg-white border border-[#e8e8e8] rounded-xl p-5 flex flex-col gap-3 hover:border-[#9BDD37] hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#c0c0c0] uppercase tracking-widest">
                                    {label}
                                </span>
                                <Icon size={15} className="text-[#669917]" />
                            </div>
                            <span className="text-xl font-bold text-[#0A0F1A] leading-none">
                                {value}
                            </span>
                        </div>
                    ))}
                </section>

                {/* ── Products ───────────────────────────────── */}
                <section>
                    <div className="flex items-baseline justify-between mb-5">
                        <h2 className="text-lg font-semibold text-[#0A0F1A]">Listings</h2>
                        <span className="text-[#c0c0c0] text-sm">{products.length} items</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}