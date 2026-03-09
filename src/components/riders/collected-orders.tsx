"use client";

import { useEffect, useState, useCallback } from "react";
import { getCollectedOrders, NearbyOrder } from "@/lib/rider-order";
import { Loader2, AlertCircle, Bike } from "lucide-react";
import { reverseGeocode } from "@/lib/seller";
import DeliverOrderButton from "@/components/riders/delivered-orders";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(price);
}

function CollectedOrderCard({
    order,
    onDelivered,
}: {
    order: NearbyOrder;
    onDelivered: (id: string) => void;
}) {
    const [pickupAddress, setPickupAddress] = useState("Loading...");
    const [error, setError] = useState<string | null>(null);

    const [lng, lat] = order.seller_location.coordinates;

    useEffect(() => {
        reverseGeocode(lat, lng).then(setPickupAddress);
    }, [lat, lng]);

    const firstItem = order.items[0];
    const extraItems = order.items.length - 1;

    return (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden sec-ff shadow-sm">
            {/* Status pill */}
            <div className="px-4 pt-3 pb-0 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    In Transit
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
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.paymentStatus}
                    </p>
                </div>
            </div>

            {/* Dotted rows */}
            <div className="px-4 pb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#c0c0c0] shrink-0">Picked Up From</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span
                        className="text-xs text-[#0A0F1A] font-medium shrink-0 max-w-[130px] truncate text-right"
                        title={pickupAddress}
                    >
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
                    <span className="text-xs text-[#c0c0c0] shrink-0">Delivery Code</span>
                    <div className="flex-1 border-t border-dashed border-[#e0e0e0] mx-2" />
                    <span className="text-xs text-[#0A0F1A] font-bold shrink-0 tracking-widest">
                        {order.deliveryCode}
                    </span>
                </div>
            </div>

            {error && (
                <p className="px-4 pb-2 text-xs text-red-500 text-center">{error}</p>
            )}

            <div className="px-4 pb-4">
                <DeliverOrderButton
                    orderId={order._id}
                    onSuccess={() => onDelivered(order._id)}
                    onError={(msg) => setError(msg)}
                />
            </div>
        </div>
    );
}

export default function CollectedOrders() {
    const [orders, setOrders] = useState<NearbyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCollectedOrders()
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
                <span className="text-sm">Loading in-transit orders…</span>
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
                <Bike size={36} strokeWidth={1.5} />
                <p className="text-sm">No orders in transit</p>
            </div>
        );
    }

    return (
        <section className="sec-ff mb-8">
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0A0F1A]">In Transit</h2>
                <span className="text-[#c0c0c0] text-sm">{orders.length} active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <CollectedOrderCard
                        key={order._id}
                        order={order}
                        onDelivered={removeOrder}
                    />
                ))}
            </div>
        </section>
    );
}