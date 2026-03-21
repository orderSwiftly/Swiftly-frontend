/* instead of claiming an order directly, 
 riders now send a request to claim, which the system processes asynchronously. 
 This allows for better handling of edge cases 
 like multiple riders trying to claim the same order at once. */

// src/components/riders/claimed-orders.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { getClaimedOrders, GetShippedOrder } from "@/lib/rider-order";
import { Loader2, AlertCircle, PackageSearch } from "lucide-react";
import CollectOrderButton from "@/components/riders/collect-order";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function ClaimedOrderCard({
    order,
    onCollected,
}: {
    order: GetShippedOrder;
    onCollected: (id: string) => void;
}) {
    const [error, setError] = useState<string | null>(null);

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
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Awaiting Collection
                </span>
                <span className="text-[10px] text-[#c0c0c0] font-medium">
                    #{order._id.slice(-6).toUpperCase()}
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
                        {formatPrice(order.pricing.deliveryFee)} delivery fee
                    </p>
                    <p className="text-xs text-[#c0c0c0] mt-0.5">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </p>
                </div>
            </div>

            {/* Dotted rows */}
            <div className="px-4 pb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Seller</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[160px] truncate text-right">
                        {order.seller_name}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Deliver To</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[140px] truncate text-right">
                        {deliveryAddress}
                    </span>
                </div>
            </div>

            {error && (
                <p className="px-4 pb-2 text-xs text-red-500 text-center">{error}</p>
            )}

            <div className="px-4 pb-4">
                <CollectOrderButton
                    orderId={order._id}
                    onSuccess={() => onCollected(order._id)}
                    onError={(msg) => setError(msg)}
                />
            </div>
        </div>
    );
}

export default function ClaimedOrders() {
    const [orders, setOrders] = useState<GetShippedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getClaimedOrders()
            .then(setOrders)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const removeOrder = useCallback((id: string) => {
        setOrders((prev) => prev.filter((o) => o._id !== id));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 gap-2 text-[#c0c0c0] sec-ff">
                <Loader2 size={18} className="animate-spin text-[#006B4F]" />
                <span className="text-sm">Loading claimed orders…</span>
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
                <PackageSearch size={36} strokeWidth={1.5} />
                <p className="text-sm">No claimed orders yet</p>
            </div>
        );
    }

    return (
        <section className="sec-ff mb-8">
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0A0F1A]">Claimed Orders</h2>
                <span className="text-[#c0c0c0] text-sm">{orders.length} pending</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <ClaimedOrderCard
                        key={order._id}
                        order={order}
                        onCollected={removeOrder}
                    />
                ))}
            </div>
        </section>
    );
}