// src/app/(buyer)/dashboard/my-orders/components/order-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import OrderProgress from "../components/order-progress";
import { ORDER_PROGRESS_MAP } from "@/lib/order-progress";

interface Props {
  readonly order: Order;
  readonly currentUserId: string;
  readonly shippingLoading: string | null;
  readonly handleShipOrder: (orderId: string) => void;
}

export default function OrderCard({
  order,
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Props) {
  const router = useRouter();

  const isOwner = order.items?.some(
    (item) => item.productOwnerId === currentUserId
  );

  // --- SAFE TOTAL ---
  const computedTotalPrice = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : 0;
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + price * quantity;
    }, 0)
    : 0;

  const safeTotalPrice =
    typeof order.totalPrice === "number" && order.totalPrice > 0
      ? order.totalPrice
      : computedTotalPrice;

  const shippingAddress = order.shippingAddress || {
    addressLine1: "N/A",
    city: "N/A",
    state: "N/A",
  };

  const progress =
    ORDER_PROGRESS_MAP[order.orderStatus ?? ""] ?? 0;

  return (
    <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5 pry-ff shadow-sm">
      {/* Header */}
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Order ID:</span>{" "}
          {order._id ?? "—"}
        </p>
        <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize">
          {order.orderStatus ?? "pending"}
        </p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {order.items?.map((item, index) => {
          const price = item.price ?? 0;
          const quantity = item.quantity ?? 0;
          const total = price * quantity;

          return (
            <div
              key={index}
              className="flex items-center gap-4 border border-white/10 bg-white/5 rounded-lg p-4"
            >
              <div className="w-20 h-20 relative overflow-hidden rounded-lg">
                <Image
                  src={item.productImg?.[0] || "/fallback.jpg"}
                  alt={item.title ?? "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">
                  ₦{price.toLocaleString()} × {quantity}
                </p>
              </div>

              <p className="font-bold text-white">
                ₦{total.toLocaleString()}
              </p>

              <Trash2 className="text-gray-400 hover:text-red-400 cursor-pointer" />
            </div>
          );
        })}
      </div>

      {/* ✅ SHIPPING ADDRESS & TOTAL (RESTORED) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
        <div>
          <p className="text-xs text-gray-500 mb-1">Shipping to:</p>
          <p className="text-sm text-gray-300">
            {shippingAddress.addressLine1}, {shippingAddress.city},{" "}
            {shippingAddress.state}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Order Total</p>
          <p className="text-xl font-bold text-[var(--acc-clr)]">
            ₦{safeTotalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-start gap-4">
        <Link
          href={`/dashboard/my-orders/get-orders/${order._id}`}
          className="text-[var(--acc-clr)] flex items-center gap-1"
        >
          View Order <ArrowRight size={16} />
        </Link>

        <div className="flex flex-col items-stretch gap-2 w-full max-w-xs">
          {order.paymentStatus !== "paid" && !isOwner && (
            <>
              <button
                onClick={() => router.push(`/order/${order._id}/payment`)}
                className="bg-[var(--acc-clr)] text-white px-5 py-2 rounded-lg cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </>
          )}

          {order.orderStatus === "confirmed" && isOwner && (
            <button
              onClick={() => handleShipOrder(order._id)}
              disabled={shippingLoading === order._id}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {shippingLoading === order._id ? "Shipping..." : "Ship Order"}
            </button>
          )}
        </div>
      </div>
      <OrderProgress filled={progress} />
    </section>
  );
}