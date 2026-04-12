// src/components/riders/delivered-orders.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { getDeliveredOrders, GetShippedOrder } from "@/lib/rider-order";
import { Loader2, AlertCircle, PackageCheck, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function DeliveredOrderCard({ order }: Readonly<{ order: GetShippedOrder }>) {
    const firstItem = order.items[0];
    const extraItems = order.items.length - 1;

    const deliveryAddress =
        order.shippingAddress.building && order.shippingAddress.room
            ? `${order.shippingAddress.building}, Room ${order.shippingAddress.room}`
            : order.shippingAddress.addressLine1 || order.shippingAddress.city;

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden sec-ff shadow-sm">
            {/* Status pill */}
            <div className="px-4 pt-3 pb-0 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#669917] bg-[#f3fae5] border border-[#d4edaa] px-2.5 py-1 rounded-full">
                    <PackageCheck size={10} />
                    Delivered
                </span>
                <span className="text-[10px] text-[#c0c0c0] font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                </span>
            </div>

            {/* Image + info */}
            <div className="flex gap-3 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#f5f5f5]">
                    <img
                        src={firstItem.productImg[0]}
                        alt={firstItem.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A0F1A] leading-snug line-clamp-2">
                        {firstItem.title}
                        {extraItems > 0 && (
                            <span className="text-[#c0c0c0] font-normal"> +{extraItems} more</span>
                        )}
                    </p>
                    <p className="text-xs text-[#669917] font-medium mt-0.5">
                        {formatPrice(order.pricing.deliveryFee)} earned
                    </p>
                    <p className="text-xs text-[#c0c0c0] mt-0.5">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </p>
                </div>
            </div>

            {/* Dotted rows */}
            <div className="px-4 pb-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Store name</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[160px] truncate text-right">
                        {order.seller_name}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Delivered To</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[140px] truncate text-right">
                        {deliveryAddress}
                    </span>
                </div>
                {order.delivered_at && (
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-[#c0c0c0] shrink-0">Delivered On</span>
                        <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                        <span className="text-xs text-[#0A0F1A] font-medium shrink-0">
                            {formatDate(order.delivered_at)}
                        </span>
                    </div>
                )}
            </div>
            {/* Add View Details button at the bottom */}
        <div className="px-4 pb-4 pt-2">
        <Link
          href={`/rider/dashboard/orders/${order._id}`}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#669917] bg-[#f3fae5] border border-[#d4edaa] px-3 py-2 rounded-xl hover:bg-[#e8f5db] transition-colors"
        >
          <Eye size={14} />
          View Order Details
        </Link>
      </div>
        </div>
    );
}

export default function DeliveredOrders() {
    const [orders, setOrders] = useState<GetShippedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchPage = useCallback((p: number) => {
        setLoading(true);
        getDeliveredOrders(p)
            .then(({ data, meta }) => {
                setOrders(data);
                setTotalPages(meta.totalPages);
                setTotal(meta.total);
                setPage(p);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 gap-2 text-[#c0c0c0] sec-ff">
                <Loader2 size={18} className="animate-spin text-[#006B4F]" />
                <span className="text-sm">Loading delivered orders…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center gap-2 py-8 text-red-400 sec-ff">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#c0c0c0] sec-ff">
                <PackageCheck size={36} strokeWidth={1.5} />
                <p className="text-sm">No delivered orders yet</p>
            </div>
        );
    }

    return (
        <section className="sec-ff">
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0A0F1A]">Delivered Orders</h2>
                <span className="text-[#c0c0c0] text-sm">{total} total</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <DeliveredOrderCard key={order._id} order={order} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => fetchPage(page - 1)}
                        disabled={page === 1}
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#e8e8e8] text-[#0A0F1A] disabled:opacity-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={15} />
                    </button>
                    <span className="text-xs text-[#c0c0c0] sec-ff">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => fetchPage(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#e8e8e8] text-[#0A0F1A] disabled:opacity-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            )}
        </section>
    );
}