"use client";

import { useEffect, useState, useCallback } from "react";
import getShippedOrders, { GetShippedOrder, claimOrder } from "@/lib/rider-order";
import { Loader2, AlertCircle, BadgeCheck, ShoppingBag } from "lucide-react";
import CollectOrderButton from "@/components/riders/collect-order";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function OrderCard({
    order,
    onClaimed,
    onDeclined,
}: {
    order: GetShippedOrder;
    onClaimed: (id: string) => void;
    onDeclined: (id: string) => void;
}) {
    const [claiming, setClaiming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [claimed, setClaimed] = useState(false);

    const handleAccept = async () => {
        setClaiming(true);
        setError(null);
        try {
            await claimOrder(order._id);
            setClaimed(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to claim order");
        } finally {
            setClaiming(false);
        }
    };

    const firstItem = order.items[0];
    const extraItems = order.items.length - 1;

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden sec-ff shadow-sm mb-10">

            {/* Top: image + order info */}
            <div className="flex gap-3 p-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#f5f5f5]">
                    <img
                        src={firstItem.productImg[0]}
                        alt={firstItem.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-[#0A0F1A] leading-snug line-clamp-2">
                            {firstItem.title}
                            {extraItems > 0 && (
                                <span className="text-[#c0c0c0] font-normal"> +{extraItems} more</span>
                            )}
                        </p>
                        <span className="shrink-0 w-6 h-6 rounded-full bg-[#0A0F1A] text-white text-xs font-bold flex items-center justify-center">
                            {order.items.reduce((s, i) => s + i.quantity, 0)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                        <ShoppingBag size={11} className="text-[#669917]" />
                        <span className="text-xs text-[#669917] font-medium">
                            {formatPrice(order.pricing.deliveryFee)} delivery fee
                        </span>
                    </div>

                    <p className="text-xs text-[#c0c0c0] mt-0.5">
                        Payment: <span className="text-[#0A0F1A] font-medium">{order.paymentStatus}</span>
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
                        {order.shippingAddress.building || order.shippingAddress.room}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Order</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0">
                        #{order._id.slice(-6).toUpperCase()}
                    </span>
                </div>
            </div>

            {error && (
                <p className="px-4 pb-2 text-xs text-red-500 text-center">{error}</p>
            )}

            {claimed ? (
                <div className="px-4 pb-4">
                    <CollectOrderButton
                        orderId={order._id}
                        onSuccess={() => onClaimed(order._id)}
                        onError={(msg) => setError(msg)}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 px-4 pb-4">
                    <button
                        onClick={handleAccept}
                        disabled={claiming}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#006B4F] hover:bg-[#005540] disabled:opacity-60 text-[var(--txt-clr)] text-sm font-semibold transition-colors w-full cursor-pointer"
                    >
                        {claiming ? <Loader2 size={14} className="animate-spin" /> : null}
                        Accept
                    </button>
                </div>
            )}
        </div>
    );
}

export default function NearestOrders() {
    const [orders, setOrders] = useState<GetShippedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getShippedOrders()
            .then(setOrders)
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
                <p className="text-sm">Loading shipped orders…</p>
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
                <BadgeCheck size={40} strokeWidth={1.5} className="text-[#9BDD37]" />
                <p className="text-sm">No shipped orders at the moment</p>
            </div>
        );
    }

    return (
        <div className="sec-ff">
            <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#0A0F1A]">Shipped Orders</h2>
                <span className="text-[#c0c0c0] text-sm">{orders.length} available</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onClaimed={removeOrder}
                        onDeclined={removeOrder}
                    />
                ))}
            </div>
        </div>
    );
}