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

    const fetchOrders = async () => {
        if (!sellerProfile) return;
        try {
            const token = localStorage.getItem("token") || "";
            const fetchedOrders = await fetchSellerOrders(token);

            const normalized: Order[] = fetchedOrders.map((o: Order) => ({
                ...o,
                id: typeof o._id === "string" ? o._id : o._id?.$oid ?? "",
            }));
            setOrders(normalized);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (sellerProfile) fetchOrders();
    }, [sellerProfile]);

    /**
     * Optimistically mark all items in this order as shipped
     * so the button disables instantly without waiting for a refetch.
     */
    const handleShipped = (orderId: string) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id !== orderId) return order;
                return {
                    ...order,
                    orderStatus: "shipped",
                    items: order.items.map((item) => ({
                        ...item,
                        itemStatus: "shipped",
                    })),
                };
            })
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <PulseLoader />
            </div>
        );
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    if (!sellerProfile) {
        return (
            <p className="text-center mt-8 text-red-500">Seller profile not found</p>
        );
    }

    return (
        <main className="mt-8 mb-10 space-y-6 pry-ff">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Seller Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => {
                        if (!order.id) return null;
                        const canShip = checkCanShipOrder(order, sellerProfile._id);

                        return (
                            <div
                                key={order.id}
                                className="border rounded-2xl shadow-lg p-5 flex flex-col gap-4 bg-white dark:bg-gray-800 hover:shadow-2xl transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center w-full flex-wrap gap-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Order ID:{" "}
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {order.id}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${order.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                                }`}
                                        >
                                            {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={item.productId.$oid || index}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-16 h-16 relative overflow-hidden rounded-lg flex-shrink-0">
                                                <Image
                                                    src={item.productImg?.[0] || "/fallback.jpg"}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                    Qty: {item.quantity} | ₦{item.lineTotal?.toLocaleString()}
                                                </p>
                                                {item.itemStatus === "shipped" && (
                                                    <span className="text-xs text-blue-500 font-medium">
                                                        Shipped ✓
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-2">
                                    Total: ₦
                                    {(
                                        order.pricing?.total ?? order.total
                                    )?.toLocaleString()}
                                </p>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mt-2 w-full">
                                    <ShipButton
                                        orderId={order.id}
                                        canShip={canShip}
                                        onShipped={() => handleShipped(order.id!)}
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