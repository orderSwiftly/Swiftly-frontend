// src/app/(buyer)/dashboard/my-orders/get-orders/page.tsx

"use client";

import OrdersHeader from "../components/orders-header";
import OrderCard from "../components/order-card";
import { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { getEmptyMessageByTab } from "@/lib/order-utils";
import { ORDER_PROGRESS_MAP } from "@/lib/order-progress";
import Image from "next/image";
import RateRiderModal from "@/components/rate-rider-modal";

type Tab = "active" | "passive";

interface Props {
  orders: Order[];
  currentUserId: string | null;
  shippingLoading: string | null;
  handleShipOrder: (orderId: string) => void;
}

function resolveId(id: string | { $oid: string } | undefined): string {
  if (!id) return "";
  return typeof id === "string" ? id : id.$oid;
}

function sortByProgress(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) =>
      (ORDER_PROGRESS_MAP[a.orderStatus] ?? -1) -
      (ORDER_PROGRESS_MAP[b.orderStatus] ?? -1)
  );
}

export default function GetOrders({
  orders = [],
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  // Auto-pop modal when buyer switches to delivered tab and there's an unrated order
  useEffect(() => {
    if (activeTab !== "passive" || !orders.length) return;

    const pending = orders.find(
      (o) =>
        o.orderStatus === "delivered" &&
        !o.riderRated &&
        !ratedIds.has(o._id)
    );

    if (pending) setRatingOrder(pending);
  }, [activeTab, orders]);

  const getFilteredOrders = (): Order[] => {
    switch (activeTab) {
      case "active":
        return sortByProgress(
          orders.filter((o) =>
            ["confirmed", "prepared", "collected"].includes(o.orderStatus)
          )
        );
      case "passive":
        return sortByProgress(
          orders.filter((o) =>
            ["delivered", "cancelled", "returned"].includes(o.orderStatus)
          )
        );
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="space-y-4">
      <OrdersHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] pry-ff text-[var(--sec-clr)]">
          <Image
            src="/no_orders.png"
            alt="No orders found"
            width={200}
            height={200}
            className="mb-4"
          />
          <p className="text-center text-gray-400 sec-ff mt-8">
            {getEmptyMessageByTab(activeTab)}
          </p>
        </div>
      ) : (
        filteredOrders.map((order, index) => (
          <OrderCard
            key={resolveId(order._id) || index}
            order={order}
            currentUserId={currentUserId || ""}
            shippingLoading={shippingLoading}
            handleShipOrder={handleShipOrder}
          />
        ))
      )}

      {/* Auto-pop rate modal for unrated delivered orders */}
      {ratingOrder && (
        <RateRiderModal
          orderId={ratingOrder._id}
          onClose={() => {
            setRatedIds((prev) => new Set(prev).add(ratingOrder._id));
            setRatingOrder(null);
          }}
          onDone={() => {
            setRatedIds((prev) => new Set(prev).add(ratingOrder._id));
            setRatingOrder(null);
          }}
        />
      )}
    </div>
  );
}