"use client";

import { useEffect, useState } from "react";
import { getClaimedOrders, NearbyOrder } from "@/lib/rider-order";
import { reverseGeocode } from "@/lib/seller";
import CollectOrderButton from "@/components/riders/collect-order";
import { Loader2, AlertCircle, ShoppingBag, PackageSearch } from "lucide-react";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function ClaimedOrderCard({ order, onCollected }: { order: NearbyOrder; onCollected: (id: string) => void }) {
    const [pickupAddress, setPickupAddress] = useState<string>("Loading...");
    const [error, setError] = useState<string | null>(null);

    const [lng, lat] = order.seller_location.coordinates;

    useEffect(() => {
        reverseGeocode(lat, lng).then(setPickupAddress);
    }, [lat, lng]);

    const firstItem = order.items[0];
    const extraItems = order.items.length - 1;

    

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden sec-ff shadow-sm">

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
                    <span className="text-xs text-[#c0c0c0] shrink-0">Pick Up</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[160px] truncate text-right" title={pickupAddress}>
                        {pickupAddress}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Deliver To</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[140px] truncate text-right">
                        {order.shippingAddress.addressLine1 || order.shippingAddress.city}
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
    const [orders, setOrders] = useState<NearbyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getClaimedOrders()
            .then(setOrders)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const removeOrder = (id: string) => {
        setOrders((prev) => prev.filter((o) => o._id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 text-[#c0c0c0] sec-ff">
                <Loader2 size={28} className="animate-spin text-[#006B4F]" />
                <p className="text-sm">Loading claimed orders…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 text-red-500 sec-ff">
                <AlertCircle size={32} strokeWidth={1.5} />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (orders.length === 0) return null;

    return (
        <div className="sec-ff mb-10">
            <div className="flex items-baseline justify-between mb-5">
                <div className="flex items-center gap-2">
                    <PackageSearch size={16} className="text-[#669917]" />
                    <h2 className="text-lg font-semibold text-[#0A0F1A]">Claimed Orders</h2>
                </div>
                <span className="text-[#c0c0c0] text-sm">{orders.length} pending</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((order) => (
                    <ClaimedOrderCard
                        key={order._id}
                        order={order}
                        onCollected={removeOrder}
                    />
                ))}
            </div>
        </div>
    );
}