"use client";

import { useEffect, useState } from "react";
import { fetchSellerOrders } from "@/lib/orders-api";
import { Order } from "@/types/order";
import PulseLoader from "../pulse-loader";
import Image from "next/image";

export default function SellerOrderCard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        fetchSellerOrders(token)
            .then((orders) =>
                setOrders(
                    orders.map((o) => ({
                        ...o,
                        id: typeof o._id === "string" ? o._id : o._id?.$oid,
                    }))
                )
            )
            .catch(() => setError("Failed to fetch orders"))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <PulseLoader />
            </div>
        );

    if (error)
        return <p className="text-center mt-8 text-red-500 pry-ff">{error}</p>;

    return (
        <main className="mt-8 mb-10 space-y-6 pry-ff">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Seller Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border rounded-2xl shadow-lg p-5 flex flex-col gap-4 bg-white dark:bg-gray-800 hover:shadow-2xl transition-shadow"
                        >
                            {/* Header: Order ID + Status */}
                            <div className="flex justify-between items-center w-full">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Order ID: <span className="font-medium text-gray-800 dark:text-white">{order.id}</span>
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" :
                                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                    }`}>
                                    {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                                </span>
                            </div>

                            {/* Products */}
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
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-2">
                                Total: ₦{order.total?.toLocaleString()}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mt-2 w-full">
                                <button className="bg-[var(--prof-clr)] text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors w-full sm:w-auto text-sm">
                                    Ship
                                </button>
                                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 sm:mt-0">
                                    00:30
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}