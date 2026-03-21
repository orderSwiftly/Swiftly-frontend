"use client";

import { useEffect, useState, useCallback } from "react";
import { getActiveOrders, GetShippedOrder } from "@/lib/rider-order";
import { Loader2, AlertCircle, Bike } from "lucide-react";
import CollectOrderButton from "@/components/riders/collect-order";
import DeliverOrderButton from "@/components/riders/deliver-order";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

type ActiveOrder = GetShippedOrder & { kind: "claimed" | "collected" };

function ActiveOrderCard({
    order,
    onRemove,
}: {
    order: ActiveOrder;
    onRemove: (id: string) => void;
}) {
    const [error, setError] = useState<string | null>(null);

    const firstItem = order.items[0];
    const extraItems = order.items.length - 1;
    const isClaimed = order.kind === "claimed";

    const deliveryAddress =
        order.shippingAddress.building && order.shippingAddress.room
            ? `${order.shippingAddress.building}, Room ${order.shippingAddress.room}`
            : order.shippingAddress.addressLine1 || order.shippingAddress.city;

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden sec-ff shadow-sm mb-10">
            {/* Status pill */}
            <div className="px-4 pt-3 pb-0 flex items-center justify-between">
                {isClaimed ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting Collection
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Collected
                    </span>
                )}
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
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.paymentStatus}
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
                {!isClaimed && (
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-[#c0c0c0] shrink-0">Delivery Code</span>
                        <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                        <span className="text-xs text-[#0A0F1A] font-bold shrink-0 tracking-widest">
                            {order.deliveryCode}
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <p className="px-4 pb-2 text-xs text-red-500 text-center">{error}</p>
            )}

            <div className="px-4 pb-4">
                {isClaimed ? (
                    <CollectOrderButton
                        orderId={order._id}
                        onSuccess={() => onRemove(order._id)}
                        onError={(msg) => setError(msg)}
                    />
                ) : (
                    <DeliverOrderButton
                        orderId={order._id}
                        onSuccess={() => onRemove(order._id)}
                        onError={(msg) => setError(msg)}
                    />
                )}
            </div>
        </div>
    );
}

export default function ActiveOrders() {
    const [orders, setOrders] = useState<ActiveOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getClaimedOrders(), getActiveOrders()])
            .then(([claimed, active]) => {
                const merged: ActiveOrder[] = [
                    ...claimed.map((o) => ({ ...o, kind: "claimed" as const })),
                    ...active.map((o) => ({ ...o, kind: "active" as const })),
                ];
                setOrders(merged);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const removeOrder = useCallback((id: string) => {
        setOrders((prev) => prev.filter((o) => o._id !== id));
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-[#c0c0c0] sec-ff">
                <Loader2 size={36} className="animate-spin text-[#006B4F]" />
                <p className="text-sm">Loading active orders…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-red-500 sec-ff">
                <AlertCircle size={40} strokeWidth={1.5} />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-[#c0c0c0] sec-ff">
                <Bike size={40} strokeWidth={1.5} />
                <p className="text-sm">No active orders</p>
            </div>
        );
    }

    return (
        <div className="sec-ff">
            <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#0A0F1A]">Active Orders</h2>
                <span className="text-[#c0c0c0] text-sm">{orders.length} active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((order) => (
                    <ActiveOrderCard
                        key={order._id}
                        order={order}
                        onRemove={removeOrder}
                    />
                ))}
            </div>
        </div>
    );
}