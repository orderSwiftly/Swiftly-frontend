'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import PulseLoader from "@/components/pulse-loader";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
}

interface ShippingAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  totalPrice: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export default function GetConfirmedOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfirmedOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(
        `${api_url}/api/v1/order/get-confirmed-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setOrders(res.data.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching confirmed orders", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-10 text-left text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--light-bg)] px-4 max-w-5xl mx-auto space-y-8 pt-[70px]">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="text-[var(--acc-clr)] sec-ff flex items-center gap-1 group w-fit"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-150 group-hover:-translate-x-1"
        />
        <span className="hover:underline">Back to Dashboard</span>
      </Link>

      <h1 className="text-2xl font-bold text-[var(--txt-clr)] pry-ff">
        Confirmed Orders Ready for Shipping
      </h1>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <p className="text-sm text-gray-400 sec-ff">
                  <span className="font-medium text-white">Order ID:</span>{" "}
                  {order._id}
                </p>
                <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize sec-ff">
                  {order.orderStatus}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border border-white/10 bg-white/10 rounded-md p-3"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={item.productImg?.[0] || "/fallback.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--txt-clr)] pry-ff line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 sec-ff mt-1">
                        ₦{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-[var(--txt-clr)] sec-ff whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="text-sm text-gray-400 sec-ff">
                Shipping to: {order.shippingAddress.addressLine1},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-2">
                <p className="text-lg font-bold text-[var(--acc-clr)] sec-ff">
                  Total: ₦{order.totalPrice.toLocaleString()}
                </p>
                <Link
                  href={`/dashboard/my-orders/get-orders/${order._id}/shipping`}
                  className="bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold capitalize px-5 py-2 rounded-lg hover:opacity-90 sec-ff cursor-pointer transition"
                >
                  Ship Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 sec-ff">No confirmed orders found.</p>
      )}
    </div>
  );
}