// src/app/(buyer)/dashboard/my-orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import GetOrders from "@/app/(buyer)/dashboard/my-orders/get-orders/page";
import { useUserStore } from "@/stores/userStore";
import { Order } from "@/types/order";
import axios from "axios";

export default function MyOrdersPage() {
  const { user } = useUserStore(); // Get current user from store
  const currentUserId = user?._id || null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingLoading, setShippingLoading] = useState<string | null>(null);

  const handleShipOrder = async (orderId: string) => {
    setShippingLoading(orderId);
    // Placeholder: buyers don't ship orders, sellers will implement this
    console.log("Ship order:", orderId);
    setTimeout(() => setShippingLoading(null), 2000); // mock async
  };

  // Fetch orders dynamically for the current user
  useEffect(() => {
    if (!currentUserId) return;

    const api_url = process.env.NEXT_PUBLIC_API_URL;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // auth token
        if (!token) return;

        const res = await axios.get<{ status: string; data: { orders: Order[] } }>(
          `${api_url}/api/v1/order/get-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "success") {
          setOrders(res.data.data.orders);
        } else {
          setOrders([]);
          console.error("Failed to fetch orders:", res.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [currentUserId]);

  return (
    <div className="min-h-screen w-full bg-[var(--light-bg)]">
      <main className="w-full pt-[10px] pb-20 flex justify-center px-2">
        <div className="w-full max-w-4xl">
          <GetOrders
            orders={orders}
            currentUserId={currentUserId}
            shippingLoading={shippingLoading}
            handleShipOrder={handleShipOrder}
          />
        </div>
      </main>
    </div>
  );
}