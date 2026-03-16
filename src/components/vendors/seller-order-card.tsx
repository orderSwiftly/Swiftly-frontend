"use client";

import { useEffect, useState } from "react";
import { fetchSellerOrders } from "@/lib/orders-api";
import { Order } from "@/types/order";
import PulseLoader from "../pulse-loader";
import Image from "next/image";
import ShipButton from "./ship-button";
import { checkCanShipOrder } from "@/lib/order-utils";

interface SellerProfile {
    _id: string;
    fullname: string;
    email: string;
    role: string;
}

function resolveId(id: string | { $oid: string } | undefined): string {
    if (!id) return "";
    return typeof id === "string" ? id : id.$oid;
}

export default function SellerOrderCard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);

    const fetchProfile = async () => {
        try {
            const api_url = process.env.NEXT_PUBLIC_API_URL;
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const res = await fetch(`${api_url}/api/v1/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok && data.status === "success") {
                setSellerProfile(data.data.user);
            } else {
                throw new Error(data.message || "Failed to fetch profile");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Seller not logged in or invalid profile");
        }
    };

    const loadOrders = async () => {
        if (!sellerProfile) return;
        try {
            const token = localStorage.getItem("token") || "";
            const fetchedOrders = await fetchSellerOrders(token);
            setOrders(fetchedOrders);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);
    useEffect(() => { if (sellerProfile) loadOrders(); }, [sellerProfile]);

    const handleShipped = (orderId: string) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (resolveId(order._id) !== orderId) return order;
                return {
                    ...order,
                    orderStatus: "shipped",
                    items: order.items.map((item) => ({ ...item, itemStatus: "shipped" })),
                };
            })
        );
    };

    if (loading) return <div className="flex items-center justify-center h-64"><PulseLoader /></div>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!sellerProfile) return <p className="text-center mt-8 text-red-500">Seller profile not found</p>;

    return (
        <main className="mt-8 mb-10 space-y-6 pry-ff">
            <h1 className="text-3xl font-bold text-center text-[var(--pry-clr)] mb-6">
                Seller Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-[var(--sec-clr)] sec-ff">No orders found</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => {
                        const orderId = resolveId(order._id);
                        if (!orderId) return null;

                        const canShip = checkCanShipOrder(order, sellerProfile._id);
                        const shortId = `#${orderId.slice(-8).toUpperCase()}`;
                        const total = order.pricing?.total ?? 0;

                        return (
                            <div
                                key={orderId}
                                className="rounded-2xl p-5 flex flex-col gap-4 transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]"
                                style={{
                                    backgroundColor: '#f6faf3',
                                    border: '1px solid rgba(0,107,79,0.1)',
                                    boxShadow: '0 2px 16px rgba(0,107,79,0.07)',
                                }}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <p className="text-sm text-[var(--sec-clr)] sec-ff">
                                        Order ID: <span className="font-semibold text-[var(--pry-clr)]">{shortId}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-xs px-2.5 py-1 rounded-full font-medium sec-ff capitalize"
                                            style={
                                                order.paymentStatus === "paid"
                                                    ? { background: 'rgba(102,153,23,0.12)', color: 'var(--prof-clr)', border: '1px solid rgba(102,153,23,0.25)' }
                                                    : { background: 'rgba(234,179,8,0.12)', color: '#b45309', border: '1px solid rgba(234,179,8,0.3)' }
                                            }
                                        >
                                            {order.paymentStatus}
                                        </span>
                                        <span
                                            className="text-xs px-2.5 py-1 rounded-full font-medium sec-ff capitalize"
                                            style={{ background: 'rgba(0,107,79,0.08)', color: 'var(--bg-clr)', border: '1px solid rgba(0,107,79,0.15)' }}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, index) => (
                                        <div key={resolveId(item.productId) || index} className="flex items-center gap-3">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 relative overflow-hidden rounded-xl flex-shrink-0"
                                                style={{ border: '1px solid rgba(0,107,79,0.12)' }}>
                                                <Image
                                                    src={item.productImg?.[0] || "/fallback.jpg"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-[var(--pry-clr)] text-sm truncate pry-ff">{item.title}</h4>
                                                <p className="text-[var(--bg-clr)] text-xs sec-ff opacity-80 mt-0.5">
                                                    Qty: {item.quantity} · ₦{item.lineTotal?.toLocaleString()}
                                                </p>
                                                {item.itemStatus === "shipped" && (
                                                    <span className="text-xs font-medium sec-ff"
                                                        style={{ color: 'var(--prof-clr)' }}>
                                                        Shipped ✓
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center flex-wrap gap-2 pt-2"
                                    style={{ borderTop: '1px solid rgba(0,107,79,0.1)' }}>
                                    <p className="text-sm font-bold text-[var(--bg-clr)] sec-ff">
                                        Total: ₦{total.toLocaleString()}
                                    </p>
                                    <ShipButton
                                        orderId={orderId}
                                        canShip={canShip}
                                        onShipped={() => handleShipped(orderId)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}